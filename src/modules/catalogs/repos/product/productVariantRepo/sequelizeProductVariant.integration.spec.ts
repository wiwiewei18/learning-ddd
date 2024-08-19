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
import { createRandomProductVariant } from '../../../domain/product/entities/productVariant/productVariant.fixture';
import { ProductVariants } from '../../../domain/product/entities/productVariant/productVariants';
import { Product } from '../../../domain/product/product';
import { createRandomBaseProduct } from '../../../domain/product/product.fixture';
import { ProductVariantDetails } from '../../../domain/product/valueObjects/productVariantDetails';
import { StoreFront } from '../../../domain/storeFront/storeFront';
import { createRandomStoreFront } from '../../../domain/storeFront/tests/fixtures/storeFront.fixture';
import { BaseProductMap } from '../../../mappers/baseProductMap';
import { SequelizeStoreFrontRepo } from '../../storeFront/sequelizeStoreFrontRepo';
import { StoreFrontRepo } from '../../storeFront/storeFrontRepo';
import { BaseProductRepo } from '../baseProductRepo/baseProductRepo';
import { SequelizeBaseProductRepo } from '../baseProductRepo/sequelizeBaseProductRepo';
import { ProductCategoryRepo } from '../categoryRepo/categoryRepo';
import { SequelizeProductCategoryRepo } from '../categoryRepo/sequelizeCategoryRepo';
import { InMemoryProductVariantRepo } from './inMemoryProductVariantRepo';
import { ProductVariantRepo } from './productVariantRepo';
import { SequelizeProductVariantRepo } from './sequelizeProductVariantRepo';

let productVariantRepos: ProductVariantRepo[];
let baseProduct: Product;
let productCategory: ProductCategory;

let seller: User;
let store: Store;
let storeFront: StoreFront;
let baseProductRepo: BaseProductRepo;
let storeFrontRepo: StoreFrontRepo;
let storeRepo: StoreRepo;
let userRepo: UserRepo;
let productCategoryRepo: ProductCategoryRepo;
let sequelizeProductVariantRepo: ProductVariantRepo;

describe('ProductVariantRepo', () => {
  beforeAll(async () => {
    storeFrontRepo = new SequelizeStoreFrontRepo(models);
    storeRepo = new SequelizeStoreRepo(models);
    userRepo = new SequelizeUserRepo(models);
    productCategoryRepo = new SequelizeProductCategoryRepo(models);
  });

  beforeEach(async () => {
    sequelizeProductVariantRepo = new SequelizeProductVariantRepo(models);
    baseProductRepo = new SequelizeBaseProductRepo(models, sequelizeProductVariantRepo);

    productCategory = createRandomProductCategory();
    seller = createRandomUser(UserRoles.SELLER);
    store = createRandomStore(seller.userId);
    storeFront = createRandomStoreFront({ storeId: store.storeId });
    baseProduct = createRandomBaseProduct({
      productCategoryId: productCategory.productCategoryId,
      storeFrontId: storeFront.storeFrontId,
    });

    await productCategoryRepo.save(productCategory);
    await userRepo.save(seller);
    await storeRepo.save(store);
    await storeFrontRepo.save(storeFront);
    await baseProductRepo.save(baseProduct);

    const inMemoryModels = {
      ProductVariant: [],
      BaseProduct: [BaseProductMap.toPersistence(baseProduct)],
    };

    productVariantRepos = [new InMemoryProductVariantRepo(inMemoryModels), sequelizeProductVariantRepo];
  });

  afterEach(async () => {
    await models.ProductCategory.destroy({ where: {} });
    await models.User.destroy({ where: {} });
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe('getRecentProducts', () => {
    it('should return the most recent products when the product is updated', async () => {
      for (const repo of productVariantRepos) {
        const productVariant = createRandomProductVariant({ baseProductId: baseProduct.baseProductId });
        await repo.save(productVariant);

        await new Promise((f) => {
          setTimeout(f, 1000);
        });

        const anotherProductVariant = createRandomProductVariant({ baseProductId: baseProduct.baseProductId });

        await repo.save(anotherProductVariant);

        const recentProductVariants = await repo.getRecentProducts();

        const searchedAnotherSavedProductVariant = await repo.getProductVariantDetailsById(
          anotherProductVariant.productVariantId.getStringValue(),
        );

        const anotherSavedProductVariantDetails = searchedAnotherSavedProductVariant.getValue() as ProductVariantDetails;

        expect(recentProductVariants[0].productVariantId).toEqual(anotherSavedProductVariantDetails.productVariantId);
      }
    });
  });

  describe('save', () => {
    it('should be able to save product variant', async () => {
      for (const repo of productVariantRepos) {
        const productVariant = createRandomProductVariant({ baseProductId: baseProduct.baseProductId });
        await repo.save(productVariant);

        const savedProductVariant = await repo.getProductVariantDetailsById(
          productVariant.productVariantId.getStringValue(),
        );

        expect(savedProductVariant.isFound).toBe(true);
      }
    });
  });

  describe('saveBulk', () => {
    it('should be able to save bulk product variants', async () => {
      for (const repo of productVariantRepos) {
        const productVariantOne = createRandomProductVariant({ baseProductId: baseProduct.baseProductId });
        const productVariantTwo = createRandomProductVariant({ baseProductId: baseProduct.baseProductId });

        const productVariants = ProductVariants.create([]);
        productVariants.add(productVariantOne);
        productVariants.add(productVariantTwo);

        await repo.saveBulk(productVariants);

        const savedProductVariantOne = await repo.getProductVariantDetailsById(
          productVariantOne.productVariantId.getStringValue(),
        );
        const savedProductVariantTwo = await repo.getProductVariantDetailsById(
          productVariantTwo.productVariantId.getStringValue(),
        );

        expect(savedProductVariantOne.isFound).toBe(true);
        expect(savedProductVariantTwo.isFound).toBe(true);
      }
    });
  });

  describe('delete', () => {
    it('should be able to delete a product variant', async () => {
      for (const repo of productVariantRepos) {
        const productVariant = createRandomProductVariant({ baseProductId: baseProduct.baseProductId });
        await repo.save(productVariant);

        await repo.delete(productVariant);

        const savedProductVariant = await repo.getProductVariantDetailsById(
          productVariant.productVariantId.getStringValue(),
        );

        expect(savedProductVariant.isNotFound).toBe(true);
      }
    });
  });
});
