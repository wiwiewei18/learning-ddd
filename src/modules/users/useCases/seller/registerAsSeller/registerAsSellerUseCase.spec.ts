import { MockProxy, mock } from 'jest-mock-extended';
import { Result } from '../../../../../shared/core/Result';
import { SchedulingService } from '../../../../../shared/infra/scheduler/schedulingService';
import { StoreRepo } from '../../../repos/storeRepo/storeRepo';
import { UserRepo } from '../../../repos/userRepo/userRepo';
import { AuthService } from '../../../services/authService/authService';
import { RegisterAsSellerUseCase } from './registerAsSellerUseCase';

let mockUserRepo: MockProxy<UserRepo>;
let mockAuthService: AuthService;
let mockSchedulingService: SchedulingService;
let mockStoreRepo: MockProxy<StoreRepo>;

describe('Register as Seller', () => {
  beforeEach(() => {
    mockUserRepo = mock<UserRepo>();
    mockUserRepo.getUserByEmail.mockResolvedValue(Result.notFound('e'));
    mockUserRepo.getUserByPhoneNumber.mockResolvedValue(Result.notFound('e'));

    mockStoreRepo = mock<StoreRepo>();
    mockStoreRepo.getStoreByName.mockResolvedValue(Result.notFound('e'));

    mockAuthService = mock<AuthService>();
    mockSchedulingService = mock<SchedulingService>();
  });

  describe('Scenario: Guest success register using available email', () => {
    describe('Given Guest provides valid registration data', () => {
      describe('When Guest attempt to register', () => {
        test('Then Seller account should be created for the Guest And verification email should be sent to Seller And Store should be created', async () => {
          const registerAsSellerUseCase = new RegisterAsSellerUseCase(
            mockUserRepo,
            mockStoreRepo,
            mockAuthService,
            mockSchedulingService,
          );

          const result = await registerAsSellerUseCase.execute({
            countryCode: 'SG',
            email: 'test@test.com',
            firstName: 'john',
            lastName: 'doe',
            password: 'password1!',
            phoneNumber: '+6585553886',
            addressDetail: 'apartment a no. 12',
            storeDescription: 'we sell gadgets',
            storeName: 'john doe store',
            storePostalCode: '513241',
          });

          expect(result.isRight()).toBe(true);
          expect(mockUserRepo.save).toHaveBeenCalled();
          expect(mockStoreRepo.save).toHaveBeenCalled();
          expect(mockAuthService.generateEmailVerificationToken).toHaveBeenCalled();
          expect(mockSchedulingService.scheduleUnverifiedSellerDeletion).toHaveBeenCalled();
        });
      });
    });
  });
});
