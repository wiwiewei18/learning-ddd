import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { BaseProductId } from '../../valueObjects/baseProductId';
import { ProductPrice } from '../../valueObjects/productPrice';
import { ProductVariant } from './productVariant';
import { ProductVariants } from './productVariants';
import { ProductVariantAttribute } from './valueObjects/variantAttribute';

const baseProductId = BaseProductId.create(new UniqueEntityID('product')).getValue() as BaseProductId;
const price = ProductPrice.create(20).getValue() as ProductPrice;

describe('ProductVariants', () => {
  it('should fail to add new variant with duplicate 1 attribute', () => {
    const attribute = ProductVariantAttribute.create({ name: 'Size', option: 'M' }).getValue() as ProductVariantAttribute;

    const productVariant = ProductVariant.create({
      baseProductId,
      attributes: [attribute],
      regularImageUrl: 'imgUrl',
      thumbnailImageUrl: 'imgUrl',
      price,
      stock: 5,
      isDefault: true,
    }).getValue() as ProductVariant;

    const productVariants = ProductVariants.create([productVariant]);

    // add a new variant with same attributes
    const newProductVariant = ProductVariant.create({
      baseProductId,
      attributes: [attribute],
      regularImageUrl: 'imgUrl',
      thumbnailImageUrl: 'imgUrl',
      price,
      stock: 5,
      isDefault: true,
    }).getValue() as ProductVariant;

    productVariants.add(newProductVariant);

    expect(productVariants.getItems().length).toEqual(1);
  });

  it('should able to create 2 variant attributes', () => {
    const attributeSizeOne = ProductVariantAttribute.create({
      name: 'Size',
      option: 'M',
    }).getValue() as ProductVariantAttribute;
    const attributeColorOne = ProductVariantAttribute.create({
      name: 'Color',
      option: 'Red',
    }).getValue() as ProductVariantAttribute;
    const attributeColorTwo = ProductVariantAttribute.create({
      name: 'Color',
      option: 'Blue',
    }).getValue() as ProductVariantAttribute;

    const productVariantOne = ProductVariant.create({
      baseProductId,
      attributes: [attributeSizeOne, attributeColorOne],
      price,
      stock: 5,
      isDefault: true,
    }).getValue() as ProductVariant;

    const productVariantTwo = ProductVariant.create({
      baseProductId,
      attributes: [attributeSizeOne, attributeColorTwo],
      price,
      stock: 5,
      isDefault: true,
    }).getValue() as ProductVariant;

    const productVariants = ProductVariants.create([productVariantOne, productVariantTwo]);

    expect(productVariants.getItems().length).toEqual(2);
  });

  describe('Adding product variant to existing variant with 1 attribute', () => {
    const defaultAttribute = ProductVariantAttribute.create({
      name: 'Size',
      option: 'M',
    }).getValue() as ProductVariantAttribute;

    const defaultProductVariant = ProductVariant.create({
      baseProductId,
      attributes: [defaultAttribute],
      regularImageUrl: 'imgUrl',
      thumbnailImageUrl: 'imgUrl',
      price,
      stock: 5,
      isDefault: true,
    }).getValue() as ProductVariant;

    let oneAttributeProductVariants: ProductVariants;

    beforeEach(() => {
      oneAttributeProductVariants = ProductVariants.create([defaultProductVariant]);
    });

    it('should able to add new variant with same attribute but different option', () => {
      const anotherAttributeOption = ProductVariantAttribute.create({
        name: 'Size',
        option: 'S',
      }).getValue() as ProductVariantAttribute;

      const productVariant = ProductVariant.create({
        baseProductId,
        attributes: [anotherAttributeOption],
        regularImageUrl: 'imgUrl',
        thumbnailImageUrl: 'imgUrl',
        price,
        stock: 5,
        isDefault: true,
      }).getValue() as ProductVariant;

      oneAttributeProductVariants.add(productVariant);

      expect(oneAttributeProductVariants.getItems().length).toBe(2);
      expect(oneAttributeProductVariants.getNewItems().length).toBe(1);
    });

    it('should fail to add new variant with same attribute and option', () => {
      const anotherAttribute = ProductVariantAttribute.create({
        name: 'Size',
        option: 'L',
      }).getValue() as ProductVariantAttribute;

      const productVariant = ProductVariant.create({
        baseProductId,
        attributes: [anotherAttribute],
        regularImageUrl: 'imgUrl',
        thumbnailImageUrl: 'imgUrl',
        price,
        stock: 1,
        isDefault: false,
      }).getValue() as ProductVariant;

      oneAttributeProductVariants.add(productVariant);

      const existingVariant = ProductVariant.create({
        baseProductId,
        attributes: [anotherAttribute],
        regularImageUrl: 'imgUrls',
        thumbnailImageUrl: 'imgUrls',
        price,
        stock: 20,
        isDefault: false,
      }).getValue() as ProductVariant;

      expect(oneAttributeProductVariants.exists(existingVariant)).toBe(true);

      oneAttributeProductVariants.add(existingVariant);

      expect(oneAttributeProductVariants.getItems().length).toBe(2);
    });
  });

  describe('Adding product variant to existing variant with 2 attributes', () => {
    const defaultAttributeOne = ProductVariantAttribute.create({
      name: 'Size',
      option: 'M',
    }).getValue() as ProductVariantAttribute;

    const defaultAttributeTwo = ProductVariantAttribute.create({
      name: 'Color',
      option: 'Red',
    }).getValue() as ProductVariantAttribute;

    const defaultProductVariant = ProductVariant.create({
      baseProductId,
      attributes: [defaultAttributeOne, defaultAttributeTwo],
      regularImageUrl: 'imgUrl',
      thumbnailImageUrl: 'imgUrl',
      price,
      stock: 5,
      isDefault: true,
    }).getValue() as ProductVariant;

    let twoAttributesProductVariants: ProductVariants;

    beforeEach(() => {
      twoAttributesProductVariants = ProductVariants.create([defaultProductVariant]);
    });

    it('should able to add new variant with 2 attributes with one of the attribute using different option', () => {
      const anotherAttributeOneOption = ProductVariantAttribute.create({
        name: 'Size',
        option: 'S',
      }).getValue() as ProductVariantAttribute;

      const productVariant = ProductVariant.create({
        baseProductId,
        attributes: [anotherAttributeOneOption, defaultAttributeTwo],
        regularImageUrl: 'imgUrl',
        thumbnailImageUrl: 'imgUrl',
        price,
        stock: 5,
        isDefault: true,
      }).getValue() as ProductVariant;

      twoAttributesProductVariants.add(productVariant);

      expect(twoAttributesProductVariants.getItems().length).toBe(2);
      expect(twoAttributesProductVariants.getNewItems().length).toBe(1);
    });

    it('should fail to add new variant with 2 attributes with same attributes', () => {
      const productVariant = ProductVariant.create({
        baseProductId,
        attributes: [defaultAttributeTwo, defaultAttributeOne],
        regularImageUrl: 'imgUrl',
        thumbnailImageUrl: 'imgUrl',
        price,
        stock: 5,
        isDefault: true,
      }).getValue() as ProductVariant;

      expect(twoAttributesProductVariants.exists(productVariant)).toBe(true);

      twoAttributesProductVariants.add(productVariant);

      expect(twoAttributesProductVariants.getItems().length).toBe(1);
    });
  });
});
