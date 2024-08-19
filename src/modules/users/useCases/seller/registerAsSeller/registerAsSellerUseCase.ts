import { Either, left, right } from '../../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import { Email } from '../../../../../shared/domain/valueObjects/email';
import { SchedulingService } from '../../../../../shared/infra/scheduler/schedulingService';
import { Store } from '../../../domain/store/store';
import { User } from '../../../domain/user/user';
import { UserRoles } from '../../../domain/user/userRoles';
import { FullName } from '../../../domain/user/valueObjects/fullName';
import { Password } from '../../../domain/user/valueObjects/password';
import { PhoneNumber } from '../../../domain/user/valueObjects/phoneNumber';
import { UserRole } from '../../../domain/user/valueObjects/userRole';
import { StoreRepo } from '../../../repos/storeRepo/storeRepo';
import { UserRepo } from '../../../repos/userRepo/userRepo';
import { AuthService } from '../../../services/authService/authService';
import { RegisterAsSellerErrors } from './registerAsSellerErrors';
import { RegisterAsSellerRequestDTO } from './registerAsSellerRequestDTO';

type Response = Either<
  | RegisterAsSellerErrors.EmailAlreadyTaken
  | RegisterAsSellerErrors.PhoneNumberAlreadyTaken
  | RegisterAsSellerErrors.StoreNameAlreadyTaken
  | SuccessOrFailure<any>,
  SuccessOrFailure<void>
>;

export class RegisterAsSellerUseCase implements UseCase<RegisterAsSellerRequestDTO, Promise<Response>> {
  private userRepo: UserRepo;
  private authService: AuthService;
  private schedulingService: SchedulingService;
  private storeRepo: StoreRepo;

  constructor(userRepo: UserRepo, storeRepo: StoreRepo, authService: AuthService, schedulingService: SchedulingService) {
    this.userRepo = userRepo;
    this.storeRepo = storeRepo;
    this.authService = authService;
    this.schedulingService = schedulingService;
  }

  async execute(request: RegisterAsSellerRequestDTO): Promise<Response> {
    const emailOrError = Email.create(request.email);
    const phoneNumberOrError = PhoneNumber.create({ value: request.phoneNumber, countryCode: request.countryCode });
    const fullNameOrError = FullName.create({ firstName: request.firstName, lastName: request.lastName });
    const passwordOrError = Password.create({ value: request.password });

    const dtoResult = Result.combineSuccessOrFailureResults<any>([
      emailOrError,
      phoneNumberOrError,
      fullNameOrError,
      passwordOrError,
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail(dtoResult.getErrorValue()));
    }

    const userRole = UserRole.create({ value: UserRoles.SELLER }).getValue() as UserRole;

    const email = emailOrError.getValue() as Email;
    const searchedSellerByEmail = await this.userRepo.getUserByEmail(userRole, email);
    if (searchedSellerByEmail.isFound) {
      return left(new RegisterAsSellerErrors.EmailAlreadyTaken(email.value));
    }

    const phoneNumber = phoneNumberOrError.getValue() as PhoneNumber;
    const searchedSellerByPhone = await this.userRepo.getUserByPhoneNumber(userRole, phoneNumber);
    if (searchedSellerByPhone.isFound) {
      return left(new RegisterAsSellerErrors.PhoneNumberAlreadyTaken(phoneNumber.value));
    }

    const fullName = fullNameOrError.getValue() as FullName;
    const password = passwordOrError.getValue() as Password;

    const emailVerificationToken = this.authService.generateEmailVerificationToken(email);

    const sellerOrError = User.create({ email, fullName, password, phoneNumber, emailVerificationToken, role: userRole });

    if (sellerOrError.isFailure) {
      return left(Result.fail<User>(sellerOrError.getErrorValue()));
    }

    const seller = sellerOrError.getValue() as User;

    const searchedStoreByName = await this.storeRepo.getStoreByName(request.storeName);
    if (searchedStoreByName.isFound) {
      return left(new RegisterAsSellerErrors.StoreNameAlreadyTaken());
    }

    const storeOrError = Store.create({
      addressDetail: request.addressDetail,
      countryCode: request.countryCode,
      description: request.storeDescription,
      name: request.storeName,
      postalCode: request.storePostalCode,
      userId: seller.userId,
    });

    if (storeOrError.isFailure) {
      return left(Result.fail<Store>(storeOrError.getErrorValue()));
    }

    const store = storeOrError.getValue() as Store;

    await this.userRepo.save(seller);
    await this.storeRepo.save(store);

    await this.authService.saveEmailVerificationToken(emailVerificationToken, email);
    await this.schedulingService.scheduleUnverifiedSellerDeletion(seller.userId.getStringValue());

    return right(Result.ok<void>());
  }
}
