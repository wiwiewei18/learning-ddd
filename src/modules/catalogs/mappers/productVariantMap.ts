import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { logger } from '../../../shared/infra/logger';
import { ProductVariant } from '../domain/product/entities/productVariant/productVariant';
import { ProductVariantAttribute } from '../domain/product/entities/productVariant/valueObjects/variantAttribute';
import { BaseProductId } from '../domain/product/valueObjects/baseProductId';
import { ProductPrice } from '../domain/product/valueObjects/productPrice';
import { ProductVariantPersistenceDTO } from '../dtos/productVariantDTO';

export class ProductVariantMap {
  static toDomain(raw: ProductVariantPersistenceDTO): ProductVariant {
    const baseProductId = BaseProductId.create(new UniqueEntityID(raw.base_product_id)).getValue() as BaseProductId;
    const price = ProductPrice.create(raw.price).getValue() as ProductPrice;
    const attributes: ProductVariantAttribute[] = JSON.parse(raw.attributes);

    const productVariantOrError = ProductVariant.create(
      {
        baseProductId,
        price,
        isDefault: raw.is_default,
        stock: raw.stock,
        attributes,
        isActive: raw.is_active,
        regularImageUrl: raw.regular_image_url,
        thumbnailImageUrl: raw.thumbnail_image_url,
      },
      new UniqueEntityID(raw.product_variant_id),
    );

    if (productVariantOrError.isFailure) {
      logger.error(productVariantOrError.getErrorValue());
      throw new Error();
    }

    return productVariantOrError.getValue() as ProductVariant;
  }

  static toPersistence(productVariant: ProductVariant): ProductVariantPersistenceDTO {
    return {
      product_variant_id: productVariant.productVariantId.getStringValue(),
      base_product_id: productVariant.baseProductId.getStringValue(),
      price: productVariant.price.value,
      stock: productVariant.stock,
      attributes: JSON.stringify(productVariant.attributes?.map((a) => a.value)),
      is_active: productVariant.isActive,
      regular_image_url: productVariant.regularImageUrl,
      thumbnail_image_url: productVariant.thumbnailImageUrl,
      is_default: productVariant.isDefault,
      average_rating: productVariant.averageRating,
      num_sales: productVariant.numSales,
    };
  }
}
