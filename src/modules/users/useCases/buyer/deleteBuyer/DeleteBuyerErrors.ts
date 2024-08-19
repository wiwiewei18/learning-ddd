import { SuccessOrFailureResult } from '../../../../../shared/core/Result';
import { _UseCaseError } from '../../../../../shared/core/UseCaseError';

export namespace DeleteBuyerErrors {
  export class BuyerDoesntExists extends SuccessOrFailureResult<_UseCaseError> {
    constructor(buyerId: string) {
      super(false, `Buyer with id ${buyerId} not found`);
    }
  }
}
