import { SuccessOrFailureResult } from '../../../../../shared/core/Result';
import { _UseCaseError } from '../../../../../shared/core/UseCaseError';

export namespace CreateStoreFrontErrors {
  export class StoreFrontAlreadyExists extends SuccessOrFailureResult<_UseCaseError> {
    constructor(name: string) {
      super(false, `Store front with name ${name} already exists`);
    }
  }

  export class StoreDoesntExists extends SuccessOrFailureResult<_UseCaseError> {
    constructor(storeId: string) {
      super(false, `Store for store id ${storeId} doesn't exists`);
    }
  }
}
