import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { logger } from '../../../shared/infra/logger';
import { ProductVariantId } from '../domain/product/entities/productVariant/valueObjects/productVariantId';
import { ProductVariantName } from '../domain/product/entities/productVariant/valueObjects/productVariantName';
import { ProductVariantAttribute } from '../domain/product/entities/productVariant/valueObjects/variantAttribute';
import { BaseProductId } from '../domain/product/valueObjects/baseProductId';
import { ProductPrice } from '../domain/product/valueObjects/productPrice';
import { ProductVariantDetails } from '../domain/product/valueObjects/productVariantDetails';
import { ProductVariantPersistenceDTO, ProductVariantPublicDTO } from '../dtos/productVariantDTO';

export class ProductVariantDetailsMap {
  static toDomain(raw: ProductVariantPersistenceDTO): ProductVariantDetails {
    const productVariantId = ProductVariantId.create(
      new UniqueEntityID(raw.product_variant_id),
    ).getValue() as ProductVariantId;
    const baseProductId = BaseProductId.create(new UniqueEntityID(raw.base_product_id)).getValue() as BaseProductId;

    const attributes: ProductVariantAttribute[] = JSON.parse(raw.attributes);

    const attributeOptions = attributes?.map((a) => a.option);

    const name = ProductVariantName.create({
      baseName: raw.BaseProduct?.name as string,
      attributesOptions: attributeOptions,
    }).getValue() as ProductVariantName;

    const productPrice = ProductPrice.create(raw.price).getValue() as ProductPrice;

    const productVariantDetailsOrError = ProductVariantDetails.create({
      productVariantId,
      baseProductId,
      name,
      price: productPrice,
      averageRating: raw.average_rating as number,
      numSales: raw.num_sales as number,
      thumbnailImageUrl: raw.BaseProduct?.image_cover_url as string,
    });

    if (productVariantDetailsOrError.isFailure) {
      logger.error(productVariantDetailsOrError.getErrorValue());
      throw new Error();
    }

    return productVariantDetailsOrError.getValue() as ProductVariantDetails;
  }

  static toDTO(productVariantDetails: ProductVariantDetails): ProductVariantPublicDTO {
    return {
      productVariantId: productVariantDetails.productVariantId.getStringValue(),
      name: productVariantDetails.name.value,
      price: productVariantDetails.price.format(),
      averageRating: productVariantDetails.averageRating,
      numSales: productVariantDetails.numSales,
      thumbnailImageUrl: productVariantDetails.thumbnailImageUrl,
    };
  }
}
