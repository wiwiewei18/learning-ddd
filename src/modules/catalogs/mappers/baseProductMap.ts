import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { logger } from '../../../shared/infra/logger';
import { ProductCategoryId } from '../domain/product/entities/productCategory/productCategoryId';
import { Product } from '../domain/product/product';
import { BaseProductName } from '../domain/product/valueObjects/baseProductName';
import { StoreFrontId } from '../domain/storeFront/valueObjects/storeFrontId';
import { BaseProductPersistenceDTO } from '../dtos/baseProductDTO';

export class BaseProductMap {
  static toDomain(raw: BaseProductPersistenceDTO): Product {
    const storeFrontId = StoreFrontId.create(new UniqueEntityID(raw.store_front_id)).getValue() as StoreFrontId;
    const productCategoryId = ProductCategoryId.create(
      new UniqueEntityID(raw.product_category_id),
    ).getValue() as ProductCategoryId;

    const name = BaseProductName.create(raw.name).getValue() as BaseProductName;

    const productOrError = Product.create(
      {
        storeFrontId,
        productCategoryId,
        description: raw.description,
        name,
        imageCoverUrl: raw.image_cover_url,
        averageRating: raw.average_rating,
        numSales: raw.num_sales,
        createdAt: raw.created_at,
      },
      new UniqueEntityID(raw.product_id),
    );

    if (productOrError.isFailure) {
      logger.error(productOrError.getErrorValue());
      throw new Error();
    }

    return productOrError.getValue() as Product;
  }

  static toPersistence(product: Product): BaseProductPersistenceDTO {
    return {
      description: product.description,
      name: product.name.value,
      product_id: product.baseProductId.getStringValue(),
      store_front_id: product.storeFrontId.getStringValue(),
      product_category_id: product.productCategoryId.getStringValue(),
      image_cover_url: product.imageCoverUrl,
      average_rating: product.averageRating,
      num_sales: product.numSales,
    };
  }
}
