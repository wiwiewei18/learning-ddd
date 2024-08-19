import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { logger } from '../../../shared/infra/logger';
import { BaseProductId } from '../../catalogs/domain/product/valueObjects/baseProductId';
import { Product } from '../domain/product/product';
import { ProductPersistenceDTO } from '../dtos/productDTO';

export class ProductMap {
  static toPersistence(product: Product): ProductPersistenceDTO {
    return {
      product_id: product.productId.getStringValue(),
      base_product_id: product.baseProductId.getStringValue(),
      name: product.name,
      stock: product.stock,
    };
  }

  static toDomain(raw: ProductPersistenceDTO): Product {
    const baseProductId = BaseProductId.create(new UniqueEntityID(raw.base_product_id)).getValue() as BaseProductId;

    const productOrError = Product.create({
      baseProductId,
      name: raw.name,
      stock: raw.stock,
    });

    if (productOrError.isFailure) {
      logger.error(productOrError.getErrorValue());
      throw new Error();
    }

    return productOrError.getValue() as Product;
  }
}
