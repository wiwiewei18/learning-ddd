import { SuccessOrFailure } from '../../../../../shared/core/Result';
import { BaseProductName } from './baseProductName';

let productNameOrError: SuccessOrFailure<BaseProductName>;

describe('ProductName', () => {
  it('should be able to create valid product name', () => {
    productNameOrError = BaseProductName.create('Frozen Keyboard');

    expect(productNameOrError.isSuccess).toBe(true);
  });

  it('should fail to create product name that more than 70 character', () => {
    productNameOrError = BaseProductName.create(
      'Frozen Keyboard Monster Speaker Ultra wide Television Superman Batman Spider man with bread',
    );

    expect(productNameOrError.isFailure).toBe(true);
  });
});
