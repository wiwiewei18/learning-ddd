import { Guard } from '../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { UserId } from '../user/valueObjects/userId';
import { StoreCreated } from './events/storeCreated';
import { StoreId } from './valueObjects/storeId';

interface StoreProps {
  userId: UserId;
  name: string;
  countryCode: string;
  postalCode: string;
  addressDetail: string;
  description: string;
}

export class Store extends AggregateRoot<StoreProps> {
  get storeId(): StoreId {
    return StoreId.create(this._id).getValue() as StoreId;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get countryCode(): string {
    return this.props.countryCode;
  }

  get postalCode(): string {
    return this.props.postalCode;
  }

  get addressDetail(): string {
    return this.props.addressDetail;
  }

  get description(): string {
    return this.props.description;
  }

  private constructor(props: StoreProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: StoreProps, id?: UniqueEntityID): SuccessOrFailure<Store> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.addressDetail,
        argumentName: 'addressDetail',
      },
      {
        argument: props.countryCode,
        argumentName: 'countryCode',
      },
      {
        argument: props.description,
        argumentName: 'description',
      },
      {
        argument: props.name,
        argumentName: 'name',
      },
      {
        argument: props.postalCode,
        argumentName: 'postalCode',
      },
      {
        argument: props.userId,
        argumentName: 'userId',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Store>(guardResult.getErrorValue());
    }

    const isNewStore = !!id === false;

    const store = new Store(props, id);

    if (isNewStore) {
      store.addDomainEvent(new StoreCreated(store));
    }

    return Result.ok<Store>(store);
  }
}
