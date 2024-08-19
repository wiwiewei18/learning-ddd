import { Guard } from '../../../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { ValueObject } from '../../../../../../shared/domain/ValueObject';

export class ProductCategoryId extends ValueObject<{ value: UniqueEntityID }> {
  getStringValue(): string {
    return this.props.value.toString();
  }

  getValue(): UniqueEntityID {
    return this.props.value;
  }

  private constructor(value: UniqueEntityID) {
    super({ value });
  }

  static create(value: UniqueEntityID): SuccessOrFailure<ProductCategoryId> {
    const guardResult = Guard.againstNullOrUndefined(value, 'value');
    if (guardResult.isFailure) {
      return Result.fail<ProductCategoryId>(guardResult.getErrorValue());
    }
    return Result.ok<ProductCategoryId>(new ProductCategoryId(value));
  }
}
