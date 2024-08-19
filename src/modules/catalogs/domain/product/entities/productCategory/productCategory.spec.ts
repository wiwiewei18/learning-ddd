import { SuccessOrFailure } from '../../../../../../shared/core/Result';
import { ProductCategory } from './productCategory';
import { ProductCategoryCode } from './valueObjects/productCategoryCode';
import { ProductCategoryName } from './valueObjects/productCategoryName';

let productCategoryOrError: SuccessOrFailure<ProductCategory>;

describe('ProductCategory', () => {
  it('should be able to create product category with valid name and code', () => {
    productCategoryOrError = ProductCategory.create({
      name: ProductCategoryName.create('Education Material').getValue() as ProductCategoryName,
      code: ProductCategoryCode.create('EDCTNMTRL').getValue() as ProductCategoryCode,
    });

    expect(productCategoryOrError.isSuccess).toBe(true);
  });
});
