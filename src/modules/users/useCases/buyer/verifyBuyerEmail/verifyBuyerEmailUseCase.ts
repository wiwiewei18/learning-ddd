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
import { VerifyBuyerEmailErrors } from './verifyBuyerEmailErrors';
import { VerifyBuyerEmailRequestDTO } from './verifyBuyerEmailRequestDTO';

type Response = Either<
  | VerifyBuyerEmailErrors.InvalidToken
  | VerifyBuyerEmailErrors.TokenAlreadyExpired
  | AppError.UnexpectedError
  | SuccessOrFailure<any>,
  SuccessOrFailure<void>
>;

export class VerifyBuyerEmailUseCase implements UseCase<VerifyBuyerEmailRequestDTO, Promise<Response>> {
  private authService: AuthService;
  private userRepo: UserRepo;
  private schedulingService: SchedulingService;

  constructor(authService: AuthService, userRepo: UserRepo, schedulingService: SchedulingService) {
    this.authService = authService;
    this.userRepo = userRepo;
    this.schedulingService = schedulingService;
  }

  async execute(request: VerifyBuyerEmailRequestDTO): Promise<Response> {
    const isEmailTokenValid = await this.authService.validateJWTString(request.emailVerificationToken);

    if (!isEmailTokenValid) {
      return left(new VerifyBuyerEmailErrors.InvalidToken());
    }

    const isEmailTokenExpired = await this.authService.validateJWTExpiry(request.emailVerificationToken);

    if (!isEmailTokenExpired) {
      return left(new VerifyBuyerEmailErrors.TokenAlreadyExpired());
    }

    const decoded = await this.authService.decodeJWT<JWTEmailVerificationClaims>(request.emailVerificationToken);

    const emailOrError = Email.create(decoded.email);
    if (emailOrError.isFailure) {
      return left(Result.fail(emailOrError.getErrorValue()));
    }

    const email = emailOrError.getValue() as Email;

    const userRole = UserRole.create({ value: UserRoles.BUYER }).getValue() as UserRole;

    const searchedBuyer = await this.userRepo.getUserByEmail(userRole, email);

    if (searchedBuyer.isNotFound) {
      return left(Result.fail(searchedBuyer.getErrorValue()));
    }

    const user = searchedBuyer.getValue() as User;

    user.verifyEmail();

    await this.userRepo.save(user);

    await this.schedulingService.cancelBuyerDeletionSchedule(user.userId.getStringValue());

    return right(Result.ok<void>());
  }
}
