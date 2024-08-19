import { Maybe, Result } from '../../../../../shared/core/Result';
import { ProductCategory } from '../../../domain/product/entities/productCategory/productCategory';
import { ProductCategoryId } from '../../../domain/product/entities/productCategory/productCategoryId';
import { ProductCategoryMap } from '../../../mappers/productCategoryMap';
import { ProductCategoryRepo } from './categoryRepo';

export class SequelizeProductCategoryRepo implements ProductCategoryRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async exists(categoryId: ProductCategoryId): Promise<boolean> {
    const category = await this.models.ProductCategory.findOne({
      where: { product_category_id: categoryId.getStringValue() },
    });
    return !!category === true;
  }

  async save(productCategory: ProductCategory): Promise<void> {
    const rawProductCategory = ProductCategoryMap.toPersistence(productCategory);

    const sequelizeProductCategory = await this.models.ProductCategory.findOne({
      where: { product_category_id: productCategory.productCategoryId.getStringValue() },
    });

    if (sequelizeProductCategory) {
      rawProductCategory.updated_at = new Date();
      Object.assign(sequelizeProductCategory, rawProductCategory);
      await sequelizeProductCategory.save();
    } else {
      await this.models.ProductCategory.create(rawProductCategory);
    }
  }

  async getCategoryById(categoryId: string): Promise<Maybe<ProductCategory>> {
    const productCategoryModel = this.models.ProductCategory;
    const rawProductCategory = await productCategoryModel.findOne({ where: { product_category_id: categoryId } });

    if (!rawProductCategory) {
      return Result.notFound<ProductCategory>(`Product Category with id ${categoryId} not found`);
    }

    return Result.found<ProductCategory>(ProductCategoryMap.toDomain(rawProductCategory));
  }
}
