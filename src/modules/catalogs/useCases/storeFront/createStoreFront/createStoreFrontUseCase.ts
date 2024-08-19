import { AppError } from '../../../../../shared/core/AppError';
import { Either, left, right } from '../../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import { Store } from '../../../../users/domain/store/store';
import { StoreRepo } from '../../../../users/repos/storeRepo/storeRepo';
import { StoreFront } from '../../../domain/storeFront/storeFront';
import { StoreFrontRepo } from '../../../repos/storeFront/storeFrontRepo';
import { CreateStoreFrontErrors } from './createStoreFrontErrors';
import { CreateStoreFrontRequestDTO } from './createStoreFrontRequestDTO';

type Response = Either<
  | CreateStoreFrontErrors.StoreDoesntExists
  | CreateStoreFrontErrors.StoreFrontAlreadyExists
  | AppError.UnexpectedError
  | SuccessOrFailure<any>,
  SuccessOrFailure<void>
>;

export class CreateStoreFrontUseCase implements UseCase<CreateStoreFrontRequestDTO, Promise<Response>> {
  private storeRepo: StoreRepo;
  private storeFrontRepo: StoreFrontRepo;

  constructor(storeRepo: StoreRepo, storeFrontRepo: StoreFrontRepo) {
    this.storeRepo = storeRepo;
    this.storeFrontRepo = storeFrontRepo;
  }

  async execute(request: CreateStoreFrontRequestDTO): Promise<Response> {
    const searchedBaseStore = await this.storeRepo.getStoreByStoreId(request.storeId);

    if (searchedBaseStore.isNotFound) {
      return left(new CreateStoreFrontErrors.StoreDoesntExists(request.storeId));
    }

    const baseStore = searchedBaseStore.getValue() as Store;

    const searchedStoreFront = await this.storeFrontRepo.getStoreFrontByName(baseStore.name);

    if (searchedStoreFront.isFound) {
      return left(new CreateStoreFrontErrors.StoreFrontAlreadyExists(baseStore.name));
    }

    const storeFrontOrError = StoreFront.create({
      name: baseStore.name,
      description: baseStore.description,
      storeId: baseStore.storeId,
    });

    if (storeFrontOrError.isFailure) {
      return left(storeFrontOrError);
    }

    const storeFront = storeFrontOrError.getValue() as StoreFront;

    await this.storeFrontRepo.save(storeFront);

    return right(Result.ok<void>());
  }
}
