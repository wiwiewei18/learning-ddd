import { Maybe, Result } from '../../../../shared/core/Result';
import { StorePersistenceDTO } from '../../../users/dtos/storeDTO';
import { StoreFront } from '../../domain/storeFront/storeFront';
import { StoreFrontId } from '../../domain/storeFront/valueObjects/storeFrontId';
import { StoreFrontMap } from '../../mappers/storeFrontMap';
import { StoreFrontRepo } from './storeFrontRepo';

export class InMemoryStoreFrontRepo implements StoreFrontRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async getStoreFrontById(storeFrontId: string): Promise<Maybe<StoreFront>> {
    for (const storeFront of this.models.StoreFront) {
      if (storeFront.store_front_id === storeFrontId) {
        return Result.found(StoreFrontMap.toDomain(storeFront));
      }
    }
    return Result.notFound(`Store Front with id ${storeFrontId} not found`);
  }

  async exists(storeFrontId: StoreFrontId): Promise<boolean> {
    for (const storeFront of this.models.StoreFront) {
      if (storeFront.store_front_id === storeFrontId.getStringValue()) {
        return true;
      }
    }
    return false;
  }

  async save(storeFront: StoreFront): Promise<void> {
    if (!(await this.exists(storeFront.storeFrontId))) {
      const rawStoreFront = StoreFrontMap.toPersistence(storeFront);

      rawStoreFront.Store = this.models.Store.find(
        (s: StorePersistenceDTO) => s.store_id === storeFront.storeId.getStringValue(),
      );

      this.models.StoreFront.push(rawStoreFront);
    }
  }

  async getStoreFrontByName(name: string): Promise<Maybe<StoreFront>> {
    for (const storeFront of this.models.StoreFront) {
      if (storeFront.Store?.name === name) {
        return Result.found(StoreFrontMap.toDomain(storeFront));
      }
    }

    return Result.notFound(`Store Front with name ${name} not found`);
  }
}
