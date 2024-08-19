import { Guard } from '../../../../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../../../../shared/core/Result';
import { ValueObject } from '../../../../../../../shared/domain/ValueObject';

interface ProductVariantAttributeProps {
  name: string;
  option: string;
}

export class ProductVariantAttribute extends ValueObject<ProductVariantAttributeProps> {
  get name(): string {
    return this.props.name;
  }

  get option(): string {
    return this.props.option;
  }

  get value(): ProductVariantAttributeProps {
    return this.props;
  }

  private constructor(props: ProductVariantAttributeProps) {
    super(props);
  }

  static create(props: ProductVariantAttributeProps): SuccessOrFailure<ProductVariantAttribute> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.name,
        argumentName: 'name',
      },
      {
        argument: props.option,
        argumentName: 'option',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<ProductVariantAttribute>(guardResult.getErrorValue());
    }

    return Result.ok<ProductVariantAttribute>(new ProductVariantAttribute(props));
  }
}
