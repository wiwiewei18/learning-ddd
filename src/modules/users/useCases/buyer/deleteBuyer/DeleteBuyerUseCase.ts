import { AppError } from '../../../../../shared/core/AppError';
import { Either, left, right } from '../../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import { User } from '../../../domain/user/user';
import { UserRepo } from '../../../repos/userRepo/userRepo';
import { DeleteBuyerErrors } from './DeleteBuyerErrors';
import { DeleteBuyerRequestDTO } from './DeleteBuyerRequestDTO';

type Response = Either<
  DeleteBuyerErrors.BuyerDoesntExists | AppError.UnexpectedError | SuccessOrFailure<any>,
  SuccessOrFailure<void>
>;

export class DeleteBuyerUseCase implements UseCase<DeleteBuyerRequestDTO, Promise<Response>> {
  private userRepo: UserRepo;

  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  async execute(request: DeleteBuyerRequestDTO): Promise<Response> {
    const searchedBuyerByBuyerId = await this.userRepo.getUserById(request.buyerId);
    if (searchedBuyerByBuyerId.isNotFound) {
      return left(new DeleteBuyerErrors.BuyerDoesntExists(request.buyerId));
    }

    const buyer = searchedBuyerByBuyerId.getValue() as User;

    buyer.delete();

    await this.userRepo.save(buyer);

    return right(Result.ok<void>());
  }
}
