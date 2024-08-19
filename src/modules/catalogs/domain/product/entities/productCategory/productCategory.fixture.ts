import { faker } from '@faker-js/faker';
import { ProductCategory } from './productCategory';
import { ProductCategoryCode } from './valueObjects/productCategoryCode';
import { ProductCategoryName } from './valueObjects/productCategoryName';

function createRandomProductCategory(): ProductCategory {
  const name = ProductCategoryName.create(faker.commerce.department()).getValue() as ProductCategoryName;
  const code = ProductCategoryCode.create(faker.string.alpha(8)).getValue() as ProductCategoryCode;

  return ProductCategory.create({ name, code }).getValue() as ProductCategory;
}

export { createRandomProductCategory };
