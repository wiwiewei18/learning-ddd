import { WatchedList } from '../../../../../../shared/domain/WatchedList';
import { ProductCategory } from './productCategory';

export class ProductCategories extends WatchedList<ProductCategory> {
  private constructor(initialCategories: ProductCategory[]) {
    super(initialCategories);
  }

  compareItems(a: ProductCategory, b: ProductCategory): boolean {
    return a.equals(b);
  }

  static create(productCategories?: ProductCategory[]): ProductCategories {
    return new ProductCategories(productCategories || []);
  }
}
