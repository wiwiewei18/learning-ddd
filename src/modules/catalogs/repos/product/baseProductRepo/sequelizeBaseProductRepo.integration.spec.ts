/* eslint-disable no-await-in-loop */
import models from '../../../../../shared/infra/database/sequelize/models';
import { Store } from '../../../../users/domain/store/store';
import { createRandomStore } from '../../../../users/domain/store/tests/fixtures/store.fixture';
import { createRandomUser } from '../../../../users/domain/user/tests/fixtures/user.fixture';
import { User } from '../../../../users/domain/user/user';
import { UserRoles } from '../../../../users/domain/user/userRoles';
import { SequelizeStoreRepo } from '../../../../users/repos/storeRepo/implementations/sequelizeStoreRepo';
import { StoreRepo } from '../../../../users/repos/storeRepo/storeRepo';
import { SequelizeUserRepo } from '../../../../users/repos/userRepo/sequelizeUserRepo';
import { UserRepo } from '../../../../users/repos/userRepo/userRepo';
import { ProductCategory } from '../../../domain/product/entities/productCategory/productCategory';
import { createRandomProductCategory } from '../../../domain/product/entities/productCategory/productCategory.fixture';
import { createRandomBaseProduct } from '../../../domain/product/product.fixture';
import { StoreFront } from '../../../domain/storeFront/storeFront';
import { createRandomStoreFront } from '../../../domain/storeFront/tests/fixtures/storeFront.fixture';
import { SequelizeStoreFrontRepo } from '../../storeFront/sequelizeStoreFrontRepo';
import { StoreFrontRepo } from '../../storeFront/storeFrontRepo';
import { ProductCategoryRepo } from '../categoryRepo/categoryRepo';
import { SequelizeProductCategoryRepo } from '../categoryRepo/sequelizeCategoryRepo';
import { ProductVariantRepo } from '../productVariantRepo/productVariantRepo';
import { SequelizeProductVariantRepo } from '../productVariantRepo/sequelizeProductVariantRepo';
import { BaseProductRepo } from './baseProductRepo';
import { InMemoryBaseProductRepo } from './inMemoryBaseProductRepo';
import { SequelizeBaseProductRepo } from './sequelizeBaseProductRepo';

let baseProductRepos: BaseProductRepo[];
let productCategory: ProductCategory;
let seller: User;
let store: Store;
let storeFront: StoreFront;
let storeFrontRepo: StoreFrontRepo;
let storeRepo: StoreRepo;
let userRepo: UserRepo;
let productCategoryRepo: ProductCategoryRepo;
let productVariantRepo: ProductVariantRepo;

describe('BaseProductRepo', () => {
  beforeAll(async () => {
    storeFrontRepo = new SequelizeStoreFrontRepo(models);
    storeRepo = new SequelizeStoreRepo(models);
    userRepo = new SequelizeUserRepo(models);
    productCategoryRepo = new SequelizeProductCategoryRepo(models);
    productVariantRepo = new SequelizeProductVariantRepo(models);
  });

  beforeEach(async () => {
    productCategory = createRandomProductCategory();
    seller = createRandomUser(UserRoles.SELLER);
    store = createRandomStore(seller.userId);
    storeFront = createRandomStoreFront({ storeId: store.storeId });

    await productCategoryRepo.save(productCategory);
    await userRepo.save(seller);
    await storeRepo.save(store);
    await storeFrontRepo.save(storeFront);

    baseProductRepos = [new InMemoryBaseProductRepo(), new SequelizeBaseProductRepo(models, productVariantRepo)];
  });

  afterEach(async () => {
    await models.ProductCategory.destroy({ where: {} });
    await models.User.destroy({ where: {} });
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe('save', () => {
    it('should save the base product', async () => {
      for (const repo of baseProductRepos) {
        const baseProduct = createRandomBaseProduct({
          productCategoryId: productCategory.productCategoryId,
          storeFrontId: storeFront.storeFrontId,
        });

        await repo.save(baseProduct);

        const allBaseProducts = await repo.getAllBaseProducts();
        const indexOfBaseProduct = allBaseProducts.findIndex((s) => s.equals(baseProduct));

        expect(indexOfBaseProduct).not.toBe(-1);
      }
    });
  });

  describe('getProductByName', () => {
    it('should be able to get a product by name', async () => {
      for (const repo of baseProductRepos) {
        const baseProduct = createRandomBaseProduct({
          productCategoryId: productCategory.productCategoryId,
          storeFrontId: storeFront.storeFrontId,
        });

        await repo.save(baseProduct);

        const searchedProduct = await repo.getProductByName(baseProduct.name.value);

        expect(searchedProduct.isFound).toBe(true);
      }
    });
  });

  describe('delete', () => {
    it('should be able to delete a product', async () => {
      for (const repo of baseProductRepos) {
        const baseProduct = createRandomBaseProduct({
          productCategoryId: productCategory.productCategoryId,
          storeFrontId: storeFront.storeFrontId,
        });

        await repo.save(baseProduct);

        await repo.delete(baseProduct.baseProductId);

        const searchedProduct = await repo.getProductByName(baseProduct.name.value);

        expect(searchedProduct.isNotFound).toBe(true);
      }
    });
  });
});
