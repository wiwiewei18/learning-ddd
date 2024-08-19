import { SuccessOrFailure } from '../../../../../shared/core/Result';
import { ProductPrice } from './productPrice';

let productPriceOrError: SuccessOrFailure<ProductPrice>;

describe('ProductPrice', () => {
  it('should be able to create product price based on valid amount', () => {
    const moneyValue = 10;

    productPriceOrError = ProductPrice.create(moneyValue);

    expect(productPriceOrError.isSuccess).toBe(true);

    const productPrice = productPriceOrError.getValue() as ProductPrice;
    expect(productPrice.format()).toEqual('S$ 10');
  });
});
