import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Email } from '../../../shared/domain/valueObjects/email';
import { logger } from '../../../shared/infra/logger';
import { UserId } from '../../users/domain/user/valueObjects/userId';
import { Buyer } from '../domain/buyer/buyer';
import { BuyerPersistenceDTO } from '../dtos/buyerDTO';

export class BuyerMap {
  static toPersistence(buyer: Buyer): BuyerPersistenceDTO {
    return {
      buyer_id: buyer.buyerId.getStringValue(),
      base_user_id: buyer.baseUserId.getStringValue(),
    };
  }

  static toDomain(raw: BuyerPersistenceDTO): Buyer {
    const baseUserId = UserId.create(new UniqueEntityID(raw.base_user_id)).getValue() as UserId;

    const buyerOrError = Buyer.create(
      {
        baseUserId,
        email: Email.create(raw.User?.email as string).getValue() as Email,
      },
      new UniqueEntityID(raw.buyer_id),
    );

    if (buyerOrError.isFailure) {
      logger.error(buyerOrError.getErrorValue());
      throw new Error();
    }

    return buyerOrError.getValue() as Buyer;
  }
}
