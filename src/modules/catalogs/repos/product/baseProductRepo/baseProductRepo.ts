import { Maybe } from '../../../../../shared/core/Result';
import { Product } from '../../../domain/product/product';
import { BaseProductId } from '../../../domain/product/valueObjects/baseProductId';

export interface BaseProductRepo {
  exists(baseProductId: BaseProductId): Promise<boolean>;
  save(product: Product): Promise<void>;
  getProductByName(name: string): Promise<Maybe<Product>>;
  getAllBaseProducts(): Promise<Product[]>;
  delete(baseProductId: BaseProductId): Promise<void>;
}
