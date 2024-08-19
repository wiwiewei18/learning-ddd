import { Result, SuccessOrFailure } from '../../../../../../../shared/core/Result';
import { ValueObject } from '../../../../../../../shared/domain/ValueObject';

interface ProductCategoryCodeProps {
  value: string;
}

export class ProductCategoryCode extends ValueObject<ProductCategoryCodeProps> {
  static codeMaxLength = 10;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: ProductCategoryCodeProps) {
    super(props);
  }

  static create(code: string): SuccessOrFailure<ProductCategoryCode> {
    if (code.length > this.codeMaxLength) {
      return Result.fail<ProductCategoryCode>(`Product category code should'nt exceed ${this.codeMaxLength} char limit`);
    }

    return Result.ok<ProductCategoryCode>(new ProductCategoryCode({ value: code }));
  }
}
