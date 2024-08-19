import { Maybe, Result } from '../../../../shared/core/Result';
import { CartItem } from '../../domain/cart/cartItem';
import { CartItemId } from '../../domain/cart/cartItemId';
import { CartItemMap } from '../../mappers/cartItemMap';
import { CartItemRepo } from './cartItemRepo';

export class SequelizeCartItemRepo implements CartItemRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async save(cartItem: CartItem): Promise<void> {
    const rawSequelizeCartItem = CartItemMap.toPersistence(cartItem);
    const sequelizeCartItem = await this.models.CartItem.findOne({
      where: { cart_item_id: cartItem.cartItemId.getStringValue() },
    });

    if (sequelizeCartItem) {
      rawSequelizeCartItem.updated_at = new Date();
      Object.assign(sequelizeCartItem, rawSequelizeCartItem);
      await sequelizeCartItem.save();
    } else {
      await this.models.CartItem.create(rawSequelizeCartItem);
    }
  }

  async getCartItem(productId: string, buyerId: string): Promise<Maybe<CartItem>> {
    const rawCartItem = await this.models.CartItem.findOne({ where: { product_id: productId, buyer_id: buyerId } });

    if (!rawCartItem) {
      return Result.notFound(`Cart item with product id ${productId} and buyer id ${buyerId}`);
    }

    return Result.found(CartItemMap.toDomain(rawCartItem));
  }

  async exists(cartItemId: CartItemId): Promise<boolean> {
    const cartItem = await this.models.CartItem.findOne({ where: { cart_item_id: cartItemId.getStringValue() } });
    return !!cartItem === true;
  }
}
