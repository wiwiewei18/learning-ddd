import { Maybe } from '../../../../shared/core/Result';
import { Store } from '../../domain/store/store';
import { StoreId } from '../../domain/store/valueObjects/storeId';

export interface StoreRepo {
  exists(storeId: StoreId): Promise<boolean>;
  save(store: Store): Promise<void>;
  getStoreByStoreId(storeId: string): Promise<Maybe<Store>>;
  getAllStores(): Promise<Store[]>;
  getStoreByName(storeName: string): Promise<Maybe<Store>>;
}
