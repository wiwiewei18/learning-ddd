import { Guard } from '../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { StoreId } from '../../../users/domain/store/valueObjects/storeId';
import { StoreFrontCreated } from './events/storeFrontCreated';
import { StoreFrontId } from './valueObjects/storeFrontId';

interface StoreFrontProps {
  storeId: StoreId;
  name: string;
  description: string;
  dateJoined?: string | Date;
  isVerified?: boolean;
  profileImageUrl?: string;
  storeFrontBannerImageUrl?: string;
  averageRating?: number;
  numRatings?: number;
}

export class StoreFront extends AggregateRoot<StoreFrontProps> {
  get storeFrontId(): StoreFrontId {
    return StoreFrontId.create(this._id).getValue() as StoreFrontId;
  }

  get storeId(): StoreId {
    return this.props.storeId;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get dateJoined(): string | Date | undefined {
    return this.props.dateJoined;
  }

  get isVerified(): boolean | undefined {
    return this.props.isVerified;
  }

  get profileImageUrl(): string | undefined {
    return this.props.profileImageUrl;
  }

  get storeFrontBannerImageUrl(): string | undefined {
    return this.props.storeFrontBannerImageUrl;
  }

  get averageRating(): number | undefined {
    return this.props.averageRating;
  }

  get numRatings(): number | undefined {
    return this.props.numRatings;
  }

  private constructor(props: StoreFrontProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: StoreFrontProps, id?: UniqueEntityID): SuccessOrFailure<StoreFront> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.description,
        argumentName: 'description',
      },
      {
        argument: props.name,
        argumentName: 'name',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<StoreFront>(guardResult.getErrorValue());
    }

    const isNewStoreFront = !!id === false;

    const storeFront = new StoreFront(
      {
        ...props,
        dateJoined: props.dateJoined ? props.dateJoined : new Date(),
        isVerified: props.isVerified ? props.isVerified : false,
      },
      id,
    );

    if (isNewStoreFront) {
      storeFront.addDomainEvent(new StoreFrontCreated(storeFront));
    }

    return Result.ok<StoreFront>(storeFront);
  }
}
