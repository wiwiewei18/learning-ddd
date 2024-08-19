import { AppError } from '../../../../../shared/core/AppError';
import { Either, left, right } from '../../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import { Email } from '../../../../../shared/domain/valueObjects/email';
import { JWTUserClaims } from '../../../domain/user/jwt';
import { User } from '../../../domain/user/user';
import { UserRoles } from '../../../domain/user/userRoles';
import { Password } from '../../../domain/user/valueObjects/password';
import { UserRole } from '../../../domain/user/valueObjects/userRole';
import { UserRepo } from '../../../repos/userRepo/userRepo';
import { AuthService } from '../../../services/authService/authService';
import { LoginAsSellerErrors } from './loginAsSellerErrors';
import { LoginAsSellerRequestDTO } from './loginAsSellerRequestDTO';
import { LoginAsSellerResponseDTO } from './loginAsSellerResponseDTO';

type Response = Either<
  LoginAsSellerErrors.SellerEmailNotVerified | LoginAsSellerErrors.IncorrectEmailOrPassword | AppError.UnexpectedError,
  SuccessOrFailure<LoginAsSellerResponseDTO>
>;

export class LoginAsSellerUseCase implements UseCase<LoginAsSellerRequestDTO, Promise<Response>> {
  private userRepo: UserRepo;
  private authService: AuthService;

  constructor(userRepo: UserRepo, authService: AuthService) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  async execute(request: LoginAsSellerRequestDTO): Promise<Response> {
    const emailOrError = Email.create(request.email);
    const passwordOrError = Password.create({ value: request.password });

    const dtoResult = Result.combineSuccessOrFailureResults<any>([emailOrError, passwordOrError]);

    if (dtoResult.isFailure) {
      return left(Result.fail(dtoResult.getErrorValue()));
    }

    const email = emailOrError.getValue() as Email;

    const userRole = UserRole.create({ value: UserRoles.SELLER }).getValue() as UserRole;

    const searchedSellerByEmail = await this.userRepo.getUserByEmail(userRole, email);

    if (searchedSellerByEmail.isNotFound) {
      return left(new LoginAsSellerErrors.IncorrectEmailOrPassword());
    }

    const seller = searchedSellerByEmail.getValue() as User;

    const isPasswordCorrect = await seller.password.comparePassword(request.password);
    if (!isPasswordCorrect) {
      return left(new LoginAsSellerErrors.IncorrectEmailOrPassword());
    }

    if (!seller.isEmailVerified) {
      return left(new LoginAsSellerErrors.SellerEmailNotVerified());
    }

    const accessToken = this.authService.signJWT<JWTUserClaims>(
      {
        userId: seller.userId.getStringValue(),
        email: seller.email.value,
      },
      5,
    );

    const refreshToken = this.authService.generateRefreshToken();

    seller.setAccessToken(accessToken, refreshToken);

    await this.authService.saveAuthenticatedUser(seller);

    return right(
      Result.ok<LoginAsSellerResponseDTO>({
        accessToken,
        refreshToken,
      }),
    );
  }
}
