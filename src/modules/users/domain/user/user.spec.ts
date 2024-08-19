import { DomainEvents } from '../../../../shared/domain/events/DomainEvents';
import { Email } from '../../../../shared/domain/valueObjects/email';
import { BuyerCreated } from './events/buyerCreated';
import { BuyerEmailVerified } from './events/buyerEmailVerified';
import { SellerCreated } from './events/sellerCreated';
import { SellerEmailVerified } from './events/sellerEmailVerified';
import { UserDeleted } from './events/userDeleted';
import { createRandomUser } from './tests/fixtures/user.fixture';
import { User } from './user';
import { UserRoles } from './userRoles';
import { FullName } from './valueObjects/fullName';
import { Password } from './valueObjects/password';
import { PhoneNumber } from './valueObjects/phoneNumber';
import { UserRole } from './valueObjects/userRole';

describe('User', () => {
  afterEach(() => {
    DomainEvents.clearHandlers();
    DomainEvents.clearMarkedAggregates();
  });

  it('should be able to create an user', () => {
    const email = Email.create('test@test.com').getValue() as Email;
    const fullName = FullName.create({ firstName: 'john' }).getValue() as FullName;
    const password = Password.create({ value: 'password1!' }).getValue() as Password;
    const phoneNumber = PhoneNumber.create({ value: '85553886', countryCode: 'SG' }).getValue() as PhoneNumber;
    const role = UserRole.create({ value: UserRoles.BUYER }).getValue() as UserRole;

    const userOrError = User.create({ phoneNumber, email, fullName, password, role });

    expect(userOrError.isSuccess).toBe(true);
  });

  it('when new user with buyer role is created, it should generate buyer created event', () => {
    const user: User = createRandomUser(UserRoles.BUYER);

    const domainEventNames = user.domainEvents.map((d) => d.constructor.name);
    expect(domainEventNames).toContainEqual(BuyerCreated.name);
  });

  it('when new user with seller role is created, it should generate seller created event', () => {
    const user: User = createRandomUser(UserRoles.SELLER);

    const domainEventNames = user.domainEvents.map((d) => d.constructor.name);
    expect(domainEventNames).toContainEqual(SellerCreated.name);
  });

  it('should be able to delete user', () => {
    const user: User = createRandomUser(UserRoles.BUYER);

    user.delete();

    expect(user.isDeleted).toBe(true);

    const domainEventNames = user.domainEvents.map((d) => d.constructor.name);
    expect(domainEventNames).toContainEqual(UserDeleted.name);
  });

  it('should be able to verify buyer email', () => {
    const user = createRandomUser(UserRoles.BUYER);

    user.verifyEmail();

    expect(user.isEmailVerified).toBe(true);

    const domainEventNames = user.domainEvents.map((d) => d.constructor.name);
    expect(domainEventNames).toContainEqual(BuyerEmailVerified.name);
  });

  it('should be able to verify seller email', () => {
    const user = createRandomUser(UserRoles.SELLER);

    user.verifyEmail();

    expect(user.isEmailVerified).toBe(true);

    const domainEventNames = user.domainEvents.map((d) => d.constructor.name);
    expect(domainEventNames).toContainEqual(SellerEmailVerified.name);
  });
});
