import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { Email } from '../../../../../../shared/domain/valueObjects/email';
import { UserId } from '../../../../../users/domain/user/valueObjects/userId';
import { Buyer } from '../../buyer';

interface RandomBuyerProps {
  baseUserId: UserId;
}

function createRandomBuyer(props?: RandomBuyerProps): Buyer {
  const baseUserId = props?.baseUserId ? props.baseUserId : (UserId.create(new UniqueEntityID('1')).getValue() as UserId);
  const email = Email.create(faker.internet.email()).getValue() as Email;

  const buyerOrError = Buyer.create({
    baseUserId,
    email,
  });

  if (buyerOrError.isFailure) {
    throw new Error(buyerOrError.getErrorValue());
  }

  return buyerOrError.getValue() as Buyer;
}

export { createRandomBuyer };
