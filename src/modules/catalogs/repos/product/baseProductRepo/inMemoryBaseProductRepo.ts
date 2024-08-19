import { Maybe, Result } from '../../../../../shared/core/Result';
import { Product } from '../../../domain/product/product';
import { BaseProductId } from '../../../domain/product/valueObjects/baseProductId';
import { BaseProductPersistenceDTO } from '../../../dtos/baseProductDTO';
import { BaseProductMap } from '../../../mappers/baseProductMap';
import { BaseProductRepo } from './baseProductRepo';

export class InMemoryBaseProductRepo implements BaseProductRepo {
  private arr: BaseProductPersistenceDTO[];

  constructor(arr: BaseProductPersistenceDTO[] = []) {
    this.arr = arr;
  }

  async getProductByName(name: string): Promise<Maybe<Product>> {
    for (const product of this.arr) {
      if (product.name === name) {
        return Result.found<Product>(BaseProductMap.toDomain(product));
      }
    }
    return Result.notFound<Product>(`Product with name ${name} not found`);
  }

  async exists(baseProductId: BaseProductId): Promise<boolean> {
    for (const product of this.arr) {
      if (product.product_id === baseProductId.getStringValue()) {
        return true;
      }
    }
    return false;
  }

  async save(product: Product): Promise<void> {
    if (!(await this.exists(product.baseProductId))) {
      this.arr.push(BaseProductMap.toPersistence(product));
    }
  }

  async getAllBaseProducts(): Promise<Product[]> {
    return this.arr.map((b) => BaseProductMap.toDomain(b));
  }

  async delete(baseProductId: BaseProductId): Promise<void> {
    if (await this.exists(baseProductId)) {
      this.arr = this.arr.filter((b) => b.product_id !== baseProductId.getStringValue());
    }
  }
}
