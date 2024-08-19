import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { logger } from '../../../shared/infra/logger';
import { BuyerId } from '../domain/buyer/buyerId';
import { CartItem } from '../domain/cart/cartItem';
import { ProductId } from '../domain/product/productId';
import { CartItemPersistenceDTO } from '../dtos/cartItemDTO';

export class CartItemMap {
  static toPersistence(cartItem: CartItem): CartItemPersistenceDTO {
    return {
      cart_item_id: cartItem.cartItemId.getStringValue(),
      buyer_id: cartItem.buyerId.getStringValue(),
      product_id: cartItem.productId.getStringValue(),
      quantity: cartItem.quantity,
    };
  }

  static toDomain(raw: CartItemPersistenceDTO): CartItem {
    const buyerId = BuyerId.create(new UniqueEntityID(raw.buyer_id)).getValue() as BuyerId;
    const productId = ProductId.create(new UniqueEntityID(raw.product_id)).getValue() as ProductId;

    const cartItemOrError = CartItem.create(
      {
        buyerId,
        productId,
        quantity: raw.quantity,
      },
      new UniqueEntityID(raw.cart_item_id),
    );

    if (cartItemOrError.isFailure) {
      logger.error(cartItemOrError.getErrorValue());
      throw new Error();
    }

    return cartItemOrError.getValue() as CartItem;
  }
}
