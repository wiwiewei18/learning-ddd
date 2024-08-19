import { Guard } from '../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';

interface ZipCodeDetailsProps {
  code: string;
}

export class ZipCodeDetails extends ValueObject<ZipCodeDetailsProps> {
  get code(): string {
    return this.props.code;
  }

  private constructor(props: ZipCodeDetailsProps) {
    super(props);
  }

  static create(props: ZipCodeDetailsProps): SuccessOrFailure<ZipCodeDetails> {
    const guardResult = Guard.againstNullOrUndefinedBulk([{ argument: props.code, argumentName: 'code' }]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getErrorValue());
    }

    return Result.ok(new ZipCodeDetails(props));
  }
}
