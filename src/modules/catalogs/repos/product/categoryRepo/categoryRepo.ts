import { Maybe } from '../../../../../shared/core/Result';
import { ProductCategory } from '../../../domain/product/entities/productCategory/productCategory';
import { ProductCategoryId } from '../../../domain/product/entities/productCategory/productCategoryId';

export interface ProductCategoryRepo {
  getCategoryById(categoryId: string): Promise<Maybe<ProductCategory>>;
  exists(categoryId: ProductCategoryId): Promise<boolean>;
  save(productCategory: ProductCategory): Promise<void>;
}
