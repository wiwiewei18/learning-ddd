import { Maybe, Result } from '../../../../shared/core/Result';
import { Product } from '../../domain/product/product';
import { ProductId } from '../../domain/product/productId';
import { ProductMap } from '../../mappers/productMap';
import { ProductRepo } from './productRepo';

export class InMemoryProductRepo implements ProductRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async exists(productId: ProductId): Promise<boolean> {
    for (const product of this.models.Product) {
      if (product.product_id === productId.getStringValue()) {
        return true;
      }
    }
    return false;
  }

  async save(product: Product): Promise<void> {
    if (!(await this.exists(product.productId))) {
      const rawProduct = ProductMap.toPersistence(product);

      this.models.Product.push(rawProduct);
    }
  }

  async getProduct(productId: string): Promise<Maybe<Product>> {
    for (const product of this.models.Product) {
      if (product.product_id === productId) {
        return Result.found(ProductMap.toDomain(product));
      }
    }
    return Result.notFound(`Product with id ${productId} not found`);
  }
}
