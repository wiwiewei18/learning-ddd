import { SuccessOrFailureResult } from '../../../../../shared/core/Result';
import { _UseCaseError } from '../../../../../shared/core/UseCaseError';

export namespace LoginAsSellerErrors {
  export class SellerEmailNotVerified extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `Seller email not verified!`);
    }
  }

  export class IncorrectEmailOrPassword extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `Invalid email or password`);
    }
  }
}
