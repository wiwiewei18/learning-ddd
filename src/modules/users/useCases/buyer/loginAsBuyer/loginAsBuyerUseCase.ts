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
import { LoginAsBuyerErrors } from './loginAsBuyerErrors';
import { LoginAsBuyerRequestDTO } from './loginAsBuyerRequestDTO';
import { LoginAsBuyerResponseDTO } from './loginAsBuyerResponseDTO';

type Response = Either<
  LoginAsBuyerErrors.EmailNotVerified | LoginAsBuyerErrors.IncorrectEmailOrPassword | AppError.UnexpectedError,
  SuccessOrFailure<LoginAsBuyerResponseDTO>
>;

export class LoginAsBuyerUseCase implements UseCase<LoginAsBuyerRequestDTO, Promise<Response>> {
  private userRepo: UserRepo;
  private authService: AuthService;

  constructor(userRepo: UserRepo, authService: AuthService) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  async execute(request: LoginAsBuyerRequestDTO): Promise<Response> {
    const emailOrError = Email.create(request.email);
    const passwordOrError = Password.create({ value: request.password });

    const dtoResult = Result.combineSuccessOrFailureResults<any>([emailOrError, passwordOrError]);

    if (dtoResult.isFailure) {
      return left(new LoginAsBuyerErrors.IncorrectEmailOrPassword());
    }

    const email = emailOrError.getValue() as Email;

    const userRole = UserRole.create({ value: UserRoles.BUYER }).getValue() as UserRole;

    const searchedUserByEmail = await this.userRepo.getUserByEmail(userRole, email);

    if (searchedUserByEmail.isNotFound) {
      return left(new LoginAsBuyerErrors.IncorrectEmailOrPassword());
    }

    const buyer = searchedUserByEmail.getValue() as User;

    const isPasswordCorrect = await buyer.password.comparePassword(request.password);
    if (!isPasswordCorrect) {
      return left(new LoginAsBuyerErrors.IncorrectEmailOrPassword());
    }

    if (!buyer.isEmailVerified) {
      return left(new LoginAsBuyerErrors.EmailNotVerified());
    }

    const accessToken = this.authService.signJWT<JWTUserClaims>(
      {
        userId: buyer.userId.getStringValue(),
        email: buyer.email.value,
      },
      5,
    );

    const refreshToken = this.authService.generateRefreshToken();

    buyer.setAccessToken(accessToken, refreshToken);

    await this.authService.saveAuthenticatedUser(buyer);

    return right(
      Result.ok<LoginAsBuyerResponseDTO>({
        accessToken,
        refreshToken,
      }),
    );
  }
}
