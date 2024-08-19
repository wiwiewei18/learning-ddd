import { Maybe, Result } from '../../../../../shared/core/Result';
import { Store } from '../../../domain/store/store';
import { StoreId } from '../../../domain/store/valueObjects/storeId';
import { StorePersistenceDTO } from '../../../dtos/storeDTO';
import { StoreMap } from '../../../mappers/storeMap';
import { StoreRepo } from '../storeRepo';

export class SequelizeStoreRepo implements StoreRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async exists(storeId: StoreId): Promise<boolean> {
    const storeModel = this.models.Store;
    const store = await storeModel.findOne({ where: { store_id: storeId.getStringValue() } });
    return !!store === true;
  }

  async save(store: Store): Promise<void> {
    const storeModel = this.models.Store;
    const rawSequelizeStore = StoreMap.toPersistence(store);

    const sequelizeStore = await storeModel.findOne({ where: { store_id: store.storeId.getStringValue() } });

    if (sequelizeStore) {
      rawSequelizeStore.updated_at = new Date();
      Object.assign(sequelizeStore, rawSequelizeStore);
      await sequelizeStore.save();
    } else {
      await storeModel.create(rawSequelizeStore);
    }
  }

  async getStoreByStoreId(storeId: string): Promise<Maybe<Store>> {
    const storeModel = this.models.Store;
    const sequelizeStore = await storeModel.findOne({ where: { store_id: storeId } });
    if (!sequelizeStore) {
      return Result.notFound<Store>(`Store with id ${storeId} not found`);
    }
    return Result.found<Store>(StoreMap.toDomain(sequelizeStore));
  }

  async getAllStores(): Promise<Store[]> {
    const stores = await this.models.Store.findAll();
    return stores.map((s: StorePersistenceDTO) => StoreMap.toDomain(s));
  }

  async getStoreByName(storeName: string): Promise<Maybe<Store>> {
    const storeModel = this.models.Store;
    const rawStore = await storeModel.findOne({ where: { name: storeName } });
    if (!rawStore) {
      return Result.notFound<Store>(`Store with name ${storeName} not found`);
    }
    return Result.found<Store>(StoreMap.toDomain(rawStore));
  }
}
