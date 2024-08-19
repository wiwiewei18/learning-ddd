import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';

interface BaseProductNameProps {
  value: string;
}

export class BaseProductName extends ValueObject<BaseProductNameProps> {
  static maxLength = 70;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: BaseProductNameProps) {
    super(props);
  }

  static create(name: string): SuccessOrFailure<BaseProductName> {
    if (name.length > this.maxLength) {
      return Result.fail<BaseProductName>(`Product name character shouldn't more than ${this.maxLength} chars`);
    }

    return Result.ok<BaseProductName>(new BaseProductName({ value: name }));
  }
}
