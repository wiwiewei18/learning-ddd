import { Maybe, Result } from '../../../../../shared/core/Result';
import { ProductVariants } from '../../../domain/product/entities/productVariant/productVariants';
import { Product } from '../../../domain/product/product';
import { BaseProductId } from '../../../domain/product/valueObjects/baseProductId';
import { BaseProductPersistenceDTO } from '../../../dtos/baseProductDTO';
import { BaseProductMap } from '../../../mappers/baseProductMap';
import { ProductVariantRepo } from '../productVariantRepo/productVariantRepo';
import { BaseProductRepo } from './baseProductRepo';

export class SequelizeBaseProductRepo implements BaseProductRepo {
  private models: any;
  private productVariantRepo: ProductVariantRepo;

  constructor(models: any, productVariantRepo: ProductVariantRepo) {
    this.models = models;
    this.productVariantRepo = productVariantRepo;
  }

  async exists(baseProductId: BaseProductId): Promise<boolean> {
    const product = await this.models.BaseProduct.findOne({ where: { product_id: baseProductId.getStringValue() } });
    return !!product === true;
  }

  async getProductByName(name: string): Promise<Maybe<Product>> {
    const productModel = this.models.BaseProduct;
    const rawProduct = await productModel.findOne({ where: { name } });

    if (!rawProduct) {
      return Result.notFound<Product>(`Product with name ${name} not found`);
    }

    return Result.found<Product>(BaseProductMap.toDomain(rawProduct));
  }

  private async saveProductVariants(productVariants: ProductVariants) {
    await this.productVariantRepo.saveBulk(productVariants);
  }

  async save(product: Product): Promise<void> {
    const productModel = this.models.BaseProduct;
    const rawSequelizeProduct = BaseProductMap.toPersistence(product);

    const sequelizeProduct = await productModel.findOne({ where: { product_id: product.baseProductId.getStringValue() } });
    const isNewProduct = !sequelizeProduct;

    if (isNewProduct) {
      try {
        await productModel.create(rawSequelizeProduct);
        await this.saveProductVariants(product.variants as ProductVariants);
      } catch (error) {
        await this.delete(product.baseProductId);
        throw error;
      }
    } else {
      await this.saveProductVariants(product.variants as ProductVariants);

      rawSequelizeProduct.updated_at = new Date();
      Object.assign(sequelizeProduct, rawSequelizeProduct);
      await sequelizeProduct.save();
    }
  }

  async delete(baseProductId: BaseProductId): Promise<void> {
    await this.models.BaseProduct.destroy({ where: { product_id: baseProductId.getStringValue() } });
  }

  async getAllBaseProducts(): Promise<Product[]> {
    const baseProducts = await this.models.BaseProduct.findAll();
    return baseProducts.map((b: BaseProductPersistenceDTO) => BaseProductMap.toDomain(b));
  }
}
