import { MockProxy, mock } from 'jest-mock-extended';
import { Result } from '../../../../../shared/core/Result';
import { createRandomUser } from '../../../domain/user/tests/fixtures/user.fixture';
import { UserRoles } from '../../../domain/user/userRoles';
import { UserRepo } from '../../../repos/userRepo/userRepo';
import { AuthService } from '../../../services/authService/authService';
import { LoginAsBuyerErrors } from './loginAsBuyerErrors';
import { LoginAsBuyerUseCase } from './loginAsBuyerUseCase';

let mockUserRepo: MockProxy<UserRepo>;
let mockAuthService: MockProxy<AuthService>;

describe('Login as Buyer', () => {
  beforeEach(() => {
    mockUserRepo = mock<UserRepo>();
    mockAuthService = mock<AuthService>();
  });

  describe('Scenario: Guest success login with verified email', () => {
    describe('Given Email already verified as buyer', () => {
      describe('When Guest attempt to login with valid details', () => {
        test('Then Guest should able to login as Buyer', async () => {
          const loginAsBuyerUseCase = new LoginAsBuyerUseCase(mockUserRepo, mockAuthService);

          const registeredBuyer = createRandomUser(UserRoles.BUYER);
          registeredBuyer.verifyEmail();

          mockUserRepo.getUserByEmail.mockResolvedValue(Result.found(registeredBuyer));

          const result = await loginAsBuyerUseCase.execute({
            email: registeredBuyer.email.value,
            password: registeredBuyer.password.value,
          });

          expect(result.isRight()).toBe(true);
          expect(mockAuthService.signJWT).toHaveBeenCalled();
          expect(mockAuthService.generateRefreshToken).toHaveBeenCalled();
          expect(mockAuthService.saveAuthenticatedUser).toHaveBeenCalledWith(registeredBuyer);
        });
      });
    });
  });

  describe('Scenario: Guest fail to login with unverified email', () => {
    describe('Given Unverified buyer email', () => {
      describe('When Guest attempt to login with valid details', () => {
        test('Then Guest should not able to login as Buyer And Guest should receive EmailNotVerified error', async () => {
          const loginAsBuyerUseCase = new LoginAsBuyerUseCase(mockUserRepo, mockAuthService);

          const registeredBuyer = createRandomUser(UserRoles.BUYER);

          mockUserRepo.getUserByEmail.mockResolvedValue(Result.found(registeredBuyer));

          const result = await loginAsBuyerUseCase.execute({
            email: registeredBuyer.email.value,
            password: registeredBuyer.password.value,
          });

          expect(result.isLeft()).toBe(true);
          expect(result.value.constructor).toEqual(LoginAsBuyerErrors.EmailNotVerified);
        });
      });
    });
  });

  describe('Scenario: Guest fail to login with invalid credentials', () => {
    describe('Given Invalid email', () => {
      describe('When Guest attempt to login', () => {
        test('Then Guest should not able to login as Buyer And Guest should receive IncorrectEmailOrPassword error', async () => {
          const loginAsBuyerUseCase = new LoginAsBuyerUseCase(mockUserRepo, mockAuthService);

          mockUserRepo.getUserByEmail.mockResolvedValue(Result.notFound('e'));

          const result = await loginAsBuyerUseCase.execute({ email: 'test@test.com', password: 'password1!' });

          expect(result.isLeft()).toBe(true);
          expect(result.value.constructor).toEqual(LoginAsBuyerErrors.IncorrectEmailOrPassword);
        });
      });
    });

    describe('Given Invalid password', () => {
      describe('When Guest attempt to login', () => {
        test('Then Guest should not able to login as Buyer And Guest should receive IncorrectEmailOrPassword error', async () => {
          const registeredBuyer = createRandomUser(UserRoles.BUYER);
          registeredBuyer.verifyEmail();

          mockUserRepo.getUserByEmail.mockResolvedValue(Result.found(registeredBuyer));

          const loginAsBuyerUseCase = new LoginAsBuyerUseCase(mockUserRepo, mockAuthService);

          const result = await loginAsBuyerUseCase.execute({ email: 'test@test.com', password: 'invalidPassword' });

          expect(result.isLeft()).toBe(true);
          expect(result.value.constructor).toEqual(LoginAsBuyerErrors.IncorrectEmailOrPassword);
        });
      });
    });
  });
});
