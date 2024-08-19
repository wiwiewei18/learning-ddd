import { AppError } from '../../../../../shared/core/AppError';
import { Either, left, right } from '../../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import { Email } from '../../../../../shared/domain/valueObjects/email';
import { SchedulingService } from '../../../../../shared/infra/scheduler/schedulingService';
import { User } from '../../../domain/user/user';
import { UserRoles } from '../../../domain/user/userRoles';
import { FullName } from '../../../domain/user/valueObjects/fullName';
import { Password } from '../../../domain/user/valueObjects/password';
import { PhoneNumber } from '../../../domain/user/valueObjects/phoneNumber';
import { UserRole } from '../../../domain/user/valueObjects/userRole';
import { UserRepo } from '../../../repos/userRepo/userRepo';
import { AuthService } from '../../../services/authService/authService';
import { RegisterAsBuyerErrors } from './RegisterAsBuyerErrors';
import { RegisterAsBuyerRequestDTO } from './RegisterAsBuyerRequestDTO';

export type Response = Either<
  | RegisterAsBuyerErrors.EmailAlreadyTaken
  | RegisterAsBuyerErrors.PhoneNumberAlreadyTaken
  | AppError.UnexpectedError
  | SuccessOrFailure<any>,
  SuccessOrFailure<void>
>;

export class RegisterAsBuyerUseCase implements UseCase<RegisterAsBuyerRequestDTO, Promise<Response>> {
  private userRepo: UserRepo;
  private authService: AuthService;
  private schedulingService: SchedulingService;

  constructor(userRepo: UserRepo, authService: AuthService, schedulingService: SchedulingService) {
    this.userRepo = userRepo;
    this.authService = authService;
    this.schedulingService = schedulingService;
  }

  async execute(request: RegisterAsBuyerRequestDTO): Promise<Response> {
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

    const email = emailOrError.getValue() as Email;
    const userRole = UserRole.create({ value: UserRoles.BUYER }).getValue() as UserRole;
    const searchedBuyerByEmail = await this.userRepo.getUserByEmail(userRole, email);
    if (searchedBuyerByEmail.isFound) {
      return left(new RegisterAsBuyerErrors.EmailAlreadyTaken(email.value));
    }

    const phoneNumber = phoneNumberOrError.getValue() as PhoneNumber;
    const searchedBuyerByPhone = await this.userRepo.getUserByPhoneNumber(userRole, phoneNumber);
    if (searchedBuyerByPhone.isFound) {
      return left(new RegisterAsBuyerErrors.PhoneNumberAlreadyTaken(phoneNumber.value));
    }

    const fullName = fullNameOrError.getValue() as FullName;
    const password = passwordOrError.getValue() as Password;

    const emailVerificationToken = this.authService.generateEmailVerificationToken(email);

    const role = UserRole.create({ value: UserRoles.BUYER }).getValue() as UserRole;

    const userOrError = User.create({ email, fullName, password, phoneNumber, emailVerificationToken, role });

    if (userOrError.isFailure) {
      return left(Result.fail<User>(userOrError.getErrorValue()));
    }

    const user = userOrError.getValue() as User;

    await this.userRepo.save(user);
    await this.authService.saveEmailVerificationToken(emailVerificationToken, email);
    await this.schedulingService.scheduleUnverifiedBuyerDeletion(user.userId.getStringValue());

    return right(Result.ok<void>());
  }
}
