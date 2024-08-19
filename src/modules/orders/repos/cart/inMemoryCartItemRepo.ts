import { Maybe, Result } from '../../../../shared/core/Result';
import { CartItem } from '../../domain/cart/cartItem';
import { CartItemId } from '../../domain/cart/cartItemId';
import { CartItemMap } from '../../mappers/cartItemMap';
import { CartItemRepo } from './cartItemRepo';

export class InMemoryCartItemRepo implements CartItemRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async exists(cartItemId: CartItemId): Promise<boolean> {
    for (const cartItem of this.models.CartItem) {
      if (cartItem.cart_item_id === cartItemId.getStringValue()) {
        return true;
      }
    }
    return false;
  }

  async save(cartItem: CartItem): Promise<void> {
    if (!(await this.exists(cartItem.cartItemId))) {
      const rawCartItem = CartItemMap.toPersistence(cartItem);

      this.models.CartItem.push(rawCartItem);
    }
  }

  async getCartItem(productId: string, buyerId: string): Promise<Maybe<CartItem>> {
    for (const cartItem of this.models.CartItem) {
      if (cartItem.product_id === productId && cartItem.buyer_id === buyerId) {
        return Result.found(CartItemMap.toDomain(cartItem));
      }
    }
    return Result.notFound(`Cart Item with product id ${productId} and buyer id ${buyerId} not found`);
  }
}
