import { SuccessOrFailureResult } from '../../../../shared/core/Result';
import { _UseCaseError } from '../../../../shared/core/UseCaseError';

export namespace AddProductToCartErrors {
  export class BuyerDoesntExists extends SuccessOrFailureResult<_UseCaseError> {
    constructor(buyerId: string) {
      super(false, `Buyer with id ${buyerId} doesn't exists`);
    }
  }

  export class ProductDoesntExists extends SuccessOrFailureResult<_UseCaseError> {
    constructor(productId: string) {
      super(false, `Product with id ${productId} doesn't exists`);
    }
  }

  export class QuantityExceedsAvailableStock extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `Quantity exceeds available stock`);
    }
  }

  export class ProductOutOfStock extends SuccessOrFailureResult<_UseCaseError> {
    constructor(availableStock: number, currentQuantityInCart: number) {
      super(
        false,
        `There are ${availableStock} left stock for this item and you already have ${currentQuantityInCart} in your cart`,
      );
    }
  }
}
