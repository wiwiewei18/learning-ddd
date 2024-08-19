import { SuccessOrFailureResult } from '../../../../../shared/core/Result';
import { _UseCaseError } from '../../../../../shared/core/UseCaseError';

export namespace CreateWarehouseErrors {
  export class NameAlreadyTaken extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `The warehouse name already taken`);
    }
  }
}
