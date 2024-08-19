/* eslint-disable no-await-in-loop */
import models from '../../../../shared/infra/database/sequelize/models';
import { ProductCategory } from '../../../catalogs/domain/product/entities/productCategory/productCategory';
import { createRandomProductCategory } from '../../../catalogs/domain/product/entities/productCategory/productCategory.fixture';
import { ProductVariant } from '../../../catalogs/domain/product/entities/productVariant/productVariant';
import { createRandomProductVariant } from '../../../catalogs/domain/product/entities/productVariant/productVariant.fixture';
import { Product as BaseProduct } from '../../../catalogs/domain/product/product';
import { createRandomBaseProduct } from '../../../catalogs/domain/product/product.fixture';
import { StoreFront } from '../../../catalogs/domain/storeFront/storeFront';
import { createRandomStoreFront } from '../../../catalogs/domain/storeFront/tests/fixtures/storeFront.fixture';
import { BaseProductRepo } from '../../../catalogs/repos/product/baseProductRepo/baseProductRepo';
import { SequelizeBaseProductRepo } from '../../../catalogs/repos/product/baseProductRepo/sequelizeBaseProductRepo';
import { ProductCategoryRepo } from '../../../catalogs/repos/product/categoryRepo/categoryRepo';
import { SequelizeProductCategoryRepo } from '../../../catalogs/repos/product/categoryRepo/sequelizeCategoryRepo';
import { ProductVariantRepo } from '../../../catalogs/repos/product/productVariantRepo/productVariantRepo';
import { SequelizeProductVariantRepo } from '../../../catalogs/repos/product/productVariantRepo/sequelizeProductVariantRepo';
import { SequelizeStoreFrontRepo } from '../../../catalogs/repos/storeFront/sequelizeStoreFrontRepo';
import { StoreFrontRepo } from '../../../catalogs/repos/storeFront/storeFrontRepo';
import { Store } from '../../../users/domain/store/store';
import { createRandomStore } from '../../../users/domain/store/tests/fixtures/store.fixture';
import { createRandomUser } from '../../../users/domain/user/tests/fixtures/user.fixture';
import { User } from '../../../users/domain/user/user';
import { UserRoles } from '../../../users/domain/user/userRoles';
import { SequelizeStoreRepo } from '../../../users/repos/storeRepo/implementations/sequelizeStoreRepo';
import { StoreRepo } from '../../../users/repos/storeRepo/storeRepo';
import { SequelizeUserRepo } from '../../../users/repos/userRepo/sequelizeUserRepo';
import { UserRepo } from '../../../users/repos/userRepo/userRepo';
import { Buyer } from '../../domain/buyer/buyer';
import { createRandomBuyer } from '../../domain/buyer/tests/fixtures/buyer.fixture';
import { createRandomCartItem } from '../../domain/cart/tests/cartItem.fixture';
import { Product } from '../../domain/product/product';
import { createRandomProduct } from '../../domain/product/tests/product.fixture';
import { BuyerRepo } from '../buyer/buyerRepo';
import { SequelizeBuyerRepo } from '../buyer/sequelizeBuyerRepo';
import { ProductRepo } from '../product/productRepo';
import { SequelizeProductRepo } from '../product/sequelizeProductRepo';
import { CartItemRepo } from './cartItemRepo';
import { InMemoryCartItemRepo } from './inMemoryCartItemRepo';
import { SequelizeCartItemRepo } from './sequelizeCartItemRepo';

describe('CartItem', () => {
  let cartItemRepos: CartItemRepo[];

  let baseUser: User;
  let buyer: Buyer;
  let seller: User;
  let store: Store;
  let storeFront: StoreFront;
  let productCategory: ProductCategory;
  let baseProduct: BaseProduct;
  let productVariant: ProductVariant;
  let product: Product;

  let userRepo: UserRepo;
  let buyerRepo: BuyerRepo;
  let storeRepo: StoreRepo;
  let storeFrontRepo: StoreFrontRepo;
  let productCategoryRepo: ProductCategoryRepo;
  let baseProductRepo: BaseProductRepo;
  let productVariantRepo: ProductVariantRepo;
  let productRepo: ProductRepo;

  beforeAll(() => {
    userRepo = new SequelizeUserRepo(models);
    buyerRepo = new SequelizeBuyerRepo(models);
    storeFrontRepo = new SequelizeStoreFrontRepo(models);
    storeRepo = new SequelizeStoreRepo(models);
    productCategoryRepo = new SequelizeProductCategoryRepo(models);
    productVariantRepo = new SequelizeProductVariantRepo(models);
    baseProductRepo = new SequelizeBaseProductRepo(models, productVariantRepo);
    productRepo = new SequelizeProductRepo(models);
  });

  beforeEach(async () => {
    baseUser = createRandomUser(UserRoles.BUYER);
    await userRepo.save(baseUser);

    buyer = createRandomBuyer({ baseUserId: baseUser.userId });
    await buyerRepo.save(buyer);

    productCategory = createRandomProductCategory();
    await productCategoryRepo.save(productCategory);

    seller = createRandomUser(UserRoles.SELLER);
    await userRepo.save(seller);

    store = createRandomStore(seller.userId);
    await storeRepo.save(store);

    storeFront = createRandomStoreFront({ storeId: store.storeId });
    await storeFrontRepo.save(storeFront);

    baseProduct = createRandomBaseProduct({
      productCategoryId: productCategory.productCategoryId,
      storeFrontId: storeFront.storeFrontId,
    });
    await baseProductRepo.save(baseProduct);

    productVariant = createRandomProductVariant({
      baseProductId: baseProduct.baseProductId,
    });
    await productVariantRepo.save(productVariant);

    product = createRandomProduct(productVariant.productVariantId);
    await productRepo.save(product);

    cartItemRepos = [new InMemoryCartItemRepo({ CartItem: [] }), new SequelizeCartItemRepo(models)];
  });

  afterEach(async () => {
    await models.ProductCategory.destroy({ where: {} });
    await models.User.destroy({ where: {} });
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe('save', () => {
    it('should be able to save cart item', async () => {
      for (const repo of cartItemRepos) {
        const cartItem = createRandomCartItem({ buyerId: buyer.buyerId, productId: product.productId, quantity: 1 });

        await repo.save(cartItem);

        expect(await repo.exists(cartItem.cartItemId)).toBe(true);
      }
    });
  });
});
