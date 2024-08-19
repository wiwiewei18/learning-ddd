import { Either, left, right } from '../../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import { User } from '../../../../users/domain/user/user';
import { UserRepo } from '../../../../users/repos/userRepo/userRepo';
import { Buyer } from '../../../domain/buyer/buyer';
import { BuyerRepo } from '../../../repos/buyer/buyerRepo';
import { CreateBuyerErrors } from './createBuyerErrors';
import { CreateBuyerRequestDTO } from './createBuyerRequestDTO';

type Response = Either<
  CreateBuyerErrors.BuyerAlreadyExists | CreateBuyerErrors.UserDoesntExists | SuccessOrFailure<Buyer>,
  SuccessOrFailure<void>
>;

export class CreateBuyerUseCase implements UseCase<CreateBuyerRequestDTO, Promise<Response>> {
  private userRepo: UserRepo;
  private buyerRepo: BuyerRepo;

  constructor(userRepo: UserRepo, buyerRepo: BuyerRepo) {
    this.userRepo = userRepo;
    this.buyerRepo = buyerRepo;
  }

  async execute(request: CreateBuyerRequestDTO): Promise<Response> {
    const searchedBaseUser = await this.userRepo.getUserById(request.userId);

    if (searchedBaseUser.isNotFound) {
      return left(new CreateBuyerErrors.UserDoesntExists(request.userId));
    }

    const baseUser = searchedBaseUser.getValue() as User;

    const searchedBuyer = await this.buyerRepo.getBuyerByBaseUserId(request.userId);

    if (searchedBuyer.isFound) {
      return left(new CreateBuyerErrors.BuyerAlreadyExists(request.userId));
    }

    const buyerOrError = Buyer.create({
      baseUserId: baseUser.userId,
      email: baseUser.email,
    });

    if (buyerOrError.isFailure) {
      return left(buyerOrError);
    }

    const buyer = buyerOrError.getValue() as Buyer;

    await this.buyerRepo.save(buyer);

    return right(Result.ok<void>());
  }
}
