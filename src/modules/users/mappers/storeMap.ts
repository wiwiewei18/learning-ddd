import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { logger } from '../../../shared/infra/logger';
import { Store } from '../domain/store/store';
import { UserId } from '../domain/user/valueObjects/userId';
import { StorePersistenceDTO } from '../dtos/storeDTO';

export class StoreMap {
  static toDomain(raw: StorePersistenceDTO): Store {
    const userId = UserId.create(new UniqueEntityID(raw.user_id)).getValue() as UserId;

    const storeOrError = Store.create(
      {
        addressDetail: raw.address_detail,
        countryCode: raw.country_code,
        description: raw.description,
        name: raw.name,
        postalCode: raw.postal_code,
        userId,
      },
      new UniqueEntityID(raw.store_id),
    );

    if (storeOrError.isFailure) {
      logger.error(storeOrError.getErrorValue());
      throw new Error();
    }

    return storeOrError.getValue() as Store;
  }

  static toPersistence(store: Store): StorePersistenceDTO {
    return {
      store_id: store.storeId.getStringValue(),
      user_id: store.userId.getStringValue(),
      address_detail: store.addressDetail,
      description: store.description,
      name: store.name,
      postal_code: store.postalCode,
      country_code: store.countryCode,
    };
  }
}
