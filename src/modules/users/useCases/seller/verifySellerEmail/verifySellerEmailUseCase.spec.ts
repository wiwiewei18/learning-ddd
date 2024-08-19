import { MockProxy, mock } from 'jest-mock-extended';
import { Result } from '../../../../../shared/core/Result';
import { SchedulingService } from '../../../../../shared/infra/scheduler/schedulingService';
import { JWTEmailVerificationClaims } from '../../../domain/user/jwt';
import { createRandomUser } from '../../../domain/user/tests/fixtures/user.fixture';
import { UserRoles } from '../../../domain/user/userRoles';
import { UserRepo } from '../../../repos/userRepo/userRepo';
import { AuthService } from '../../../services/authService/authService';
import { VerifySellerEmailErrors } from './verifySellerEmailErrors';
import { VerifySellerEmailUseCase } from './verifySellerEmailUseCase';

let mockUserRepo: MockProxy<UserRepo>;
let mockAuthService: MockProxy<AuthService>;
let mockSchedulingService: MockProxy<SchedulingService>;

describe('Feature: Verify Email Seller', () => {
  beforeEach(() => {
    mockUserRepo = mock<UserRepo>();

    mockAuthService = mock<AuthService>();
    mockSchedulingService = mock<SchedulingService>();
  });

  describe('Scenario: Guest success verifies as Seller using email verification', () => {
    describe('Given Verification Email with valid token', () => {
      describe('When Guest attempt to verify as Seller using email', () => {
        test('Then Guest email should be verified as Seller', async () => {
          mockAuthService.validateJWTString.mockResolvedValue(true);
          mockAuthService.validateJWTExpiry.mockResolvedValue(true);

          const stubDecodedJWT: JWTEmailVerificationClaims = { email: 'test@test.com' };
          mockAuthService.decodeJWT.mockResolvedValue(stubDecodedJWT);

          const stubSeller = createRandomUser(UserRoles.SELLER);
          mockUserRepo.getUserByEmail.mockResolvedValue(Result.found(stubSeller));

          const verifySellerEmailUseCase = new VerifySellerEmailUseCase(
            mockAuthService,
            mockUserRepo,
            mockSchedulingService,
          );

          const result = await verifySellerEmailUseCase.execute({ emailVerificationToken: '123' });

          expect(mockSchedulingService.cancelSellerDeletionSchedule).toHaveBeenCalled();
          expect(result.isRight()).toBe(true);
        });
      });
    });
  });

  describe('Scenario: Guest fail to verifies their email using expired token', () => {
    describe('Given Verification email with expired token', () => {
      describe('When Guest attempt to verify as Seller using email', () => {
        test(`Then Guest email shouldn't be verified`, async () => {
          mockAuthService.validateJWTString.mockResolvedValue(true);
          mockAuthService.validateJWTExpiry.mockResolvedValue(false);

          const verifySellerEmailUseCase = new VerifySellerEmailUseCase(
            mockAuthService,
            mockUserRepo,
            mockSchedulingService,
          );

          const result = await verifySellerEmailUseCase.execute({ emailVerificationToken: '123' });

          expect(result.isLeft()).toBe(true);
          expect(result.value.constructor).toEqual(VerifySellerEmailErrors.TokenAlreadyExpired);
        });
      });
    });
  });
});
