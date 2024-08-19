/* eslint-disable no-await-in-loop */
import models from '../../../../shared/infra/database/sequelize/models';
import { createRandomProduct } from '../../domain/product/tests/product.fixture';
import { InMemoryProductRepo } from './inMemoryProductRepo';
import { ProductRepo } from './productRepo';
import { SequelizeProductRepo } from './sequelizeProductRepo';

describe('ProductRepo', () => {
  let productRepos: ProductRepo[];

  beforeEach(() => {
    productRepos = [new InMemoryProductRepo({ Product: [] }), new SequelizeProductRepo(models)];
  });

  afterEach(async () => {
    await models.Product.destroy({ where: {} });
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe('save', () => {
    it('should be able to save product', async () => {
      for (const repo of productRepos) {
        const product = createRandomProduct();

        await repo.save(product);

        const searchedProduct = await repo.getProduct(product.productId.getStringValue());

        expect(searchedProduct.isFound).toBe(true);
      }
    });
  });
});
