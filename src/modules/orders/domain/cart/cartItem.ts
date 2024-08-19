import { Either, left, right } from '../../../../shared/core/Either';
import { Guard } from '../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { AddProductToCartErrors } from '../../useCases/addProductToCart/addProductToCartErrors';
import { BuyerId } from '../buyer/buyerId';
import { ProductId } from '../product/productId';
import { CartItemId } from './cartItemId';

type IncreaseQuantityResult = Either<AddProductToCartErrors.ProductOutOfStock, SuccessOrFailure<void>>;

interface CartItemProps {
  buyerId: BuyerId;
  quantity: number;
  productId: ProductId;
}

export class CartItem extends AggregateRoot<CartItemProps> {
  get cartItemId(): CartItemId {
    return CartItemId.create(this._id).getValue() as CartItemId;
  }

  get buyerId(): BuyerId {
    return this.props.buyerId;
  }

  get productId(): ProductId {
    return this.props.productId;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  private constructor(props: CartItemProps, id?: UniqueEntityID) {
    super(props, id);
  }

  increaseQuantity(qty: number, productStock: number): IncreaseQuantityResult {
    const totalRequestedQuantity = this.props.quantity + qty;

    if (totalRequestedQuantity > productStock) {
      return left(new AddProductToCartErrors.ProductOutOfStock(productStock, this.props.quantity));
    }

    this.props.quantity += qty;

    return right(Result.ok<void>());
  }

  static create(props: CartItemProps, id?: UniqueEntityID): SuccessOrFailure<CartItem> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.buyerId,
        argumentName: 'buyerId',
      },
      {
        argument: props.productId,
        argumentName: 'productId',
      },
      {
        argument: props.quantity,
        argumentName: 'quantity',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getErrorValue());
    }

    const cartItem = new CartItem(props, id);

    return Result.ok(cartItem);
  }
}
