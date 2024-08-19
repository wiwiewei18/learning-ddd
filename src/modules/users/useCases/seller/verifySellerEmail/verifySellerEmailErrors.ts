import { SuccessOrFailureResult } from '../../../../../shared/core/Result';
import { _UseCaseError } from '../../../../../shared/core/UseCaseError';

export namespace VerifySellerEmailErrors {
  export class InvalidToken extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `invalid email verification token`);
    }
  }

  export class TokenAlreadyExpired extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `token already expired`);
    }
  }
}
