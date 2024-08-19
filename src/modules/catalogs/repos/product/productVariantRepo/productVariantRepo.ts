import { Maybe } from '../../../../../shared/core/Result';
import { ProductVariant } from '../../../domain/product/entities/productVariant/productVariant';
import { ProductVariants } from '../../../domain/product/entities/productVariant/productVariants';
import { ProductVariantId } from '../../../domain/product/entities/productVariant/valueObjects/productVariantId';
import { ProductVariantDetails } from '../../../domain/product/valueObjects/productVariantDetails';

export interface ProductVariantRepo {
  exists(productVariantId: ProductVariantId): Promise<boolean>;
  save(productVariant: ProductVariant): Promise<void>;
  getRecentProducts(): Promise<ProductVariantDetails[]>;
  getProductVariantDetailsById(id: string): Promise<Maybe<ProductVariantDetails>>;
  saveBulk(productVariants: ProductVariants): Promise<void>;
  delete(productVariant: ProductVariant): Promise<void>;
}
