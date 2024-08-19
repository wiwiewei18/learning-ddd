import { MockProxy, mock } from 'jest-mock-extended';
import { Result } from '../../../../../shared/core/Result';
import { SchedulingService } from '../../../../../shared/infra/scheduler/schedulingService';
import { createRandomUser } from '../../../domain/user/tests/fixtures/user.fixture';
import { UserRoles } from '../../../domain/user/userRoles';
import { UserRepo } from '../../../repos/userRepo/userRepo';
import { AuthService } from '../../../services/authService/authService';
import { RegisterAsBuyerErrors } from './RegisterAsBuyerErrors';
import { RegisterAsBuyerUseCase } from './RegisterAsBuyerUseCase';

let mockUserRepo: MockProxy<UserRepo>;
let mockAuthService: AuthService;
let mockSchedulingService: SchedulingService;

describe('Feature: Buyer Registration', () => {
  beforeEach(() => {
    mockUserRepo = mock<UserRepo>();
    mockUserRepo.getUserByEmail.mockResolvedValue(Result.notFound('e'));
    mockUserRepo.getUserByPhoneNumber.mockResolvedValue(Result.notFound('e'));

    mockAuthService = mock<AuthService>();
    mockSchedulingService = mock<SchedulingService>();
  });

  describe('Scenario: Guest success register using email', () => {
    describe('Given the Guest provides valid registration data', () => {
      describe('When the Guest attempts to register', () => {
        test('Then Buyer account should be created for the Guest And verification email should be sent to Buyer', async () => {
          const registerAsBuyerUseCase = new RegisterAsBuyerUseCase(mockUserRepo, mockAuthService, mockSchedulingService);

          const result = await registerAsBuyerUseCase.execute({
            email: 'test@test.com',
            firstName: 'john',
            lastName: 'doe',
            password: 'password1!',
            phoneNumber: '+6585553886',
            countryCode: 'SG',
          });

          expect(result.isRight()).toBe(true);
          expect(mockUserRepo.save).toHaveBeenCalled();
          expect(mockAuthService.generateEmailVerificationToken).toHaveBeenCalled();
          expect(mockSchedulingService.scheduleUnverifiedBuyerDeletion).toHaveBeenCalled();
        });
      });
    });
  });

  describe('Scenario: Guest fail to register as Buyer because of using taken email', () => {
    describe('Given the Guest provides taken Buyer email address', () => {
      describe('When the Guest attempts to register', () => {
        test(`Then the Buyer account shouldn't be created And should receive EmailAlreadyTaken error`, async () => {
          const existingBuyer = createRandomUser(UserRoles.BUYER);

          mockUserRepo.getUserByEmail.mockResolvedValue(Result.found(existingBuyer));

          const registerAsBuyerUseCase = new RegisterAsBuyerUseCase(mockUserRepo, mockAuthService, mockSchedulingService);

          const result = await registerAsBuyerUseCase.execute({
            email: existingBuyer.email.value,
            firstName: 'john',
            lastName: 'doe',
            password: 'password1!',
            phoneNumber: '+6585553886',
            countryCode: 'SG',
          });

          expect(result.isLeft()).toBe(true);
          expect(result.value.constructor).toEqual(RegisterAsBuyerErrors.EmailAlreadyTaken);
          expect(mockUserRepo.save).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('Scenario: Guest fail register as Buyer because of using taken phone number', () => {
    describe('Given the guest provides taken Buyer phone number', () => {
      describe('When the Guest attempts to register', () => {
        test(`Then the Buyer account shouldn't be created And should receive PhoneNumberAlreadyTaken error`, async () => {
          const existingBuyer = createRandomUser(UserRoles.BUYER);

          mockUserRepo.getUserByPhoneNumber.mockResolvedValue(Result.found(existingBuyer));

          const registerAsBuyerUseCase = new RegisterAsBuyerUseCase(mockUserRepo, mockAuthService, mockSchedulingService);

          const result = await registerAsBuyerUseCase.execute({
            email: existingBuyer.email.value,
            firstName: 'john',
            lastName: 'doe',
            password: 'password1!',
            phoneNumber: '+6585553886',
            countryCode: 'SG',
          });

          expect(result.isLeft()).toBe(true);
          expect(result.value.constructor).toEqual(RegisterAsBuyerErrors.PhoneNumberAlreadyTaken);
        });
      });
    });
  });

  describe('Scenario: Seller success to register using email', () => {
    describe('Given Seller provides available Buyer email', () => {
      describe('When Seller attempts to register as Buyer', () => {
        test('Then Seller account should be created for the Seller And verification email should be sent to Seller', async () => {
          const existingUser = createRandomUser(UserRoles.SELLER);

          const registerAsBuyerUseCase = new RegisterAsBuyerUseCase(mockUserRepo, mockAuthService, mockSchedulingService);

          const result = await registerAsBuyerUseCase.execute({
            email: existingUser.email.value,
            firstName: 'john',
            lastName: 'doe',
            password: 'password1!',
            phoneNumber: '+6585553886',
            countryCode: 'SG',
          });

          expect(result.isRight()).toBe(true);
          expect(mockUserRepo.save).toHaveBeenCalled();
          expect(mockAuthService.generateEmailVerificationToken).toHaveBeenCalled();
          expect(mockSchedulingService.scheduleUnverifiedBuyerDeletion).toHaveBeenCalled();
        });
      });
    });
  });
});
