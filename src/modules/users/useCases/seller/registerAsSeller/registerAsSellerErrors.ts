import { SuccessOrFailureResult } from '../../../../../shared/core/Result';
import { _UseCaseError } from '../../../../../shared/core/UseCaseError';

export namespace RegisterAsSellerErrors {
  export class EmailAlreadyTaken extends SuccessOrFailureResult<_UseCaseError> {
    constructor(email: string) {
      super(false, `The email ${email} for this account is already taken`);
    }
  }

  export class StoreNameAlreadyTaken extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `This Store name is already taken`);
    }
  }

  export class PhoneNumberAlreadyTaken extends SuccessOrFailureResult<_UseCaseError> {
    constructor(phoneNumber: string) {
      super(false, `Phone number ${phoneNumber} for this account is already taken`);
    }
  }
}
