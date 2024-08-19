import { SuccessOrFailureResult } from '../../../../../shared/core/Result';
import { _UseCaseError } from '../../../../../shared/core/UseCaseError';

export namespace CreateBuyerErrors {
  export class BuyerAlreadyExists extends SuccessOrFailureResult<_UseCaseError> {
    constructor(baseUserId: string) {
      super(false, `Buyer with base user id ${baseUserId} already exists`);
    }
  }

  export class UserDoesntExists extends SuccessOrFailureResult<_UseCaseError> {
    constructor(baseUserId: string) {
      super(false, `Base User with id ${baseUserId} doesn't exists`);
    }
  }
}
