import { createRandomProductVariant } from './entities/productVariant/productVariant.fixture';
import { ProductVariantAttribute } from './entities/productVariant/valueObjects/variantAttribute';
import { createRandomBaseProduct } from './product.fixture';

describe('Product', () => {
  it('should fail to add new variant with same attribute with existing variant', () => {
    const product = createRandomBaseProduct();

    const variantAttribute = ProductVariantAttribute.create({
      name: 'color',
      option: 'red',
    }).getValue() as ProductVariantAttribute;

    const variant = createRandomProductVariant({ attributes: [variantAttribute] });

    product.addVariant(variant);

    const anotherVariant = createRandomProductVariant({ attributes: [variantAttribute] });

    expect(product.variants?.exists(anotherVariant)).toBe(true);

    product.addVariant(anotherVariant);

    expect(product.variants?.getItems().length).toBe(1);
  });
});
