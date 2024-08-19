import { Maybe } from '../../../../shared/core/Result';
import { Email } from '../../../../shared/domain/valueObjects/email';
import { User } from '../../domain/user/user';
import { PhoneNumber } from '../../domain/user/valueObjects/phoneNumber';
import { UserId } from '../../domain/user/valueObjects/userId';
import { UserRole } from '../../domain/user/valueObjects/userRole';

export interface UserRepo {
  exists(userId: UserId): Promise<boolean>;
  save(user: User): Promise<void>;
  getUserByEmail(role: UserRole, email: Email): Promise<Maybe<User>>;
  getUserByPhoneNumber(role: UserRole, phoneNumber: PhoneNumber): Promise<Maybe<User>>;
  getAllUsers(): Promise<User[]>;
  getUserById(userId: string): Promise<Maybe<User>>;
}
