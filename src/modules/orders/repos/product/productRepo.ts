import { Maybe } from '../../../../shared/core/Result';
import { Product } from '../../domain/product/product';
import { ProductId } from '../../domain/product/productId';

export interface ProductRepo {
  exists(productId: ProductId): Promise<boolean>;
  save(product: Product): Promise<void>;
  getProduct(productId: string): Promise<Maybe<Product>>;
}
