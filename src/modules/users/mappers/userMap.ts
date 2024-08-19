import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Email } from '../../../shared/domain/valueObjects/email';
import { logger } from '../../../shared/infra/logger';
import { User } from '../domain/user/user';
import { FullName } from '../domain/user/valueObjects/fullName';
import { Password } from '../domain/user/valueObjects/password';
import { PhoneNumber } from '../domain/user/valueObjects/phoneNumber';
import { UserRole } from '../domain/user/valueObjects/userRole';
import { UserPersistenceDTO } from '../dtos/userDTO';

export class UserMap {
  static toDomain(raw: UserPersistenceDTO): User {
    const userOrError = User.create(
      {
        email: Email.create(raw.email).getValue() as Email,
        fullName: FullName.create({ firstName: raw.first_name, lastName: raw.last_name }).getValue() as FullName,
        password: Password.create({ value: raw.password, isHashed: true }).getValue() as Password,
        phoneNumber: PhoneNumber.create({
          countryCode: raw.country_code,
          value: raw.phone_number,
        }).getValue() as PhoneNumber,
        isDeleted: raw.is_deleted,
        role: UserRole.create({ value: raw.role }).getValue() as UserRole,
        isEmailVerified: raw.is_email_verified,
      },
      new UniqueEntityID(raw.user_id),
    );

    if (userOrError.isFailure) {
      logger.error(userOrError.getErrorValue());
      throw new Error();
    }

    return userOrError.getValue() as User;
  }

  static async toPersistence(user: User): Promise<UserPersistenceDTO> {
    const password =
      user.password && user.password.isAlreadyHashed() ? user.password.value : await user.password.getHashedValue();

    return {
      user_id: user.userId.getStringValue(),
      first_name: user.fullName.firstName,
      last_name: user.fullName.lastName,
      phone_number: user.phoneNumber.value,
      email: user.email.value,
      password,
      country_code: user.phoneNumber.props.countryCode,
      role: user.role.value,
      is_deleted: user.isDeleted,
    };
  }
}
