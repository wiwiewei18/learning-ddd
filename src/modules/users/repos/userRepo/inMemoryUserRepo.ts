import { Maybe, Result } from '../../../../shared/core/Result';
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents';
import { Email } from '../../../../shared/domain/valueObjects/email';
import { User } from '../../domain/user/user';
import { PhoneNumber } from '../../domain/user/valueObjects/phoneNumber';
import { UserId } from '../../domain/user/valueObjects/userId';
import { UserRole } from '../../domain/user/valueObjects/userRole';
import { UserRepo } from './userRepo';

export class InMemoryUserRepo implements UserRepo {
  private arr: User[];

  constructor(arr: User[] = []) {
    this.arr = arr;
  }

  async exists(userId: UserId): Promise<boolean> {
    for (let i = 0; i < this.arr.length; i++) {
      if (this.arr[i].userId.equals(userId)) {
        return true;
      }
    }
    return false;
  }

  async save(user: User): Promise<void> {
    if (!(await this.exists(user.userId))) {
      this.arr.push(user);
      // todo: add to all in memory repo to test the chaining domain event
      DomainEvents.dispatchEventsForAggregate(user.userId.getValue());
    }
  }

  async getUserByEmail(role: UserRole, email: Email): Promise<Maybe<User>> {
    for (const user of this.arr) {
      if (user.email.equals(email) && user.role.equals(role)) {
        return Result.found<User>(user);
      }
    }

    return Result.notFound<User>(`User with email ${email.value} not found`);
  }

  async getAllUsers(): Promise<User[]> {
    return this.arr;
  }

  async getUserByPhoneNumber(role: UserRole, phoneNumber: PhoneNumber): Promise<Maybe<User>> {
    for (const user of this.arr) {
      if (user.phoneNumber.equals(phoneNumber) && user.role.equals(role)) {
        return Result.found<User>(user);
      }
    }

    return Result.notFound<User>(`User with phone number ${phoneNumber.value} not found`);
  }

  async getUserById(userId: string): Promise<Maybe<User>> {
    for (let i = 0; i < this.arr.length; i++) {
      if (this.arr[i].userId.getStringValue() === userId) {
        return Result.found<User>(this.arr[i]);
      }
    }
    return Result.notFound<User>(`User with user id ${userId} not found`);
  }
}
