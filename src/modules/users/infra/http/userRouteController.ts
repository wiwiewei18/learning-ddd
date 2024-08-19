import { Middleware } from '../../../../shared/infra/http/utils/Middleware';
import { SchedulingService } from '../../../../shared/infra/scheduler/schedulingService';
import { StoreRepo } from '../../repos/storeRepo/storeRepo';
import { UserRepo } from '../../repos/userRepo/userRepo';
import { AuthService } from '../../services/authService/authService';
import { LoginAsBuyerController } from '../../useCases/buyer/loginAsBuyer/loginAsBuyerController';
import { LoginAsBuyerUseCase } from '../../useCases/buyer/loginAsBuyer/loginAsBuyerUseCase';
import { RegisterAsBuyerController } from '../../useCases/buyer/registerAsBuyer/RegisterAsBuyerController';
import { RegisterAsBuyerUseCase } from '../../useCases/buyer/registerAsBuyer/RegisterAsBuyerUseCase';
import { VerifyBuyerEmailController } from '../../useCases/buyer/verifyBuyerEmail/verifyBuyerEmailController';
import { VerifyBuyerEmailUseCase } from '../../useCases/buyer/verifyBuyerEmail/verifyBuyerEmailUseCase';
import { LoginAsSellerController } from '../../useCases/seller/loginAsSeller/loginAsSellerController';
import { LoginAsSellerUseCase } from '../../useCases/seller/loginAsSeller/loginAsSellerUseCase';
import { RegisterAsSellerController } from '../../useCases/seller/registerAsSeller/registerAsSellerController';
import { RegisterAsSellerUseCase } from '../../useCases/seller/registerAsSeller/registerAsSellerUseCase';
import { VerifySellerEmailController } from '../../useCases/seller/verifySellerEmail/verifySellerEmailController';
import { VerifySellerEmailUseCase } from '../../useCases/seller/verifySellerEmail/verifySellerEmailUseCase';

export class UserRouteController {
  private userRepo: UserRepo;
  private storeRepo: StoreRepo;
  private authService: AuthService;
  private schedulingService: SchedulingService;
  private middleware: Middleware;

  constructor(
    userRepo: UserRepo,
    storeRepo: StoreRepo,
    authService: AuthService,
    schedulingService: SchedulingService,
    middleware: Middleware,
  ) {
    this.userRepo = userRepo;
    this.storeRepo = storeRepo;
    this.authService = authService;
    this.schedulingService = schedulingService;
    this.middleware = middleware;
  }

  getControllers() {
    return [
      this.createRegisterAsBuyerController(),
      this.createVerifyBuyerEmailController(),
      this.createLoginAsBuyerController(),
      this.createRegisterAsSellerController(),
      this.createVerifySellerEmailController(),
      this.createLoginAsSellerController(),
    ];
  }

  private createRegisterAsBuyerController() {
    return new RegisterAsBuyerController(this.createRegisterAsBuyerUseCase());
  }

  private createRegisterAsBuyerUseCase() {
    return new RegisterAsBuyerUseCase(this.userRepo, this.authService, this.schedulingService);
  }

  private createVerifyBuyerEmailUseCase() {
    return new VerifyBuyerEmailUseCase(this.authService, this.userRepo, this.schedulingService);
  }

  private createVerifyBuyerEmailController() {
    return new VerifyBuyerEmailController(this.createVerifyBuyerEmailUseCase());
  }

  private createLoginAsBuyerUseCase() {
    return new LoginAsBuyerUseCase(this.userRepo, this.authService);
  }

  private createLoginAsBuyerController() {
    return new LoginAsBuyerController(this.createLoginAsBuyerUseCase(), [this.middleware.ensureCaptchaValidated()]);
  }

  private createRegisterAsSellerUseCase() {
    return new RegisterAsSellerUseCase(this.userRepo, this.storeRepo, this.authService, this.schedulingService);
  }

  private createRegisterAsSellerController() {
    return new RegisterAsSellerController(this.createRegisterAsSellerUseCase());
  }

  private createVerifySellerEmailUseCase() {
    return new VerifySellerEmailUseCase(this.authService, this.userRepo, this.schedulingService);
  }

  private createVerifySellerEmailController() {
    return new VerifySellerEmailController(this.createVerifySellerEmailUseCase());
  }

  private createLoginAsSellerUseCase() {
    return new LoginAsSellerUseCase(this.userRepo, this.authService);
  }

  private createLoginAsSellerController() {
    return new LoginAsSellerController(this.createLoginAsSellerUseCase(), [this.middleware.ensureCaptchaValidated()]);
  }
}
