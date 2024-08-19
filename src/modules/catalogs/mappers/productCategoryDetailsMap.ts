import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { logger } from '../../../shared/infra/logger';
import { ProductCategoryId } from '../domain/product/entities/productCategory/productCategoryId';
import { ProductCategoryDetails } from '../domain/product/entities/productCategory/valueObjects/productCategoryDetails';
import { ProductCategoryName } from '../domain/product/entities/productCategory/valueObjects/productCategoryName';
import { ProductCategoryPersistenceDTO, ProductCategoryPublicDTO } from '../dtos/productCategoryDTO';

export class ProductCategoryDetailsMap {
  static toDomain(raw: ProductCategoryPersistenceDTO): ProductCategoryDetails {
    const productCategoryName = ProductCategoryName.create(raw.name).getValue() as ProductCategoryName;
    const parentProductCategoryId = ProductCategoryId.create(
      new UniqueEntityID(raw.parent_product_category_id),
    ).getValue() as ProductCategoryId;

    const productCategoryDetailsOrError = ProductCategoryDetails.create({
      name: productCategoryName,
      parentProductCategoryId,
    });

    if (productCategoryDetailsOrError.isFailure) {
      logger.error(productCategoryDetailsOrError.getErrorValue());
      throw new Error();
    }

    return productCategoryDetailsOrError.getValue() as ProductCategoryDetails;
  }

  static toDTO(productCategoryDetails: ProductCategoryDetails): ProductCategoryPublicDTO {
    return {
      name: productCategoryDetails.name.value,
    };
  }
}
