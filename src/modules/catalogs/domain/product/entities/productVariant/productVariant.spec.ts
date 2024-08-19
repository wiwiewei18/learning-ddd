import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { BaseProductId } from '../../valueObjects/baseProductId';
import { ProductPrice } from '../../valueObjects/productPrice';
import { ProductVariant } from './productVariant';
import { ProductVariantAttribute } from './valueObjects/variantAttribute';

const baseProductId = BaseProductId.create(new UniqueEntityID('productId')).getValue() as BaseProductId;

describe('ProductVariant', () => {
  it('should be able to create a product variant', () => {
    const attribute = ProductVariantAttribute.create({ name: 'Size', option: 'M' }).getValue() as ProductVariantAttribute;
    const price = ProductPrice.create(20).getValue() as ProductPrice;

    const productVariantOrError = ProductVariant.create({
      baseProductId,
      attributes: [attribute],
      regularImageUrl: 'imgUrl',
      thumbnailImageUrl: 'imgUrl',
      price,
      stock: 5,
      isDefault: true,
    });

    expect(productVariantOrError.isSuccess).toBe(true);
  });

  it('should fail to create a product variant with attributes more than 2', () => {
    const attributeOne = ProductVariantAttribute.create({ name: 'Size', option: 'M' }).getValue() as ProductVariantAttribute;
    const attributeTwo = ProductVariantAttribute.create({
      name: 'Color',
      option: 'Red',
    }).getValue() as ProductVariantAttribute;
    const attributeThree = ProductVariantAttribute.create({
      name: 'Brand',
      option: 'Earth Run',
    }).getValue() as ProductVariantAttribute;

    const price = ProductPrice.create(20).getValue() as ProductPrice;

    const productVariantOrError = ProductVariant.create({
      baseProductId,
      attributes: [attributeOne, attributeTwo, attributeThree],
      regularImageUrl: 'imgUrl',
      thumbnailImageUrl: 'imgUrl',
      price,
      stock: 5,
      isDefault: true,
    });

    expect(productVariantOrError.isFailure).toBe(true);
  });
});
