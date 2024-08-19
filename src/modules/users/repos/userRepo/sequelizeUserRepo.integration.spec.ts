/* eslint-disable no-await-in-loop */
import models from '../../../../shared/infra/database/sequelize/models';
import { createRandomUser } from '../../domain/user/tests/fixtures/user.fixture';
import { User } from '../../domain/user/user';
import { UserRoles } from '../../domain/user/userRoles';
import { InMemoryUserRepo } from './inMemoryUserRepo';
import { SequelizeUserRepo } from './sequelizeUserRepo';
import { UserRepo } from './userRepo';

let userRepos: UserRepo[];

describe('UserRepo integration test', () => {
  beforeEach(() => {
    userRepos = [new InMemoryUserRepo(), new SequelizeUserRepo(models)];
  });

  afterEach(async () => {
    await models.User.destroy({ where: {} });
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe('save', () => {
    it('should save the user', async () => {
      for (let i = 0; i < userRepos.length; i++) {
        const user = createRandomUser(UserRoles.BUYER);
        const repo = userRepos[i];

        await repo.save(user);

        const allUsers = await repo.getAllUsers();
        const indexOfUser = allUsers.findIndex((b: User) => b.equals(user));
        expect(indexOfUser).not.toBe(-1);
      }
    });
  });

  describe('exists', () => {
    test('user should not exists when not saved yet', async () => {
      for (let i = 0; i < userRepos.length; i++) {
        const user = createRandomUser(UserRoles.BUYER);
        const repo = userRepos[i];

        expect(await repo.exists(user.userId)).toBe(false);
      }
    });

    test('user should exists when already saved', async () => {
      for (let i = 0; i < userRepos.length; i++) {
        const user = createRandomUser(UserRoles.BUYER);
        const repo = userRepos[i];

        await repo.save(user);

        expect(await repo.exists(user.userId)).toBe(true);
      }
    });
  });

  describe('getAllUsers', () => {
    it('should be able to get all users', async () => {
      for (let i = 0; i < userRepos.length; i++) {
        const firstUser = createRandomUser(UserRoles.BUYER);
        const secondUser = createRandomUser(UserRoles.BUYER);

        const repo = userRepos[i];

        await repo.save(firstUser);
        await repo.save(secondUser);

        const users = await repo.getAllUsers();

        expect(users.length).toBe(2);
      }
    });
  });

  describe('getUserByPhoneNumber', () => {
    it('should be able to get user by phone number', async () => {
      for (const repo of userRepos) {
        const user = createRandomUser(UserRoles.BUYER);

        await repo.save(user);

        const searchedUser = await repo.getUserByPhoneNumber(user.role, user.phoneNumber);

        expect(searchedUser.isFound).toBe(true);
      }
    });

    it('should not found the user when there is no user with given phone number', async () => {
      for (const repo of userRepos) {
        const user = createRandomUser(UserRoles.BUYER);

        const searchedUser = await repo.getUserByPhoneNumber(user.role, user.phoneNumber);

        expect(searchedUser.isNotFound).toBe(true);
      }
    });
  });

  describe('getUserByEmail', () => {
    it('should be able to get user by email', async () => {
      for (const repo of userRepos) {
        const user = createRandomUser(UserRoles.BUYER);

        await repo.save(user);

        const searchedUser = await repo.getUserByEmail(user.role, user.email);

        expect(searchedUser.isFound).toBe(true);
      }
    });

    it('should not found the user when there is no user with given email', async () => {
      for (const repo of userRepos) {
        const user = createRandomUser(UserRoles.BUYER);

        const searchedUser = await repo.getUserByEmail(user.role, user.email);

        expect(searchedUser.isNotFound).toBe(true);
      }
    });
  });
});
