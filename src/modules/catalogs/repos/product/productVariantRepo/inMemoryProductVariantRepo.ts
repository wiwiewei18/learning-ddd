import { Maybe, Result } from '../../../../../shared/core/Result';
import { ProductVariant } from '../../../domain/product/entities/productVariant/productVariant';
import { ProductVariants } from '../../../domain/product/entities/productVariant/productVariants';
import { ProductVariantId } from '../../../domain/product/entities/productVariant/valueObjects/productVariantId';
import { ProductVariantDetails } from '../../../domain/product/valueObjects/productVariantDetails';
import { BaseProductPersistenceDTO } from '../../../dtos/baseProductDTO';
import { ProductVariantPersistenceDTO } from '../../../dtos/productVariantDTO';
import { ProductVariantDetailsMap } from '../../../mappers/productVariantDetailsMap';
import { ProductVariantMap } from '../../../mappers/productVariantMap';
import { ProductVariantRepo } from './productVariantRepo';

export class InMemoryProductVariantRepo implements ProductVariantRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async delete(productVariant: ProductVariant): Promise<void> {
    if (await this.exists(productVariant.productVariantId)) {
      this.models.ProductVariant = this.models.ProductVariant.filter(
        (v: ProductVariantPersistenceDTO) => v.product_variant_id !== productVariant.productVariantId.getStringValue(),
      );
    }
  }

  async getProductVariantDetailsById(id: string): Promise<Maybe<ProductVariantDetails>> {
    for (const productVariant of this.models.ProductVariant) {
      if (productVariant.product_variant_id === id) {
        return Result.found<ProductVariantDetails>(ProductVariantDetailsMap.toDomain(productVariant));
      }
    }
    return Result.notFound<ProductVariantDetails>(`Product variant with id ${id} not found`);
  }

  async exists(productVariantId: ProductVariantId): Promise<boolean> {
    for (const productVariant of this.models.ProductVariant) {
      if (productVariant.product_variant_id === productVariantId.getStringValue()) {
        return true;
      }
    }
    return false;
  }

  async save(productVariant: ProductVariant): Promise<void> {
    if (!(await this.exists(productVariant.productVariantId))) {
      const rawProductVariant = ProductVariantMap.toPersistence(productVariant);

      rawProductVariant.created_at = new Date();

      rawProductVariant.BaseProduct = this.models.BaseProduct.find(
        (b: BaseProductPersistenceDTO) => b.product_id === productVariant.baseProductId.getStringValue(),
      );

      this.models.ProductVariant.push(rawProductVariant);
    }
  }

  async getRecentProducts(): Promise<ProductVariantDetails[]> {
    const sorted = this.models.ProductVariant.sort((a: ProductVariantPersistenceDTO, b: ProductVariantPersistenceDTO) => {
      if (a.created_at === undefined && b.created_at === undefined) {
        return 0;
      }

      if (a.created_at === undefined) {
        return 1;
      }

      if (b.created_at === undefined) {
        return -1;
      }

      return b.created_at.getTime() - a.created_at.getTime();
    });

    return sorted.map((v: ProductVariantPersistenceDTO) => ProductVariantDetailsMap.toDomain(v));
  }

  async saveBulk(productVariants: ProductVariants): Promise<void> {
    await Promise.all(productVariants.getNewItems().map(async (v) => this.save(v)));
  }
}
