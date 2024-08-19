import { Guard } from '../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../shared/core/Result';
import { Entity } from '../../../shared/domain/Entity';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { CountryId } from './countryId';
import { ZipCodeId } from './zipCodeId';

interface ZipCodeProps {
  countryId: CountryId;
  code: string;
}

export class ZipCode extends Entity<ZipCodeProps> {
  get zipCodeId(): ZipCodeId {
    return ZipCodeId.create(this._id).getValue() as ZipCodeId;
  }

  get countryId(): CountryId {
    return this.props.countryId;
  }

  get code(): string {
    return this.props.code;
  }

  private constructor(props: ZipCodeProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: ZipCodeProps, id?: UniqueEntityID): SuccessOrFailure<ZipCode> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.countryId,
        argumentName: 'countryId',
      },
      {
        argument: props.code,
        argumentName: 'code',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getErrorValue());
    }

    return Result.ok(new ZipCode(props, id));
  }
}
