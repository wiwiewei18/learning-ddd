import { Guard } from '../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { Email } from '../../../../shared/domain/valueObjects/email';
import { UserId } from '../../../users/domain/user/valueObjects/userId';
import { BuyerId } from './buyerId';

interface BuyerProps {
  baseUserId: UserId;
  email: Email;
}

export class Buyer extends AggregateRoot<BuyerProps> {
  get buyerId(): BuyerId {
    return BuyerId.create(this._id).getValue() as BuyerId;
  }

  get baseUserId(): UserId {
    return this.props.baseUserId;
  }

  get email(): Email {
    return this.props.email;
  }

  private constructor(props: BuyerProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: BuyerProps, id?: UniqueEntityID): SuccessOrFailure<Buyer> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.baseUserId,
        argumentName: 'baseUserId',
      },
      {
        argument: props.email,
        argumentName: 'email',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getErrorValue());
    }

    const buyer = new Buyer(props, id);

    return Result.ok(buyer);
  }
}
