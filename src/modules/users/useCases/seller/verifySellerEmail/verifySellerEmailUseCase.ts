import { AppError } from '../../../../../shared/core/AppError';
import { Either, left, right } from '../../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import { Email } from '../../../../../shared/domain/valueObjects/email';
import { SchedulingService } from '../../../../../shared/infra/scheduler/schedulingService';
import { JWTEmailVerificationClaims } from '../../../domain/user/jwt';
import { User } from '../../../domain/user/user';
import { UserRoles } from '../../../domain/user/userRoles';
import { UserRole } from '../../../domain/user/valueObjects/userRole';
import { UserRepo } from '../../../repos/userRepo/userRepo';
import { AuthService } from '../../../services/authService/authService';
import { VerifySellerEmailErrors } from './verifySellerEmailErrors';
import { VerifySellerEmailRequestDTO } from './verifySellerEmailRequestDTO';

type Response = Either<
  | VerifySellerEmailErrors.InvalidToken
  | VerifySellerEmailErrors.TokenAlreadyExpired
  | AppError.UnexpectedError
  | SuccessOrFailure<any>,
  SuccessOrFailure<void>
>;

export class VerifySellerEmailUseCase implements UseCase<VerifySellerEmailRequestDTO, Promise<Response>> {
  private authService: AuthService;
  private userRepo: UserRepo;
  private schedulingService: SchedulingService;

  constructor(authService: AuthService, userRepo: UserRepo, schedulingService: SchedulingService) {
    this.authService = authService;
    this.userRepo = userRepo;
    this.schedulingService = schedulingService;
  }

  async execute(request: VerifySellerEmailRequestDTO): Promise<Response> {
    const isEmailTokenValid = await this.authService.validateJWTString(request.emailVerificationToken);

    if (!isEmailTokenValid) {
      return left(new VerifySellerEmailErrors.InvalidToken());
    }

    const isEmailTokenExpired = await this.authService.validateJWTExpiry(request.emailVerificationToken);

    if (!isEmailTokenExpired) {
      return left(new VerifySellerEmailErrors.TokenAlreadyExpired());
    }

    const decoded = await this.authService.decodeJWT<JWTEmailVerificationClaims>(request.emailVerificationToken);

    const emailOrError = Email.create(decoded.email);
    if (emailOrError.isFailure) {
      return left(Result.fail(emailOrError.getErrorValue()));
    }

    const email = emailOrError.getValue() as Email;

    const userRole = UserRole.create({ value: UserRoles.SELLER }).getValue() as UserRole;

    const searchedSeller = await this.userRepo.getUserByEmail(userRole, email);

    if (searchedSeller.isNotFound) {
      return left(Result.fail(searchedSeller.getErrorValue()));
    }

    const seller = searchedSeller.getValue() as User;

    seller.verifyEmail();

    await this.userRepo.save(seller);

    await this.schedulingService.cancelSellerDeletionSchedule(seller.userId.getStringValue());

    return right(Result.ok<void>());
  }
}
