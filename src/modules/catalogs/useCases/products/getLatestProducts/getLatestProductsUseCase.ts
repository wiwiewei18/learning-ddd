import { AppError } from '../../../../../shared/core/AppError';
import { Either, left, right } from '../../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import { ProductVariantDetails } from '../../../domain/product/valueObjects/productVariantDetails';
import { ProductVariantRepo } from '../../../repos/product/productVariantRepo/productVariantRepo';

type Response = Either<AppError.UnexpectedError, SuccessOrFailure<ProductVariantDetails[]>>;

export class GetLatestProductsUseCase implements UseCase<null, Promise<Response>> {
  private productVariantRepo: ProductVariantRepo;

  constructor(productVariantRepo: ProductVariantRepo) {
    this.productVariantRepo = productVariantRepo;
  }

  async execute(): Promise<Response> {
    try {
      const products = await this.productVariantRepo.getRecentProducts();
      return right(Result.ok<ProductVariantDetails[]>(products));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
