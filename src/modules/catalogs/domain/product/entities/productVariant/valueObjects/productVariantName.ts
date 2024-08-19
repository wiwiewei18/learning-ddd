import { Guard } from '../../../../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../../../../shared/core/Result';
import { ValueObject } from '../../../../../../../shared/domain/ValueObject';

interface ProductVariantNameProps {
  baseName: string;
  attributesOptions?: string[];
}

export class ProductVariantName extends ValueObject<ProductVariantNameProps> {
  get value(): string {
    return `${this.props.baseName}${
      this.props.attributesOptions && this.props.attributesOptions.length
        ? ` - ${this.props.attributesOptions.join(', ')}`
        : ''
    }`;
  }

  private constructor(props: ProductVariantNameProps) {
    super(props);
  }

  static create(props: ProductVariantNameProps): SuccessOrFailure<ProductVariantName> {
    const guardResult = Guard.againstNullOrUndefined(props.baseName, 'baseName');
    if (guardResult.isFailure) {
      return Result.fail<ProductVariantName>(guardResult.getErrorValue());
    }

    return Result.ok<ProductVariantName>(
      new ProductVariantName({ baseName: props.baseName, attributesOptions: props.attributesOptions }),
    );
  }
}
