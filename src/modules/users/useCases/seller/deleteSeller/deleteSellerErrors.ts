import { SuccessOrFailureResult } from '../../../../../shared/core/Result';
import { _UseCaseError } from '../../../../../shared/core/UseCaseError';

export namespace DeleteSellerErrors {
  export class SellerDoesntExists extends SuccessOrFailureResult<_UseCaseError> {
    constructor(sellerId: string) {
      super(false, `Seller with id ${sellerId} not found`);
    }
  }
}
