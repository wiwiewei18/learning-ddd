/* eslint-disable no-await-in-loop */
import models from '../../../../shared/infra/database/sequelize/models';
import { createRandomUser } from '../../../users/domain/user/tests/fixtures/user.fixture';
import { User } from '../../../users/domain/user/user';
import { UserRoles } from '../../../users/domain/user/userRoles';
import { UserMap } from '../../../users/mappers/userMap';
import { SequelizeUserRepo } from '../../../users/repos/userRepo/sequelizeUserRepo';
import { UserRepo } from '../../../users/repos/userRepo/userRepo';
import { createRandomBuyer } from '../../domain/buyer/tests/fixtures/buyer.fixture';
import { BuyerRepo } from './buyerRepo';
import { InMemoryBuyerRepo } from './inMemoryBuyerRepo';
import { SequelizeBuyerRepo } from './sequelizeBuyerRepo';

describe('BuyerRepo', () => {
  let buyerRepos: BuyerRepo[];

  let baseUser: User;
  let userRepo: UserRepo;

  beforeAll(() => {
    userRepo = new SequelizeUserRepo(models);
  });

  beforeEach(async () => {
    baseUser = createRandomUser(UserRoles.BUYER);

    await userRepo.save(baseUser);

    buyerRepos = [
      new InMemoryBuyerRepo({ Buyer: [], User: [await UserMap.toPersistence(baseUser)] }),
      new SequelizeBuyerRepo(models),
    ];
  });

  afterEach(async () => {
    await models.Buyer.destroy({ where: {} });
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe('save', () => {
    it('should able save buyer', async () => {
      for (const repo of buyerRepos) {
        const buyer = createRandomBuyer({ baseUserId: baseUser.userId });

        await repo.save(buyer);

        expect(await repo.exists(buyer.buyerId)).toBe(true);
      }
    });
  });

  describe('getBuyerByBaseUserId', () => {
    it('should be able to get buyer by base user id', async () => {
      for (const repo of buyerRepos) {
        const buyer = createRandomBuyer({ baseUserId: baseUser.userId });

        await repo.save(buyer);

        const searchedBuyer = await repo.getBuyerByBaseUserId(buyer.baseUserId.getStringValue());

        expect(searchedBuyer.isFound).toBe(true);
      }
    });
  });
});
