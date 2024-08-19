import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { BaseProductId } from '../../valueObjects/baseProductId';
import { ProductPrice } from '../../valueObjects/productPrice';
import { ProductVariant } from './productVariant';
import { ProductVariantAttribute } from './valueObjects/variantAttribute';

interface RandomProductVariantProps {
  baseProductId?: BaseProductId;
  attributes?: ProductVariantAttribute[];
}

function createRandomProductVariant(props?: RandomProductVariantProps): ProductVariant {
  const baseProductId = props?.baseProductId
    ? props.baseProductId
    : (BaseProductId.create(new UniqueEntityID(faker.string.uuid())).getValue() as BaseProductId);

  let attributes: ProductVariantAttribute[] = [];

  if (!props?.attributes) {
    const attribute = ProductVariantAttribute.create({
      name: faker.word.noun(),
      option: faker.word.noun(),
    }).getValue() as ProductVariantAttribute;

    attributes.push(attribute);
  } else {
    attributes = props.attributes;
  }

  const price = ProductPrice.create(20).getValue() as ProductPrice;

  return ProductVariant.create({
    baseProductId,
    attributes,
    regularImageUrl: 'imgUrl',
    thumbnailImageUrl: 'imgUrl',
    price,
    stock: 5,
    isDefault: false,
  }).getValue() as ProductVariant;
}

export { createRandomProductVariant };
