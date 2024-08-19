import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { logger } from '../../../shared/infra/logger';
import { ProductCategory } from '../domain/product/entities/productCategory/productCategory';
import { ProductCategoryId } from '../domain/product/entities/productCategory/productCategoryId';
import { ProductCategoryCode } from '../domain/product/entities/productCategory/valueObjects/productCategoryCode';
import { ProductCategoryName } from '../domain/product/entities/productCategory/valueObjects/productCategoryName';
import { ProductCategoryPersistenceDTO } from '../dtos/productCategoryDTO';

export class ProductCategoryMap {
  static toDomain(raw: ProductCategoryPersistenceDTO): ProductCategory {
    const parentProductCategoryId = raw.parent_product_category_id
      ? (ProductCategoryId.create(new UniqueEntityID(raw.parent_product_category_id)).getValue() as ProductCategoryId)
      : undefined;

    const name = ProductCategoryName.create(raw.name).getValue() as ProductCategoryName;
    const code = ProductCategoryCode.create(raw.code).getValue() as ProductCategoryCode;

    const productCategoryOrError = ProductCategory.create(
      { name, code, parentProductCategoryId },
      new UniqueEntityID(raw.product_category_id),
    );

    if (productCategoryOrError.isFailure) {
      logger.error(productCategoryOrError.getErrorValue());
      throw new Error();
    }

    return productCategoryOrError.getValue() as ProductCategory;
  }

  static toPersistence(productCategory: ProductCategory): ProductCategoryPersistenceDTO {
    return {
      code: productCategory.code.value,
      name: productCategory.name.value,
      product_category_id: productCategory.productCategoryId.getStringValue(),
      parent_product_category_id: productCategory.parentProductCategoryId?.getStringValue(),
    };
  }
}
