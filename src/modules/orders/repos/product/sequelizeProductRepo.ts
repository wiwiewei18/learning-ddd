import { Maybe, Result } from '../../../../shared/core/Result';
import { Product } from '../../domain/product/product';
import { ProductId } from '../../domain/product/productId';
import { ProductMap } from '../../mappers/productMap';
import { ProductRepo } from './productRepo';

export class SequelizeProductRepo implements ProductRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async exists(productId: ProductId): Promise<boolean> {
    const product = await this.models.Product.findOne({ where: { product_id: productId.getStringValue() } });
    return !!product === true;
  }

  async save(product: Product): Promise<void> {
    const rawSequelizeProduct = ProductMap.toPersistence(product);
    const sequelizeProduct = await this.models.Product.findOne({
      where: { product_id: product.productId.getStringValue() },
    });

    if (sequelizeProduct) {
      rawSequelizeProduct.updated_at = new Date();
      Object.assign(sequelizeProduct, rawSequelizeProduct);
      await sequelizeProduct.save();
    } else {
      await this.models.Product.create(rawSequelizeProduct);
    }
  }

  async getProduct(productId: string): Promise<Maybe<Product>> {
    const rawProduct = await this.models.Product.findOne({ where: { product_id: productId } });

    if (!rawProduct) {
      return Result.notFound(`Product with id ${productId}`);
    }

    return Result.found(ProductMap.toDomain(rawProduct));
  }
}
