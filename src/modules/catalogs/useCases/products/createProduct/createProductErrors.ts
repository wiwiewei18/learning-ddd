import { SuccessOrFailureResult } from '../../../../../shared/core/Result';
import { _UseCaseError } from '../../../../../shared/core/UseCaseError';
import { ProductVariantAttribute } from '../../../domain/product/entities/productVariant/valueObjects/variantAttribute';

export namespace CreateProductErrors {
  export class NameAlreadyTaken extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `The product name already taken`);
    }
  }

  export class DuplicateVariantAttributeOption extends SuccessOrFailureResult<_UseCaseError> {
    constructor(attributes: ProductVariantAttribute[]) {
      super(false, `Duplicate ${attributes.map((a) => a.option).join(', ')} variant attribute option`);
    }
  }

  export class CategoryDoesntExists extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `Category doesn't exists`);
    }
  }

  export class StoreFrontDoesntExists extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `Store front doesn't exists`);
    }
  }

  export class TooManyDefaultVariant extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `There can be only one default variant`);
    }
  }

  export class NoDefaultVariant extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `There must be at least one variant set as default`);
    }
  }

  export class VariantAttributesMismatch extends SuccessOrFailureResult<_UseCaseError> {
    constructor() {
      super(false, `Variant attribute mismatch`);
    }
  }
}
