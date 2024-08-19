import models from '../../../../../shared/infra/database/sequelize/models';
import { Middleware } from '../../../../../shared/infra/http/utils/Middleware';
import { ProductService } from '../../../domain/services/productService';
import { BaseProductRepo } from '../../../repos/product/baseProductRepo/baseProductRepo';
import { InMemoryBaseProductRepo } from '../../../repos/product/baseProductRepo/inMemoryBaseProductRepo';
import { SequelizeBaseProductRepo } from '../../../repos/product/baseProductRepo/sequelizeBaseProductRepo';
import { ProductCategoryRepo } from '../../../repos/product/categoryRepo/categoryRepo';
import { InMemoryProductCategoryRepo } from '../../../repos/product/categoryRepo/inMemoryCategoryRepo';
import { SequelizeProductCategoryRepo } from '../../../repos/product/categoryRepo/sequelizeCategoryRepo';
import { InMemoryProductVariantRepo } from '../../../repos/product/productVariantRepo/inMemoryProductVariantRepo';
import { ProductVariantRepo } from '../../../repos/product/productVariantRepo/productVariantRepo';
import { SequelizeProductVariantRepo } from '../../../repos/product/productVariantRepo/sequelizeProductVariantRepo';
import { StoreFrontRepo } from '../../../repos/storeFront/storeFrontRepo';
import { ContentStorageService } from '../../../services/contentStorageService/contentStorageService';
import { ImageService } from '../../../services/imageService/imageService';
import { CreateProductController } from '../../../useCases/products/createProduct/createProductController';
import { CreateProductUseCase } from '../../../useCases/products/createProduct/createProductUseCase';
import { GetLatestProductsController } from '../../../useCases/products/getLatestProducts/getLatestProductsController';
import { GetLatestProductsUseCase } from '../../../useCases/products/getLatestProducts/getLatestProductsUseCase';

type CatalogRouteControllerConfig = {
  isTesting: boolean;
};

export class CatalogRouteController {
  private productVariantRepo: ProductVariantRepo;
  private baseProductRepo: BaseProductRepo;
  private productCategoryRepo: ProductCategoryRepo;
  private storeFrontRepo: StoreFrontRepo;
  private productService: ProductService;
  private imageService: ImageService;
  private contentStorageService: ContentStorageService;
  private middleware: Middleware;

  constructor(
    private config: CatalogRouteControllerConfig,
    storeFrontRepo: StoreFrontRepo,
    imageService: ImageService,
    contentStorageService: ContentStorageService,
    middleware: Middleware,
  ) {
    this.storeFrontRepo = storeFrontRepo;
    this.productVariantRepo = this.getProductVariantRepo();
    this.baseProductRepo = this.getBaseProductRepo();
    this.productCategoryRepo = this.getProductCategoryRepo();
    this.productService = this.createProductService();
    this.imageService = imageService;
    this.contentStorageService = contentStorageService;
    this.middleware = middleware;
  }

  getControllers() {
    return [this.createGetLatestProductsController(), this.createCreateProductController()];
  }

  private getProductVariantRepo() {
    if (!this.productVariantRepo) {
      this.productVariantRepo = this.config.isTesting
        ? new InMemoryProductVariantRepo(models.InMemoryModels)
        : new SequelizeProductVariantRepo(models);
    }

    return this.productVariantRepo;
  }

  private getProductCategoryRepo() {
    if (!this.productCategoryRepo) {
      this.productCategoryRepo = this.config.isTesting
        ? new InMemoryProductCategoryRepo()
        : new SequelizeProductCategoryRepo(models);
    }

    return this.productCategoryRepo;
  }

  private getBaseProductRepo() {
    if (!this.baseProductRepo) {
      this.baseProductRepo = this.config.isTesting
        ? new InMemoryBaseProductRepo()
        : new SequelizeBaseProductRepo(models, this.getProductVariantRepo());
    }

    return this.baseProductRepo;
  }

  private createProductService() {
    return new ProductService();
  }

  private createGetLatestProductsController() {
    return new GetLatestProductsController(this.createGetLatestProductsUseCase());
  }

  private createGetLatestProductsUseCase() {
    return new GetLatestProductsUseCase(this.productVariantRepo);
  }

  private createCreateProductController() {
    return new CreateProductController(this.createCreateProductUseCase(), [
      this.middleware.ensureAuthenticated(),
      this.middleware.createFormDataParser(),
    ]);
  }

  private createCreateProductUseCase() {
    return new CreateProductUseCase(
      this.baseProductRepo,
      this.productService,
      this.productCategoryRepo,
      this.storeFrontRepo,
      this.imageService,
      this.contentStorageService,
    );
  }
}
