import { RequestHandler, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { BaseController, RequestMethods } from '../../../../../shared/infra/http/models/BaseController';
import { TypedRequest } from '../../../../../shared/infra/http/models/typedRequest';
import { CreateProductErrors } from './createProductErrors';
import {
  CreateProductRequestDTO,
  ImagePropsRequestDTO,
  ProductAttributeRequestDTO,
  ProductVariantRequestDTO,
} from './createProductRequestDTO';
import { CreateProductUseCase } from './createProductUseCase';

type FilesExpressRequest = {
  imageCover: UploadedFile;
  variantImages?: UploadedFile | UploadedFile[];
  additionalImages?: UploadedFile | UploadedFile[];
};

type VariantsExpressRequest = {
  price: number;
  stock: number;
  isDefault: boolean;
  sku?: string;
  attributes?: [
    {
      name: string;
      option: string;
    },
  ];
  imageName?: string;
};

type BodyExpressRequest = {
  name: string;
  description: string;
  storeFrontId: string;
  productCategoryId: string;
  isFeaturedProduct?: boolean;
  isActive: boolean;
  weightInGram: number;
  variants: VariantsExpressRequest[];
  dimension: {
    lengthInMM: number;
    widthInMM: number;
    heightInMM: number;
  };
};

export class CreateProductController extends BaseController {
  path = '/v2/catalogs/products';
  method: RequestMethods = RequestMethods.POST;
  middleware?: RequestHandler[] | undefined;

  private useCase: CreateProductUseCase;

  constructor(useCase: CreateProductUseCase, middleware: RequestHandler[]) {
    super();
    this.useCase = useCase;
    this.middleware = middleware;
  }

  private getImage(rawImage: UploadedFile): ImagePropsRequestDTO {
    const extension = rawImage.mimetype.split('/')[1];
    return {
      buffer: rawImage.data,
      extension,
      fileSize: rawImage.size,
    };
  }

  private getProductVariants(
    rawVariants: VariantsExpressRequest[],
    rawVariantImages?: UploadedFile[],
  ): ProductVariantRequestDTO[] {
    return rawVariants.map((rawVariant) => {
      let attributes: ProductAttributeRequestDTO[] = [];
      if (rawVariant.attributes) {
        attributes = rawVariant.attributes?.map((a) => {
          return {
            name: a.name,
            option: a.option,
          };
        });
      }

      let image;
      if (rawVariantImages) {
        const rawVariantImage = rawVariantImages.find((a) => a.name === rawVariant.imageName);
        image = rawVariantImage ? this.getImage(rawVariantImage) : undefined;
      }

      return {
        sku: rawVariant.sku,
        isDefault: rawVariant.isDefault,
        price: rawVariant.price,
        stock: rawVariant.stock,
        attributes,
        image,
      };
    });
  }

  protected async executeImpl(
    req: TypedRequest<Record<string, never>, BodyExpressRequest, FilesExpressRequest>,
    res: Response,
  ): Promise<unknown> {
    let additionalImages;

    if (req.files?.additionalImages) {
      if (!Array.isArray(req.files.additionalImages)) {
        additionalImages = [this.getImage(req.files.additionalImages)];
      } else {
        additionalImages = req.files.additionalImages.map((a) => this.getImage(a));
      }
    }

    if (!req.files?.imageCover) {
      return this.clientError(res, `imageCover property is missing`);
    }

    let rawVariantImages;

    if (req.files.variantImages) {
      rawVariantImages = Array.isArray(req.files.variantImages) ? req.files.variantImages : [req.files.variantImages];
    }

    const dto: CreateProductRequestDTO = {
      description: req.body.description,
      dimension: req.body.dimension,
      imageCover: this.getImage(req.files.imageCover),
      isActive: req.body.isActive,
      isFeaturedProduct: req.body.isFeaturedProduct,
      name: req.body.name,
      productCategoryId: req.body.productCategoryId,
      storeFrontId: req.body.storeFrontId,
      variants: this.getProductVariants(req.body.variants, rawVariantImages),
      weightInGram: req.body.weightInGram,
      additionalImages,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateProductErrors.CategoryDoesntExists:
          case CreateProductErrors.DuplicateVariantAttributeOption:
          case CreateProductErrors.NameAlreadyTaken:
          case CreateProductErrors.NoDefaultVariant:
          case CreateProductErrors.StoreFrontDoesntExists:
          case CreateProductErrors.TooManyDefaultVariant:
          case CreateProductErrors.VariantAttributesMismatch:
            return this.clientError(res, error.getErrorValue());
          default:
            return this.fail(res, error.getErrorValue());
        }
      }

      return this.ok(res);
    } catch (error) {
      return this.fail(res, error as Error);
    }
  }
}
