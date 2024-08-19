import { Maybe, Result } from '../../../../../shared/core/Result';
import { ProductVariant } from '../../../domain/product/entities/productVariant/productVariant';
import { ProductVariants } from '../../../domain/product/entities/productVariant/productVariants';
import { ProductVariantId } from '../../../domain/product/entities/productVariant/valueObjects/productVariantId';
import { ProductVariantDetails } from '../../../domain/product/valueObjects/productVariantDetails';
import { ProductVariantPersistenceDTO } from '../../../dtos/productVariantDTO';
import { ProductVariantDetailsMap } from '../../../mappers/productVariantDetailsMap';
import { ProductVariantMap } from '../../../mappers/productVariantMap';
import { ProductVariantRepo } from './productVariantRepo';

export class SequelizeProductVariantRepo implements ProductVariantRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async getProductVariantDetailsById(id: string): Promise<Maybe<ProductVariantDetails>> {
    const detailsQuery = this.createBaseDetailsQuery();
    detailsQuery.where.product_variant_id = id;

    const sequelizeProductVariant = await this.models.ProductVariant.findOne(detailsQuery);

    if (!sequelizeProductVariant) {
      return Result.notFound<ProductVariantDetails>(`Product variant with id ${id} not found`);
    }

    return Result.found<ProductVariantDetails>(ProductVariantDetailsMap.toDomain(sequelizeProductVariant));
  }

  private createBaseDetailsQuery(): any {
    return {
      where: {},
      include: [
        {
          model: this.models.BaseProduct,
          as: 'BaseProduct',
        },
      ],
      limit: 10,
    };
  }

  async exists(productVariantId: ProductVariantId): Promise<boolean> {
    const productVariant = await this.models.ProductVariant.findOne({
      where: { product_variant_id: productVariantId.getStringValue() },
    });
    return !!productVariant === true;
  }

  async save(productVariant: ProductVariant): Promise<void> {
    const rawSequelizeProductVariant = ProductVariantMap.toPersistence(productVariant);

    const sequelizeProductVariant = await this.models.ProductVariant.findOne({
      where: { product_variant_id: productVariant.productVariantId.getStringValue() },
    });

    if (sequelizeProductVariant) {
      rawSequelizeProductVariant.updated_at = new Date();
      Object.assign(sequelizeProductVariant, rawSequelizeProductVariant);
      await sequelizeProductVariant.save();
    } else {
      await this.models.ProductVariant.create(rawSequelizeProductVariant);
    }
  }

  async getRecentProducts(): Promise<ProductVariantDetails[]> {
    const detailsQuery = this.createBaseDetailsQuery();
    detailsQuery.order = [['created_at', 'DESC']];

    const productVariants = await this.models.ProductVariant.findAll(detailsQuery);
    return productVariants.map((p: ProductVariantPersistenceDTO) => ProductVariantDetailsMap.toDomain(p));
  }

  async saveBulk(productVariants: ProductVariants): Promise<void> {
    const removedVariants = productVariants.getRemovedItems();
    const newVariants = productVariants.getNewItems();

    await Promise.all(removedVariants.map(async (v) => this.delete(v)));
    await Promise.all(newVariants.map(async (v) => this.save(v)));
  }

  async delete(productVariant: ProductVariant): Promise<void> {
    await this.models.ProductVariant.destroy({
      where: { product_variant_id: productVariant.productVariantId.getStringValue() },
    });
  }
}
