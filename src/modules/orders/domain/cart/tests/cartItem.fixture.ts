import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { BuyerId } from '../../buyer/buyerId';
import { ProductId } from '../../product/productId';
import { CartItem } from '../cartItem';

interface RandomCartItemProps {
  buyerId: BuyerId;
  productId: ProductId;
  quantity: number;
}

function createRandomCartItem(props: RandomCartItemProps): CartItem {
  const buyerId = props.buyerId ? props.buyerId : (BuyerId.create(new UniqueEntityID('1')).getValue() as BuyerId);
  const productId = props.productId ? props.productId : (ProductId.create(new UniqueEntityID('1')).getValue() as ProductId);

  return CartItem.create({
    buyerId,
    productId,
    quantity: props.quantity ? props.quantity : 1,
  }).getValue() as CartItem;
}

export { createRandomCartItem };
