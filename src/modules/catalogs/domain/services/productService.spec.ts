import { faker } from '@faker-js/faker';
import { CreateProductErrors } from '../../useCases/products/createProduct/createProductErrors';
import { ProductVariant } from '../product/entities/productVariant/productVariant';
import { createRandomProductVariant } from '../product/entities/productVariant/productVariant.fixture';
import { ProductVariantAttribute } from '../product/entities/productVariant/valueObjects/variantAttribute';
import { Product } from '../product/product';
import { createRandomBaseProduct } from '../product/product.fixture';
import { ProductService } from './productService';

const productService = new ProductService();

let productVariant: ProductVariant;

let product: Product;

describe('ProductService', () => {
  beforeEach(() => {
    productVariant = createRandomProductVariant();
    productVariant.setAsDefault();

    product = createRandomBaseProduct();
  });

  it('should be able to create a product with only one variant', () => {
    const createProductResult = productService.createProduct(product, [productVariant]);

    expect(createProductResult.isRight()).toBe(true);
    expect(product.variants?.getItems().length).toEqual(1);
  });

  describe('Scenario: Success create product with variants that has different option', () => {
    describe('Given 1 variant with attribute color and option is red', () => {
      describe('When Add new variant with attribute color and option blue', () => {
        test('Then Product should be created with 2 variants And all variants attribute name is color with different option', () => {
          const attribute = ProductVariantAttribute.create({
            name: 'color',
            option: 'red',
          }).getValue() as ProductVariantAttribute;

          const productVariantWithAttributes = createRandomProductVariant({ attributes: [attribute] });
          productVariantWithAttributes.setAsDefault();

          const anotherAttribute = ProductVariantAttribute.create({
            name: 'color',
            option: 'blue',
          }).getValue() as ProductVariantAttribute;

          const anotherVariant = createRandomProductVariant({ attributes: [anotherAttribute] });

          const createProductResult = productService.createProduct(product, [productVariantWithAttributes, anotherVariant]);

          expect(createProductResult.isRight()).toBe(true);
          expect(product.variants?.getItems().length).toEqual(2);
        });
      });
    });
  });

  it('should fail to create product with duplicate variant attributes', () => {
    const anotherVariant = ProductVariant.create({
      baseProductId: productVariant.baseProductId,
      isDefault: false,
      price: productVariant.price,
      stock: productVariant.stock,
      attributes: productVariant.attributes,
    }).getValue() as ProductVariant;

    const createProductResult = productService.createProduct(product, [productVariant, anotherVariant]);

    expect(createProductResult.isLeft()).toBe(true);
    expect(createProductResult.value.constructor).toEqual(CreateProductErrors.DuplicateVariantAttributeOption);
  });

  it('should fail to create a product with no variants as default', () => {
    productVariant.unsetAsDefault();

    const createProductResult = productService.createProduct(product, [productVariant]);

    expect(createProductResult.isLeft()).toBe(true);
    expect(createProductResult.value.constructor).toEqual(CreateProductErrors.NoDefaultVariant);
  });

  it('should fail to create product with multiple default variants', () => {
    const anotherVariant = createRandomProductVariant();

    anotherVariant.setAsDefault();

    const createProductResult = productService.createProduct(product, [productVariant, anotherVariant]);

    expect(createProductResult.isLeft()).toBe(true);
    expect(createProductResult.value.constructor).toEqual(CreateProductErrors.TooManyDefaultVariant);
  });

  it('should fail to create product with variants that has different attribute count', () => {
    const attribute = ProductVariantAttribute.create({
      name: faker.word.noun(),
      option: faker.word.noun(),
    }).getValue() as ProductVariantAttribute;

    const anotherVariant = createRandomProductVariant({ attributes: [attribute, attribute] });

    const createProductResult = productService.createProduct(product, [productVariant, anotherVariant]);

    expect(createProductResult.isLeft()).toBe(true);
    expect(createProductResult.value.constructor).toEqual(CreateProductErrors.VariantAttributesMismatch);
  });

  it('should fail to create a product with variants when new variant attributes identical with current variants attributes', () => {
    const anotherVariant = createRandomProductVariant({ attributes: productVariant.attributes });

    const createProductResult = productService.createProduct(product, [productVariant, anotherVariant]);

    expect(createProductResult.isLeft()).toBe(true);
    expect(createProductResult.value.constructor).toEqual(CreateProductErrors.DuplicateVariantAttributeOption);
  });
});
