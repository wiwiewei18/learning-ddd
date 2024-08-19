import { left, right } from '../../../../shared/core/Either';
import { Result } from '../../../../shared/core/Result';
import { CreateProductErrors } from '../../useCases/products/createProduct/createProductErrors';
import { CreateProductResponse } from '../../useCases/products/createProduct/createProductResponse';
import { ProductVariant } from '../product/entities/productVariant/productVariant';
import { Product } from '../product/product';

export class ProductService {
  createProduct(product: Product, productVariants: ProductVariant[]): CreateProductResponse {
    let defaultVariantCount = 0;
    const variantAttributeCount = productVariants[0].attributes ? productVariants[0].attributes.length : 0;

    for (const variant of productVariants) {
      const currentVariantAttributeCount = variant.attributes ? variant.attributes.length : 0;

      if (currentVariantAttributeCount !== variantAttributeCount) {
        return left(new CreateProductErrors.VariantAttributesMismatch());
      }

      if (variant.isDefault) defaultVariantCount += 1;

      if (defaultVariantCount > 1) {
        return left(new CreateProductErrors.TooManyDefaultVariant());
      }

      const addVariantResult = product.addVariant(variant);

      if (addVariantResult.isLeft()) {
        return left(addVariantResult.value);
      }
    }

    if (defaultVariantCount === 0) {
      return left(new CreateProductErrors.NoDefaultVariant());
    }

    return right(Result.ok<void>());
  }
}
