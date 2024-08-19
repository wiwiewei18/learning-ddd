import { Guard } from '../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../shared/core/Result';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { CountryId } from './countryId';

interface CountryProps {
  name: string;
  code: string;
}

export class Country extends AggregateRoot<CountryProps> {
  get countryId(): CountryId {
    return CountryId.create(this._id).getValue() as CountryId;
  }

  get name(): string {
    return this.props.name;
  }

  get code(): string {
    return this.props.code;
  }

  private constructor(props: CountryProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: CountryProps, id?: UniqueEntityID): SuccessOrFailure<Country> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.name,
        argumentName: 'name',
      },
      {
        argument: props.code,
        argumentName: 'code',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getErrorValue());
    }

    return Result.ok(new Country(props, id));
  }
}
