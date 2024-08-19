import { faker } from '@faker-js/faker';
import { Email } from '../../../../../../shared/domain/valueObjects/email';
import { User } from '../../user';
import { UserRoles } from '../../userRoles';
import { FullName } from '../../valueObjects/fullName';
import { Password } from '../../valueObjects/password';
import { PhoneNumber } from '../../valueObjects/phoneNumber';
import { UserRole } from '../../valueObjects/userRole';

function createRandomUser(role: UserRoles): User {
  const email = Email.create(faker.internet.email()).getValue() as Email;
  const fullName = FullName.create({ firstName: faker.person.firstName() }).getValue() as FullName;
  const password = Password.create({ value: 'password1!' }).getValue() as Password;
  const phoneNumber = PhoneNumber.create({
    value: faker.phone.number('8555388#'),
    countryCode: 'SG',
  }).getValue() as PhoneNumber;
  const userRole = UserRole.create({ value: role }).getValue() as UserRole;

  const userOrError = User.create({ phoneNumber, email, fullName, password, role: userRole });
  if (userOrError.isFailure) {
    throw new Error(userOrError.getErrorValue());
  }

  return userOrError.getValue() as User;
}

export { createRandomUser };
