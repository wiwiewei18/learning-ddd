import { Result, SuccessOrFailure } from '../../../../../../../shared/core/Result';
import { ValueObject } from '../../../../../../../shared/domain/ValueObject';

interface ProductCategoryNameProps {
  value: string;
}

export class ProductCategoryName extends ValueObject<ProductCategoryNameProps> {
  static nameMaxLength = 20;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: ProductCategoryNameProps) {
    super(props);
  }

  static create(name: string): SuccessOrFailure<ProductCategoryName> {
    if (name.length > this.nameMaxLength) {
      return Result.fail<ProductCategoryName>(`Product category name should'nt exceed ${this.nameMaxLength} char limit`);
    }

    return Result.ok<ProductCategoryName>(new ProductCategoryName({ value: name }));
  }
}
