import { Either } from '../../../../../shared/core/Either';
import { SuccessOrFailure } from '../../../../../shared/core/Result';
import { CreateProductErrors } from './createProductErrors';

export type CreateProductResponse = Either<
  | CreateProductErrors.NameAlreadyTaken
  | CreateProductErrors.DuplicateVariantAttributeOption
  | CreateProductErrors.CategoryDoesntExists
  | CreateProductErrors.StoreFrontDoesntExists
  | CreateProductErrors.TooManyDefaultVariant
  | CreateProductErrors.NoDefaultVariant
  | SuccessOrFailure<any>,
  SuccessOrFailure<void>
>;
