import { Maybe } from '../../../../shared/core/Result';
import { CartItem } from '../../domain/cart/cartItem';
import { CartItemId } from '../../domain/cart/cartItemId';

export interface CartItemRepo {
  exists(cartItemId: CartItemId): Promise<boolean>;
  save(cartItem: CartItem): Promise<void>;
  getCartItem(productId: string, buyerId: string): Promise<Maybe<CartItem>>;
}
