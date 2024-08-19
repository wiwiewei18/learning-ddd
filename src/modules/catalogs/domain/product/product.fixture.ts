import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { StoreFrontId } from '../storeFront/valueObjects/storeFrontId';
import { ProductCategoryId } from './entities/productCategory/productCategoryId';
import { Product } from './product';
import { BaseProductName } from './valueObjects/baseProductName';

interface RandomBaseProductProps {
  storeFrontId: StoreFrontId;
  productCategoryId: ProductCategoryId;
}

function createRandomBaseProduct(props?: RandomBaseProductProps): Product {
  const storeFrontId = props?.storeFrontId
    ? props.storeFrontId
    : (StoreFrontId.create(new UniqueEntityID('storeFront')).getValue() as StoreFrontId);

  const productCategoryId = props?.productCategoryId
    ? props.productCategoryId
    : (ProductCategoryId.create(new UniqueEntityID('1')).getValue() as ProductCategoryId);

  const productName = BaseProductName.create(faker.commerce.product()).getValue() as BaseProductName;

  return Product.create({
    name: productName,
    description: faker.commerce.productDescription(),
    storeFrontId,
    productCategoryId,
    imageCoverUrl: 'imageUrl',
  }).getValue() as Product;
}

export { createRandomBaseProduct };
