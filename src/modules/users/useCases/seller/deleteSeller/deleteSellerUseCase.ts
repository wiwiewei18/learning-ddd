import { AppError } from '../../../../../shared/core/AppError';
import { Either, left, right } from '../../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import { User } from '../../../domain/user/user';
import { UserRepo } from '../../../repos/userRepo/userRepo';
import { DeleteSellerErrors } from './deleteSellerErrors';
import { DeleteSellerRequestDTO } from './deleteSellerRequestDTO';

type Response = Either<
  DeleteSellerErrors.SellerDoesntExists | AppError.UnexpectedError | SuccessOrFailure<any>,
  SuccessOrFailure<void>
>;

export class DeleteSellerUseCase implements UseCase<DeleteSellerRequestDTO, Promise<Response>> {
  private userRepo: UserRepo;

  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  async execute(request: DeleteSellerRequestDTO): Promise<Response> {
    const searchedSellerBySellerId = await this.userRepo.getUserById(request.sellerId);
    if (searchedSellerBySellerId.isNotFound) {
      return left(new DeleteSellerErrors.SellerDoesntExists(request.sellerId));
    }

    const seller = searchedSellerBySellerId.getValue() as User;

    seller.delete();

    await this.userRepo.save(seller);

    return right(Result.ok<void>());
  }
}
