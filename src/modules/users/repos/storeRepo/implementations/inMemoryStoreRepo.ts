import { Maybe, Result } from '../../../../../shared/core/Result';
import { Store } from '../../../domain/store/store';
import { StoreId } from '../../../domain/store/valueObjects/storeId';
import { StoreRepo } from '../storeRepo';

export class InMemoryStoreRepo implements StoreRepo {
  private arr: Store[];

  constructor(arr: Store[] = []) {
    this.arr = arr;
  }

  async exists(storeId: StoreId): Promise<boolean> {
    for (const store of this.arr) {
      if (store.storeId.equals(storeId)) {
        return true;
      }
    }
    return false;
  }

  async save(store: Store): Promise<void> {
    if (!(await this.exists(store.storeId))) {
      this.arr.push(store);
    }
  }

  async getStoreByStoreId(storeId: string): Promise<Maybe<Store>> {
    for (const store of this.arr) {
      if (store.storeId.getStringValue() === storeId) {
        return Result.found<Store>(store);
      }
    }
    return Result.notFound<Store>(`Store with id ${storeId} not found`);
  }

  async getAllStores(): Promise<Store[]> {
    return this.arr;
  }

  async getStoreByName(storeName: string): Promise<Maybe<Store>> {
    for (const store of this.arr) {
      if (store.name === storeName) {
        return Result.found<Store>(store);
      }
    }
    return Result.notFound<Store>(`Store with name ${storeName} not found`);
  }
}
