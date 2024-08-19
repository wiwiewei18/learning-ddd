import mg from 'nodemailer-mailgun-transport';
import { AppConfiguration } from '../../config/appConfig';
import { CatalogRouteController } from '../../modules/catalogs/infra/http/routes/catalogRouteController';
import { CatalogSubscriptions } from '../../modules/catalogs/infra/subscriptions/catalogSubscriptions';
import { InMemoryStoreFrontRepo } from '../../modules/catalogs/repos/storeFront/inMemoryStoreFrontRepo';
import { SequelizeStoreFrontRepo } from '../../modules/catalogs/repos/storeFront/sequelizeStoreFrontRepo';
import { StoreFrontRepo } from '../../modules/catalogs/repos/storeFront/storeFrontRepo';
import { ContentStorageService } from '../../modules/catalogs/services/contentStorageService/contentStorageService';
import { S3ContentStorageService } from '../../modules/catalogs/services/contentStorageService/s3ContentStorageService';
import { ImageService } from '../../modules/catalogs/services/imageService/imageService';
import { SharpImageService } from '../../modules/catalogs/services/imageService/sharpImageService';
import { CreateStoreFrontUseCase } from '../../modules/catalogs/useCases/storeFront/createStoreFront/createStoreFrontUseCase';
import { NotificationSubscriptions } from '../../modules/notifications/infra/subscriptions/notificationSubscriptions';
import { EmailService } from '../../modules/notifications/services/emailService/emailService';
import { NodemailerEmailService } from '../../modules/notifications/services/emailService/nodemailer/nodemailerEmailService';
import { StubEmailService } from '../../modules/notifications/services/emailService/stubEmailService';
import { EmailTemplateService } from '../../modules/notifications/services/emailTemplateProvider/emailTemplateProvider';
import { LocalFileEmailTemplateService } from '../../modules/notifications/services/emailTemplateProvider/localFile/localFileEmailTemplateProvider';
import { SendEmailVerificationUseCase } from '../../modules/notifications/useCases/sendVerificationEmail/SendEmailVerificationUseCase';
import { OrderRouteController } from '../../modules/orders/infra/http/routes/orderRouteController';
import { OrderSubscriptions } from '../../modules/orders/infra/subscriptions/orderSubscriptions';
import { BuyerRepo } from '../../modules/orders/repos/buyer/buyerRepo';
import { InMemoryBuyerRepo } from '../../modules/orders/repos/buyer/inMemoryBuyerRepo';
import { SequelizeBuyerRepo } from '../../modules/orders/repos/buyer/sequelizeBuyerRepo';
import { CreateBuyerUseCase } from '../../modules/orders/useCases/buyer/createBuyer/createBuyerUseCase';
import { UserRouteController } from '../../modules/users/infra/http/userRouteController';
import { UserScheduleHandler } from '../../modules/users/infra/schedules/userScheduleHandler';
import { InMemoryStoreRepo } from '../../modules/users/repos/storeRepo/implementations/inMemoryStoreRepo';
import { SequelizeStoreRepo } from '../../modules/users/repos/storeRepo/implementations/sequelizeStoreRepo';
import { StoreRepo } from '../../modules/users/repos/storeRepo/storeRepo';
import { InMemoryUserRepo } from '../../modules/users/repos/userRepo/inMemoryUserRepo';
import { SequelizeUserRepo } from '../../modules/users/repos/userRepo/sequelizeUserRepo';
import { UserRepo } from '../../modules/users/repos/userRepo/userRepo';
import { AuthService } from '../../modules/users/services/authService/authService';
import { CaptchaClient } from '../../modules/users/services/authService/implementations/captchaClient';
import { MongoAuthService } from '../../modules/users/services/authService/implementations/mongoAuthService';
import { tokenModel } from '../../modules/users/services/authService/implementations/mongoModels';
import { DomainEvents } from '../domain/events/DomainEvents';
import { DatabaseConnection } from '../infra/database/databaseConnection';
import { MongooseDatabaseConnection } from '../infra/database/mongoose/mongooseDatabaseConnection';
import { createHooksForAggregateRoots } from '../infra/database/sequelize/hooks';
import models from '../infra/database/sequelize/models';
import { SequelizeDatabaseConnection } from '../infra/database/sequelize/sequelizeDatabaseConnection';
import { BaseController } from '../infra/http/models/BaseController';
import { Middleware } from '../infra/http/utils/Middleware';
import { WebServer } from '../infra/http/webServer';
import { AgendaSchedulingService } from '../infra/scheduler/agendaSchedulingService';
import { ScheduleHandler } from '../infra/scheduler/scheduleHandler';
import { SchedulingService } from '../infra/scheduler/schedulingService';
import { WarehouseRouteController } from '../../modules/warehouses/infra/http/routes/warehouseRouteController';

export class CompositionRoot {
  private webServer: WebServer;
  private authService: AuthService;
  private userRepo: UserRepo | undefined;
  private schedulingService: SchedulingService;
  private middleware: Middleware;
  private contentStorageService: ContentStorageService;
  private emailService: EmailService;
  private emailTemplateService: EmailTemplateService;
  private imageService: ImageService;
  private mongooseDatabaseConnection: DatabaseConnection | undefined;
  private sequelizeDatabaseConnection: DatabaseConnection | undefined;
  private storeRepo: StoreRepo | undefined;
  private storeFrontRepo: StoreFrontRepo | undefined;
  private buyerRepo: BuyerRepo | undefined;

  constructor(private config: AppConfiguration) {
    this.authService = this.createAuthService();
    this.schedulingService = this.createSchedulingService();
    this.middleware = this.createMiddleware();
    this.contentStorageService = this.createContentStorageService();
    this.emailService = this.createEmailService();
    this.emailTemplateService = this.createEmailTemplateService();
    this.imageService = this.createImageService();
    this.webServer = this.createWebServer();

    this.setupSubscriptions();

    console.log(DomainEvents);
  }

  createWebServer() {
    return new WebServer(this.config.getServerConfiguration(), this.createProductionRouteControllers());
  }

  private createProductionRouteControllers(): BaseController[] {
    return [
      ...this.createUserRouteController().getControllers(),
      ...this.createCatalogRouteController().getControllers(),
      ...this.createOrderRouteController().getControllers(),
      ...this.createWarehouseRouteController().getControllers(),
    ];
  }

  private createUserRouteController() {
    return new UserRouteController(
      this.getUserRepo(),
      this.getStoreRepo(),
      this.getAuthService(),
      this.getSchedulingService(),
      this.getMiddleware(),
    );
  }

  private createCatalogRouteController() {
    return new CatalogRouteController(
      { isTesting: this.config.isTesting() },
      this.getStoreFrontRepo(),
      this.getImageService(),
      this.getContentStorageService(),
      this.getMiddleware(),
    );
  }

  private createOrderRouteController() {
    return new OrderRouteController({ isTesting: this.config.isTesting() }, this.getBuyerRepo(), this.getMiddleware());
  }

  private createWarehouseRouteController() {
    return new WarehouseRouteController({ isTesting: this.config.isTesting() }, this.getMiddleware());
  }

  private createProductionScheduleControllers(): ScheduleHandler[] {
    return [...this.createUserScheduleHandler().getHandlers()];
  }

  private createUserScheduleHandler() {
    return new UserScheduleHandler(this.getUserRepo());
  }

  private createOrderSubscriptions() {
    return new OrderSubscriptions(this.createCreateBuyerUseCase());
  }

  private createNotificationSubscriptions() {
    return new NotificationSubscriptions(this.createSendEmailVerificationUseCase());
  }

  private createCreateBuyerUseCase() {
    return new CreateBuyerUseCase(this.getUserRepo(), this.getBuyerRepo());
  }

  private createCatalogSubscriptions() {
    return new CatalogSubscriptions(this.createCreateStoreFrontUseCase());
  }

  private setupSubscriptions() {
    this.createOrderSubscriptions().setupSubscriptions();
    this.createNotificationSubscriptions().setupSubscriptions();
    this.createCatalogSubscriptions().setupSubscriptions();

    createHooksForAggregateRoots();
  }

  private createCreateStoreFrontUseCase() {
    return new CreateStoreFrontUseCase(this.getStoreRepo(), this.getStoreFrontRepo());
  }

  private createSendEmailVerificationUseCase() {
    const config = this.config.getAuthenticationConfiguration();
    return new SendEmailVerificationUseCase(
      {
        buyerEmailVerificationCallbackUrl: config.buyerEmailVerificationCallbackUrl,
        emailVerificationSenderEmailAddress: config.emailVerificationSenderEmailAddress,
        sellerEmailVerificationCallbackUrl: config.sellerEmailVerificationCallbackUrl,
      },
      this.getEmailService(),
      this.getEmailTemplateService(),
    );
  }

  private getUserRepo() {
    if (!this.userRepo) {
      this.userRepo = this.config.isTesting() ? new InMemoryUserRepo() : new SequelizeUserRepo(models);
    }

    return this.userRepo;
  }

  private getStoreRepo() {
    if (!this.storeRepo) {
      this.storeRepo = this.config.isTesting() ? new InMemoryStoreRepo() : new SequelizeStoreRepo(models);
    }

    return this.storeRepo;
  }

  private getStoreFrontRepo() {
    if (!this.storeFrontRepo) {
      this.storeFrontRepo = this.config.isTesting()
        ? new InMemoryStoreFrontRepo(models.inMemoryModels)
        : new SequelizeStoreFrontRepo(models);
    }

    return this.storeFrontRepo;
  }

  private getBuyerRepo() {
    if (!this.buyerRepo) {
      this.buyerRepo = this.config.isTesting()
        ? new InMemoryBuyerRepo(models.inMemoryModels)
        : new SequelizeBuyerRepo(models);
    }

    return this.buyerRepo;
  }

  getWebServer() {
    return this.webServer;
  }

  createAuthService() {
    return new MongoAuthService(this.config.getAuthenticationConfiguration(), tokenModel, this.createCaptchaClient());
  }

  private createCaptchaClient() {
    return new CaptchaClient({ secretKey: this.config.getAuthenticationConfiguration().captchaSecretKey });
  }

  getAuthService() {
    return this.authService;
  }

  private createSchedulingService() {
    return new AgendaSchedulingService(
      this.config.getScheduleServiceConfiguration(),
      this.createProductionScheduleControllers(),
    );
  }

  getSchedulingService() {
    return this.schedulingService;
  }

  private createMiddleware() {
    return new Middleware({ isProduction: this.config.isProduction() }, this.authService);
  }

  getMiddleware() {
    return this.middleware;
  }

  private createContentStorageService() {
    return new S3ContentStorageService(this.config.getContentStorageServiceConfiguration());
  }

  getContentStorageService() {
    return this.contentStorageService;
  }

  private createEmailService() {
    if (this.config.isProduction()) {
      const config = this.config.getEmailServiceConfiguration();
      const mailgunNodemailerTransporter = NodemailerEmailService.createTransporter(
        mg({ auth: { api_key: config.apiKey, domain: config.domain }, host: config.host }),
      );
      this.emailService = new NodemailerEmailService(mailgunNodemailerTransporter);
    } else {
      this.emailService = new StubEmailService();
    }

    return this.emailService;
  }

  getEmailService() {
    return this.emailService;
  }

  private createEmailTemplateService() {
    return new LocalFileEmailTemplateService();
  }

  getEmailTemplateService() {
    return this.emailTemplateService;
  }

  private createImageService() {
    return new SharpImageService();
  }

  getImageService() {
    return this.imageService;
  }

  createSequelizeDatabaseConnection() {
    if (!this.sequelizeDatabaseConnection) {
      this.sequelizeDatabaseConnection = new SequelizeDatabaseConnection(this.config.getDatabaseConfiguration().sequelize);
    }

    return this.sequelizeDatabaseConnection;
  }

  createMongooseDatabaseConnection() {
    if (!this.mongooseDatabaseConnection) {
      this.mongooseDatabaseConnection = new MongooseDatabaseConnection(this.config.getDatabaseConfiguration().mongoose);
    }

    return this.mongooseDatabaseConnection;
  }
}
