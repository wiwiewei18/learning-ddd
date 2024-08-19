import { Guard } from '../../../../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../../../../shared/core/Result';
import { ValueObject } from '../../../../../../../shared/domain/ValueObject';
import { ProductCategoryId } from '../productCategoryId';
import { ProductCategoryName } from './productCategoryName';

interface ProductCategoryDetailsProps {
  name: ProductCategoryName;
  parentProductCategoryId?: ProductCategoryId;
}

export class ProductCategoryDetails extends ValueObject<ProductCategoryDetailsProps> {
  get name(): ProductCategoryName {
    return this.props.name;
  }

  get parentProductCategoryId(): ProductCategoryId {
    return this.props.parentProductCategoryId as ProductCategoryId;
  }

  private constructor(props: ProductCategoryDetailsProps) {
    super(props);
  }

  static create(props: ProductCategoryDetailsProps): SuccessOrFailure<ProductCategoryDetails> {
    const guardResult = Guard.againstNullOrUndefined(props.name, 'name');
    if (guardResult.isFailure) {
      return Result.fail<ProductCategoryDetails>(guardResult.getErrorValue());
    }

    return Result.ok<ProductCategoryDetails>(new ProductCategoryDetails(props));
  }
}
