import { Maybe, Result } from '../../../../../shared/core/Result';
import { ProductCategory } from '../../../domain/product/entities/productCategory/productCategory';
import { ProductCategoryId } from '../../../domain/product/entities/productCategory/productCategoryId';
import { ProductCategoryRepo } from './categoryRepo';

export class InMemoryProductCategoryRepo implements ProductCategoryRepo {
  private arr: ProductCategory[];

  constructor(arr: ProductCategory[] = []) {
    this.arr = arr;
  }

  async save(productCategory: ProductCategory): Promise<void> {
    if (!(await this.exists(productCategory.productCategoryId))) {
      this.arr.push(productCategory);
    }
  }

  async getCategoryById(categoryId: string): Promise<Maybe<ProductCategory>> {
    for (const productCategory of this.arr) {
      if (productCategory.productCategoryId.getStringValue() === categoryId) {
        return Result.found<ProductCategory>(productCategory);
      }
    }
    return Result.notFound<ProductCategory>(`Product Category with id ${categoryId} not found`);
  }

  async exists(categoryId: ProductCategoryId): Promise<boolean> {
    for (const category of this.arr) {
      if (category.productCategoryId.equals(categoryId)) {
        return true;
      }
    }
    return false;
  }
}
