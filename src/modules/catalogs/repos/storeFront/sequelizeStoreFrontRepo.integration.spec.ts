/* eslint-disable no-await-in-loop */
import models from '../../../../shared/infra/database/sequelize/models';
import { Store } from '../../../users/domain/store/store';
import { createRandomStore } from '../../../users/domain/store/tests/fixtures/store.fixture';
import { createRandomUser } from '../../../users/domain/user/tests/fixtures/user.fixture';
import { User } from '../../../users/domain/user/user';
import { UserRoles } from '../../../users/domain/user/userRoles';
import { StoreMap } from '../../../users/mappers/storeMap';
import { SequelizeStoreRepo } from '../../../users/repos/storeRepo/implementations/sequelizeStoreRepo';
import { StoreRepo } from '../../../users/repos/storeRepo/storeRepo';
import { SequelizeUserRepo } from '../../../users/repos/userRepo/sequelizeUserRepo';
import { UserRepo } from '../../../users/repos/userRepo/userRepo';
import { createRandomStoreFront } from '../../domain/storeFront/tests/fixtures/storeFront.fixture';
import { InMemoryStoreFrontRepo } from './inMemoryStoreFrontRepo';
import { SequelizeStoreFrontRepo } from './sequelizeStoreFrontRepo';
import { StoreFrontRepo } from './storeFrontRepo';

describe('StoreFrontRepo', () => {
  let storeFrontRepos: StoreFrontRepo[];
  let seller: User;
  let store: Store;
  let userRepo: UserRepo;
  let storeRepo: StoreRepo;

  beforeAll(() => {
    userRepo = new SequelizeUserRepo(models);
    storeRepo = new SequelizeStoreRepo(models);
  });

  beforeEach(async () => {
    seller = createRandomUser(UserRoles.SELLER);
    store = createRandomStore(seller.userId);

    await userRepo.save(seller);
    await storeRepo.save(store);

    const inMemoryModels = {
      StoreFront: [],
      Store: [StoreMap.toPersistence(store)],
    };

    storeFrontRepos = [new InMemoryStoreFrontRepo(inMemoryModels), new SequelizeStoreFrontRepo(models)];
  });

  afterEach(async () => {
    await models.User.destroy({ where: {} });
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe('save', () => {
    it('should save the store front', async () => {
      for (const repo of storeFrontRepos) {
        const storeFront = createRandomStoreFront({ storeId: store.storeId });

        await repo.save(storeFront);

        expect(await repo.exists(storeFront.storeFrontId)).toBe(true);
      }
    });
  });

  describe('getStoreFrontByName', () => {
    it('should be able to get store front by name', async () => {
      for (const repo of storeFrontRepos) {
        const storeFront = createRandomStoreFront({ storeId: store.storeId, storeName: store.name });

        await repo.save(storeFront);

        const searchedStoreFront = await repo.getStoreFrontByName(storeFront.name);

        expect(searchedStoreFront.isFound).toBe(true);
      }
    });
  });
});
