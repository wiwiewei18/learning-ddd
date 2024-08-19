/* eslint-disable no-await-in-loop */
import { v4 as uuidv4 } from 'uuid';
import { Either, left, right } from '../../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import { ProductCategory } from '../../../domain/product/entities/productCategory/productCategory';
import {
  ProductVariant,
  VariantImageBuffers,
  VariantImageUrls,
} from '../../../domain/product/entities/productVariant/productVariant';
import { ProductVariantAttribute } from '../../../domain/product/entities/productVariant/valueObjects/variantAttribute';
import { ProductImageExtensions, ProductImageSizes } from '../../../domain/product/imageConfig';
import { Product } from '../../../domain/product/product';
import { BaseProductName } from '../../../domain/product/valueObjects/baseProductName';
import { ProductPrice } from '../../../domain/product/valueObjects/productPrice';
import { ProductService } from '../../../domain/services/productService';
import { StoreFront } from '../../../domain/storeFront/storeFront';
import { BaseProductRepo } from '../../../repos/product/baseProductRepo/baseProductRepo';
import { ProductCategoryRepo } from '../../../repos/product/categoryRepo/categoryRepo';
import { StoreFrontRepo } from '../../../repos/storeFront/storeFrontRepo';
import { ContentStorageService, ContentTypes } from '../../../services/contentStorageService/contentStorageService';
import { ImageResizeConfig, ImageService } from '../../../services/imageService/imageService';
import { CreateProductErrors } from './createProductErrors';
import { CreateProductRequestDTO } from './createProductRequestDTO';

type Response = Either<
  | CreateProductErrors.NameAlreadyTaken
  | CreateProductErrors.CategoryDoesntExists
  | CreateProductErrors.StoreFrontDoesntExists
  | CreateProductErrors.DuplicateVariantAttributeOption
  | CreateProductErrors.NoDefaultVariant
  | CreateProductErrors.TooManyDefaultVariant
  | SuccessOrFailure<any>,
  SuccessOrFailure<void>
>;

export class CreateProductUseCase implements UseCase<CreateProductRequestDTO, Promise<Response>> {
  private productRepo: BaseProductRepo;
  private productService: ProductService;
  private productCategoryRepo: ProductCategoryRepo;
  private storeFrontRepo: StoreFrontRepo;
  private imageService: ImageService;
  private contentStorageService: ContentStorageService;

  constructor(
    productRepo: BaseProductRepo,
    productService: ProductService,
    productCategoryRepo: ProductCategoryRepo,
    storeFrontRepo: StoreFrontRepo,
    imageService: ImageService,
    contentStorageService: ContentStorageService,
  ) {
    this.productRepo = productRepo;
    this.productService = productService;
    this.productCategoryRepo = productCategoryRepo;
    this.storeFrontRepo = storeFrontRepo;
    this.imageService = imageService;
    this.contentStorageService = contentStorageService;
  }

  private async getCategory(
    categoryId: string,
  ): Promise<Either<CreateProductErrors.CategoryDoesntExists, SuccessOrFailure<ProductCategory>>> {
    const searchedCategoryById = await this.productCategoryRepo.getCategoryById(categoryId);
    if (searchedCategoryById.isNotFound) {
      return left(new CreateProductErrors.CategoryDoesntExists());
    }

    const productCategory = searchedCategoryById.getValue() as ProductCategory;
    return right(Result.ok<ProductCategory>(productCategory));
  }

  private async getStoreFront(
    storeFrontId: string,
  ): Promise<Either<CreateProductErrors.StoreFrontDoesntExists, SuccessOrFailure<StoreFront>>> {
    const searchedStoreFrontById = await this.storeFrontRepo.getStoreFrontById(storeFrontId);
    if (searchedStoreFrontById.isNotFound) {
      return left(new CreateProductErrors.StoreFrontDoesntExists());
    }

    const storeFront = searchedStoreFrontById.getValue() as StoreFront;
    return right(Result.ok<StoreFront>(storeFront));
  }

  async execute(request: CreateProductRequestDTO): Promise<Response> {
    const searchedProductByName = await this.productRepo.getProductByName(request.name);

    if (searchedProductByName.isFound) {
      return left(new CreateProductErrors.NameAlreadyTaken());
    }

    const productNameOrError = BaseProductName.create(request.name);
    if (productNameOrError.isFailure) {
      return left(Result.fail<BaseProductName>(productNameOrError.getErrorValue()));
    }

    const productName = productNameOrError.getValue() as BaseProductName;

    const asyncResults = await Promise.all([
      this.getCategory(request.productCategoryId),
      this.getStoreFront(request.storeFrontId),
    ]);

    for (const result of asyncResults) {
      if (result.isLeft()) {
        return left(result.value);
      }
    }

    const [productCategoryResult, storeFrontResult] = asyncResults;

    const productCategory = productCategoryResult.value.getValue() as ProductCategory;
    const storeFront = storeFrontResult.value.getValue() as StoreFront;

    const savedImageUrls = [];

    const resizedImageCoverBuffer = await this.imageService.resizeImage(
      request.imageCover.buffer,
      this.getThumbnailImageConfig(),
    );

    const imageCoverUrl = await this.getImageCoverUrl(resizedImageCoverBuffer, productName.value);

    savedImageUrls.push(imageCoverUrl);

    const productOrError = Product.create({
      productCategoryId: productCategory.productCategoryId,
      description: request.description,
      name: productName,
      storeFrontId: storeFront.storeFrontId,
      imageCoverUrl,
    });

    if (productOrError.isFailure) {
      await this.deleteSavedImages(savedImageUrls);

      return left(Result.fail<Product>(productOrError.getErrorValue()));
    }

    const product = productOrError.getValue() as Product;

    const productVariants: ProductVariant[] = [];
    for (const rawVariant of request.variants) {
      if (request.variants.length > 1 && !rawVariant.attributes) {
        await this.deleteSavedImages(savedImageUrls);

        return left(Result.fail(`When product has variant, should have attributes`));
      }

      let attributes: ProductVariantAttribute[] = [];
      if (rawVariant.attributes) {
        const attributeResults = rawVariant.attributes.map((a) => {
          return ProductVariantAttribute.create({ name: a.name, option: a.option });
        });

        for (const result of attributeResults) {
          if (result.isFailure) {
            await this.deleteSavedImages(savedImageUrls);

            return left(result);
          }
        }

        attributes = attributeResults.map((a) => a.getValue()) as ProductVariantAttribute[];
      }

      const productPriceOrError = ProductPrice.create(rawVariant.price);
      if (productPriceOrError.isFailure) {
        await this.deleteSavedImages(savedImageUrls);

        return left(productPriceOrError);
      }

      let thumbnailImageUrl;
      let regularImageUrl;
      if (rawVariant.image) {
        const resizedVariantImageBuffers = await this.getVariantImageBuffers(rawVariant.image.buffer);

        const productVariantName = `${productName.value}${
          attributes && attributes.length ? ` - ${attributes.map((a) => a.option).join(', ')}` : ''
        }`;

        const variantImageUrls = await this.getVariantImageUrls(resizedVariantImageBuffers, productVariantName);

        thumbnailImageUrl = variantImageUrls.thumbnailImageUrl;
        regularImageUrl = variantImageUrls.regularImageUrl;

        savedImageUrls.push(thumbnailImageUrl, regularImageUrl);
      }

      const productPrice = productPriceOrError.getValue() as ProductPrice;

      const productVariantOrError = ProductVariant.create({
        baseProductId: product.baseProductId,
        thumbnailImageUrl,
        regularImageUrl,
        price: productPrice,
        stock: rawVariant.stock,
        attributes,
        isDefault: rawVariant.isDefault,
      });

      if (productVariantOrError.isFailure) {
        await this.deleteSavedImages(savedImageUrls);

        return left(productVariantOrError);
      }

      productVariants.push(productVariantOrError.getValue() as ProductVariant);
    }

    const createProductResult = this.productService.createProduct(product, productVariants);

    if (createProductResult.isLeft()) {
      await this.deleteSavedImages(savedImageUrls);

      return left(createProductResult.value);
    }

    await this.productRepo.save(product);

    return right(Result.ok<void>());
  }

  private async deleteSavedImages(savedImageUrls: string[]): Promise<void> {
    await Promise.all(savedImageUrls.map(async (imgUrl) => this.contentStorageService.deleteByUrl(imgUrl)));
  }

  private getThumbnailImageConfig(): ImageResizeConfig {
    return { extension: ProductImageExtensions.WEBP, width: ProductImageSizes.THUMBNAIL };
  }

  private getRegularImageConfig(): ImageResizeConfig {
    return { extension: ProductImageExtensions.WEBP, width: ProductImageSizes.REGULAR };
  }

  private async getImageCoverUrl(resizedBuffer: Buffer, productName: string): Promise<string> {
    const imageCoverName = `${uuidv4()}-${Date.now()}-${productName}.${ProductImageExtensions.WEBP}`;
    return this.contentStorageService.save(ContentTypes.IMAGE, imageCoverName, resizedBuffer);
  }

  private async getVariantImageBuffers(rawBuffer: Buffer): Promise<VariantImageBuffers> {
    const resizedImageOptions = [this.getRegularImageConfig(), this.getThumbnailImageConfig()];

    const resizedImageBuffers = await this.imageService.resizeImageBulk(rawBuffer, resizedImageOptions);

    const thumbnailImageBuffer = resizedImageBuffers.find((i) => i.config.width === ProductImageSizes.THUMBNAIL)
      ?.buffer as Buffer;
    const regularImageBuffer = resizedImageBuffers.find((i) => i.config.width === ProductImageSizes.REGULAR)
      ?.buffer as Buffer;

    return {
      regularImageBuffer,
      thumbnailImageBuffer,
    };
  }

  private async getVariantImageUrls(resizedBuffers: VariantImageBuffers, variantName: string): Promise<VariantImageUrls> {
    const thumbnailImageName = `${uuidv4()}-${Date.now()}-${variantName}-thumbnail.${ProductImageExtensions.WEBP}`;
    const regularImageName = `${uuidv4()}-${Date.now()}-${variantName}-regular.${ProductImageExtensions.WEBP}`;

    const thumbnailImageUrl = await this.contentStorageService.save(
      ContentTypes.IMAGE,
      thumbnailImageName,
      resizedBuffers.thumbnailImageBuffer,
    );
    const regularImageUrl = await this.contentStorageService.save(
      ContentTypes.IMAGE,
      regularImageName,
      resizedBuffers.regularImageBuffer,
    );

    return {
      regularImageUrl,
      thumbnailImageUrl,
    };
  }
}
