import models from '../../../../../shared/infra/database/sequelize/models';
import { Middleware } from '../../../../../shared/infra/http/utils/Middleware';
import { BuyerRepo } from '../../../repos/buyer/buyerRepo';
import { CartItemRepo } from '../../../repos/cart/cartItemRepo';
import { InMemoryCartItemRepo } from '../../../repos/cart/inMemoryCartItemRepo';
import { SequelizeCartItemRepo } from '../../../repos/cart/sequelizeCartItemRepo';
import { InMemoryProductRepo } from '../../../repos/product/inMemoryProductRepo';
import { ProductRepo } from '../../../repos/product/productRepo';
import { SequelizeProductRepo } from '../../../repos/product/sequelizeProductRepo';
import { AddProductToCartController } from '../../../useCases/addProductToCart/addProductToCartController';
import { AddProductToCartUseCase } from '../../../useCases/addProductToCart/addProductToCartUseCase';

type OrderRouteControllerConfig = {
  isTesting: boolean;
};

export class OrderRouteController {
  private cartItemRepo: CartItemRepo;
  private buyerRepo: BuyerRepo;
  private productRepo: ProductRepo;
  private middleware: Middleware;

  constructor(
    private config: OrderRouteControllerConfig,
    buyerRepo: BuyerRepo,
    middleware: Middleware,
  ) {
    this.buyerRepo = buyerRepo;
    this.cartItemRepo = this.getCartItemRepo();
    this.productRepo = this.getProductRepo();
    this.middleware = middleware;
  }

  getControllers() {
    return [this.createAddProductToCartController()];
  }

  private getCartItemRepo() {
    if (!this.cartItemRepo) {
      this.cartItemRepo = this.config.isTesting
        ? new InMemoryCartItemRepo(models.inMemoryModels)
        : new SequelizeCartItemRepo(models);
    }

    return this.cartItemRepo;
  }

  private getProductRepo() {
    if (!this.productRepo) {
      this.productRepo = this.config.isTesting
        ? new InMemoryProductRepo(models.inMemoryModels)
        : new SequelizeProductRepo(models);
    }

    return this.productRepo;
  }

  private createAddProductToCartController() {
    return new AddProductToCartController(this.createAddProductToCartUseCase(), [this.middleware.ensureAuthenticated()]);
  }

  private createAddProductToCartUseCase() {
    return new AddProductToCartUseCase(this.cartItemRepo, this.buyerRepo, this.productRepo);
  }
}
