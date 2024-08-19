import { Guard } from '../../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { UserRoles } from '../userRoles';

interface UserRoleProps {
  value: UserRoles;
}

export class UserRole extends ValueObject<UserRoleProps> {
  get value(): UserRoles {
    return this.props.value;
  }

  private constructor(props: UserRoleProps) {
    super(props);
  }

  static create(props: UserRoleProps): SuccessOrFailure<UserRole> {
    const guardResult = Guard.isOneOf(props.value, Object.values(UserRoles), 'value');
    if (guardResult.isFailure) {
      return Result.fail(guardResult.getErrorValue());
    }

    return Result.ok(new UserRole(props));
  }
}
