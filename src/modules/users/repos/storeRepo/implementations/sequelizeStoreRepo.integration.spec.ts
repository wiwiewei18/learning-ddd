/* eslint-disable no-await-in-loop */
import models from '../../../../../shared/infra/database/sequelize/models';
import { Store } from '../../../domain/store/store';
import { createRandomStore } from '../../../domain/store/tests/fixtures/store.fixture';
import { createRandomUser } from '../../../domain/user/tests/fixtures/user.fixture';
import { User } from '../../../domain/user/user';
import { UserRoles } from '../../../domain/user/userRoles';
import { SequelizeUserRepo } from '../../userRepo/sequelizeUserRepo';
import { UserRepo } from '../../userRepo/userRepo';
import { StoreRepo } from '../storeRepo';
import { InMemoryStoreRepo } from './inMemoryStoreRepo';
import { SequelizeStoreRepo } from './sequelizeStoreRepo';

let storeRepos: StoreRepo[];
let randomSeller: User;
let userRepo: UserRepo;

describe('StoreRepo', () => {
  beforeAll(async () => {
    userRepo = new SequelizeUserRepo(models);
  });

  beforeEach(async () => {
    randomSeller = createRandomUser(UserRoles.SELLER);
    await userRepo.save(randomSeller);

    storeRepos = [new InMemoryStoreRepo(), new SequelizeStoreRepo(models)];
  });

  afterEach(async () => {
    await models.User.destroy({ where: {} });
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe('save', () => {
    it('should save the store', async () => {
      for (const repo of storeRepos) {
        const store = createRandomStore(randomSeller.userId);

        await repo.save(store);

        const allStores = await repo.getAllStores();
        const indexOfStore = allStores.findIndex((s: Store) => s.equals(store));

        expect(indexOfStore).not.toBe(-1);
      }
    });
  });

  describe('exists', () => {
    test('store should exists when already been saved', async () => {
      for (const repo of storeRepos) {
        const store = createRandomStore(randomSeller.userId);

        await repo.save(store);

        expect(await repo.exists(store.storeId)).toBe(true);
      }
    });
  });
});
