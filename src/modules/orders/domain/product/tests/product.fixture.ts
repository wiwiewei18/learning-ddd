import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { ProductVariantId } from '../../../../catalogs/domain/product/entities/productVariant/valueObjects/productVariantId';
import { Product } from '../product';

function createRandomProduct(baseProductId?: ProductVariantId): Product {
  return Product.create({
    baseProductId: baseProductId || (ProductVariantId.create(new UniqueEntityID('1')).getValue() as ProductVariantId),
    name: faker.commerce.product(),
    stock: 1,
  }).getValue() as Product;
}

export { createRandomProduct };
