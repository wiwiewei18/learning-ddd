import { Guard } from '../../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';

interface FullNameProps {
  firstName: string;
  lastName?: string;
}

export class FullName extends ValueObject<FullNameProps> {
  get value(): string {
    return [this.firstName, this.lastName].join(' ').trim();
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string | undefined {
    return this.props.lastName;
  }

  private constructor(props: FullNameProps) {
    super(props);
  }

  static create(props: FullNameProps): SuccessOrFailure<FullName> {
    if (!props.firstName) {
      return Result.fail<FullName>(`First name not allow to be empty string`);
    }

    const propsResult = Guard.againstNullOrUndefined(props.firstName, 'firstName');
    if (propsResult.isFailure) {
      return Result.fail<FullName>(propsResult.getErrorValue());
    }

    return Result.ok<FullName>(new FullName({ firstName: props.firstName, lastName: props.lastName }));
  }
}
