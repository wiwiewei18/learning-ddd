import { SuccessOrFailureResult } from '../../../../../shared/core/Result';
import { _UseCaseError } from '../../../../../shared/core/UseCaseError';

export namespace LoginAsBuyerErrors {
  export class EmailNotVerified extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `Buyer email not verified!`);
    }
  }

  export class IncorrectEmailOrPassword extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `Invalid email or password`);
    }
  }
}
