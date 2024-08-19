import { SuccessOrFailureResult } from '../../../../../shared/core/Result';
import { _UseCaseError } from '../../../../../shared/core/UseCaseError';

export namespace GetWarehousesErrors {
  export class WarehouseDoesntExists extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `Warehouse not found`);
    }
  }
}
