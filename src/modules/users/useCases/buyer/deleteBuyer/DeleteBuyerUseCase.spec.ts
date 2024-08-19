import { MockProxy, mock } from 'jest-mock-extended';
import { Result } from '../../../../../shared/core/Result';
import { createRandomUser } from '../../../domain/user/tests/fixtures/user.fixture';
import { UserRoles } from '../../../domain/user/userRoles';
import { UserRepo } from '../../../repos/userRepo/userRepo';
import { DeleteBuyerUseCase } from './DeleteBuyerUseCase';

let mockUserRepo: MockProxy<UserRepo>;

beforeEach(() => {
  mockUserRepo = mock<UserRepo>();
  mockUserRepo.getUserById.mockResolvedValue(Result.notFound('e'));
});

describe('Scenario: Guest fail to login after not verify the email in 30 minutes', () => {
  describe('Given the Guest success register And Email verification sent to registered email', () => {
    describe('When Guest not verify email by click verify email inside email in 30 minutes', () => {
      test(`Then Buyer account should be deleted And Buyer shouldn't be able to login`, async () => {
        const existingBuyer = createRandomUser(UserRoles.BUYER);

        mockUserRepo.getUserById.mockResolvedValue(Result.found(existingBuyer));

        const deleteBuyerUseCase = new DeleteBuyerUseCase(mockUserRepo);

        const result = await deleteBuyerUseCase.execute({ buyerId: existingBuyer.userId.getStringValue() });

        expect(result.isRight()).toBe(true);
        expect(existingBuyer.isDeleted).toBe(true);
        expect(mockUserRepo.save).toHaveBeenCalled();
      });
    });
  });
});
