import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { logger } from '../../../shared/infra/logger';
import { StoreId } from '../../users/domain/store/valueObjects/storeId';
import { StoreFront } from '../domain/storeFront/storeFront';
import { StoreFrontPersistenceDTO } from '../dtos/storeFrontDTO';

export class StoreFrontMap {
  static toDomain(raw: StoreFrontPersistenceDTO): StoreFront {
    const storeId = StoreId.create(new UniqueEntityID(raw.base_store_id)).getValue() as StoreId;

    const storeFrontOrError = StoreFront.create(
      {
        name: raw.Store?.name as string,
        description: raw.Store?.description as string,
        storeId,
        averageRating: raw.average_rating,
        dateJoined: raw.date_joined,
        isVerified: raw.is_verified,
        numRatings: raw.num_ratings,
        profileImageUrl: raw.profile_image_url,
        storeFrontBannerImageUrl: raw.store_front_banner_image_url,
      },
      new UniqueEntityID(raw.store_front_id),
    );

    if (storeFrontOrError.isFailure) {
      logger.error(storeFrontOrError.getErrorValue());
      throw new Error();
    }

    return storeFrontOrError.getValue() as StoreFront;
  }

  static toPersistence(storeFront: StoreFront): StoreFrontPersistenceDTO {
    return {
      base_store_id: storeFront.storeId.getStringValue(),
      store_front_id: storeFront.storeFrontId.getStringValue(),
      date_joined: storeFront.dateJoined,
      is_verified: storeFront.isVerified,
      profile_image_url: storeFront.profileImageUrl,
      store_front_banner_image_url: storeFront.storeFrontBannerImageUrl,
      average_rating: storeFront.averageRating,
      num_ratings: storeFront.numRatings,
    };
  }
}
