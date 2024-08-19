import { Maybe, Result } from '../../../../shared/core/Result';
import { Email } from '../../../../shared/domain/valueObjects/email';
import { User } from '../../domain/user/user';
import { PhoneNumber } from '../../domain/user/valueObjects/phoneNumber';
import { UserId } from '../../domain/user/valueObjects/userId';
import { UserRole } from '../../domain/user/valueObjects/userRole';
import { UserPersistenceDTO } from '../../dtos/userDTO';
import { UserMap } from '../../mappers/userMap';
import { UserRepo } from './userRepo';

export class SequelizeUserRepo implements UserRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async exists(userId: UserId): Promise<boolean> {
    const user = await this.models.User.findOne({ where: { user_id: userId.getStringValue() } });
    return !!user === true;
  }

  async save(user: User): Promise<void> {
    const rawUser = await UserMap.toPersistence(user);
    const sequelizeUser = await this.models.User.findOne({ where: { user_id: user.userId.getStringValue() } });

    if (sequelizeUser) {
      rawUser.updated_at = new Date();
      Object.assign(sequelizeUser, rawUser);
      await sequelizeUser.save();
    } else {
      await this.models.User.create(rawUser);
    }
  }

  async getUserByEmail(role: UserRole, email: Email): Promise<Maybe<User>> {
    const user = await this.models.User.findOne({ where: { email: email.value, role: role.value } });
    if (!user) {
      return Result.notFound(`User with email ${email.value} and role ${role.value} not found`);
    }
    return Result.found(UserMap.toDomain(user));
  }

  async getUserByPhoneNumber(role: UserRole, phoneNumber: PhoneNumber): Promise<Maybe<User>> {
    const user = await this.models.User.findOne({ where: { phone_number: phoneNumber.value, role: role.value } });
    if (!user) {
      return Result.notFound(`User with phone number ${phoneNumber.value} and role ${role.value} not found`);
    }
    return Result.found(UserMap.toDomain(user));
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.models.User.findAll();
    return users.map((u: UserPersistenceDTO) => UserMap.toDomain(u));
  }

  async getUserById(userId: string): Promise<Maybe<User>> {
    const user = await this.models.User.findOne({ where: { user_id: userId } });
    if (!user) {
      return Result.notFound(`User with id ${userId} not found`);
    }
    return Result.found(UserMap.toDomain(user));
  }
}
