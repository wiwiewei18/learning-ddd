import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';

interface ProductPriceProps {
  value: number;
}

export class ProductPrice extends ValueObject<ProductPriceProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: ProductPriceProps) {
    super(props);
  }

  format(): string {
    return `S$ ${this.value}`;
  }

  static create(price: number): SuccessOrFailure<ProductPrice> {
    if (price <= 0) {
      return Result.fail<ProductPrice>(`Product price must more than 0`);
    }

    return Result.ok<ProductPrice>(new ProductPrice({ value: price }));
  }
}
