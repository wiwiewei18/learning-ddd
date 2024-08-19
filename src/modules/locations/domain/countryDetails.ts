import { Guard } from '../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';

interface CountryDetailsProps {
  name: string;
}

export class CountryDetails extends ValueObject<CountryDetailsProps> {
  get name(): string {
    return this.props.name;
  }

  private constructor(props: CountryDetailsProps) {
    super(props);
  }

  static create(props: CountryDetailsProps): SuccessOrFailure<CountryDetails> {
    const guardResult = Guard.againstNullOrUndefinedBulk([{ argument: props.name, argumentName: 'name' }]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getErrorValue());
    }

    return Result.ok(new CountryDetails(props));
  }
}
