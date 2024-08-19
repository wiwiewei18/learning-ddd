import { Guard } from '../../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { ValueObject } from '../../../../../shared/domain/ValueObject';

export class StoreFrontId extends ValueObject<{ value: UniqueEntityID }> {
  getStringValue(): string {
    return this.props.value.toString();
  }

  getValue(): UniqueEntityID {
    return this.props.value;
  }

  private constructor(value: UniqueEntityID) {
    super({ value });
  }

  static create(value: UniqueEntityID): SuccessOrFailure<StoreFrontId> {
    const guardResult = Guard.againstNullOrUndefined(value, 'value');
    if (guardResult.isFailure) {
      return Result.fail<StoreFrontId>(guardResult.getErrorValue());
    }
    return Result.ok<StoreFrontId>(new StoreFrontId(value));
  }
}
