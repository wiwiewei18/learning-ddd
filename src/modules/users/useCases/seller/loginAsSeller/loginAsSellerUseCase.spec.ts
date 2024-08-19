import { MockProxy, mock } from 'jest-mock-extended';
import { Result } from '../../../../../shared/core/Result';
import { createRandomUser } from '../../../domain/user/tests/fixtures/user.fixture';
import { UserRoles } from '../../../domain/user/userRoles';
import { UserRepo } from '../../../repos/userRepo/userRepo';
import { AuthService } from '../../../services/authService/authService';
import { LoginAsSellerErrors } from './loginAsSellerErrors';
import { LoginAsSellerUseCase } from './loginAsSellerUseCase';

let mockUserRepo: MockProxy<UserRepo>;
let mockAuthService: MockProxy<AuthService>;

describe('Feature: Seller Login', () => {
  beforeEach(() => {
    mockUserRepo = mock<UserRepo>();
    mockAuthService = mock<AuthService>();
  });

  describe('Scenario: Seller success login to SmartApes after verifying their account', () => {
    describe('Given Seller has successfully completed the email verification process', () => {
      describe('When Seller enters correct email and password on the login page', () => {
        test('Then system will process the login request', async () => {
          const loginAsSellerUseCase = new LoginAsSellerUseCase(mockUserRepo, mockAuthService);

          const registeredSeller = createRandomUser(UserRoles.SELLER);
          registeredSeller.verifyEmail();

          mockUserRepo.getUserByEmail.mockResolvedValue(Result.found(registeredSeller));

          const result = await loginAsSellerUseCase.execute({
            email: registeredSeller.email.value,
            password: registeredSeller.password.value,
          });

          expect(result.isRight()).toBe(true);
          expect(mockAuthService.signJWT).toHaveBeenCalled();
          expect(mockAuthService.generateRefreshToken).toHaveBeenCalled();
          expect(mockAuthService.saveAuthenticatedUser).toHaveBeenCalledWith(registeredSeller);
        });
      });
    });
  });

  describe('Scenario: Seller failed login to SmartApes with incorrect credentials after verifying their account', () => {
    describe('Given Seller has successfully completed the email verification process', () => {
      describe('When Seller attempt to login with an incorrect email and password', () => {
        test('Then Seller should not be able to login', async () => {
          const loginAsSellerUseCase = new LoginAsSellerUseCase(mockUserRepo, mockAuthService);

          mockUserRepo.getUserByEmail.mockResolvedValue(Result.notFound('e'));

          const result = await loginAsSellerUseCase.execute({ email: 'test@test.com', password: 'password1!' });

          expect(result.isLeft()).toBe(true);
          expect(result.value.constructor).toEqual(LoginAsSellerErrors.IncorrectEmailOrPassword);
        });
      });
    });
  });

  describe('Scenario: Seller failed login to SmartApes without verifying their email', () => {
    describe('Given Seller not verify their email', () => {
      describe('When Seller attempt to login with correct email and password', () => {
        test('Then Seller should not be able to login', async () => {
          const loginAsSellerUseCase = new LoginAsSellerUseCase(mockUserRepo, mockAuthService);

          const registeredSeller = createRandomUser(UserRoles.SELLER);

          mockUserRepo.getUserByEmail.mockResolvedValue(Result.found(registeredSeller));

          const result = await loginAsSellerUseCase.execute({
            email: registeredSeller.email.value,
            password: registeredSeller.password.value,
          });

          expect(result.isLeft()).toBe(true);
          expect(result.value.constructor).toEqual(LoginAsSellerErrors.SellerEmailNotVerified);
        });
      });
    });
  });
});
