import { Guard } from '../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { Email } from '../../../../shared/domain/valueObjects/email';
import { BuyerCreated } from './events/buyerCreated';
import { BuyerEmailVerified } from './events/buyerEmailVerified';
import { SellerCreated } from './events/sellerCreated';
import { SellerEmailVerified } from './events/sellerEmailVerified';
import { UserDeleted } from './events/userDeleted';
import { UserRoles } from './userRoles';
import { FullName } from './valueObjects/fullName';
import { Password } from './valueObjects/password';
import { PhoneNumber } from './valueObjects/phoneNumber';
import { UserId } from './valueObjects/userId';
import { UserRole } from './valueObjects/userRole';

interface UserProps {
  fullName: FullName;
  phoneNumber: PhoneNumber;
  email: Email;
  password: Password;
  role: UserRole;
  isEmailVerified?: boolean;
  emailVerificationToken?: string;
  isDeleted?: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id).getValue() as UserId;
  }

  get fullName(): FullName {
    return this.props.fullName;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): Password {
    return this.props.password;
  }

  get phoneNumber(): PhoneNumber {
    return this.props.phoneNumber;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get emailVerificationToken(): string | undefined {
    return this.props.emailVerificationToken;
  }

  get isEmailVerified(): boolean | undefined {
    return this.props.isEmailVerified;
  }

  get isDeleted(): boolean | undefined {
    return this.props.isDeleted;
  }

  get accessToken(): string | undefined {
    return this.props.accessToken;
  }

  get refreshToken(): string | undefined {
    return this.props.refreshToken;
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  delete(): void {
    this.props.isDeleted = true;
    this.addDomainEvent(new UserDeleted(this));
  }

  isLoggedIn(): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken;
  }

  setAccessToken(token: string, refreshToken: string): void {
    this.props.accessToken = token;
    this.props.refreshToken = refreshToken;
  }

  verifyEmail(): void {
    this.props.isEmailVerified = true;

    if (this.role.value === UserRoles.BUYER) {
      this.addDomainEvent(new BuyerEmailVerified(this));
    }

    if (this.role.value === UserRoles.SELLER) {
      this.addDomainEvent(new SellerEmailVerified(this));
    }
  }

  static create(props: UserProps, id?: UniqueEntityID): SuccessOrFailure<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.email,
        argumentName: 'email',
      },
      {
        argument: props.fullName,
        argumentName: 'fullName',
      },
      {
        argument: props.password,
        argumentName: 'password',
      },
      {
        argument: props.phoneNumber,
        argumentName: 'phoneNumber',
      },
      {
        argument: props.role,
        argumentName: 'role',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<User>(guardResult.getErrorValue());
    }

    const isNewUser = !!id === false;

    const user = new User(
      {
        ...props,
        isEmailVerified: props.isEmailVerified ? props.isEmailVerified : false,
        isDeleted: props.isDeleted ? props.isDeleted : false,
      },
      id,
    );

    if (isNewUser) {
      if (user.role.value === UserRoles.BUYER) {
        user.addDomainEvent(new BuyerCreated(user));
      }

      if (user.role.value === UserRoles.SELLER) {
        user.addDomainEvent(new SellerCreated(user));
      }
    }

    return Result.ok<User>(user);
  }
}
