import { Either, left, right } from '../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../shared/core/Result';
import { UseCase } from '../../../../shared/core/UseCase';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { BuyerId } from '../../domain/buyer/buyerId';
import { CartItem } from '../../domain/cart/cartItem';
import { Product } from '../../domain/product/product';
import { ProductId } from '../../domain/product/productId';
import { BuyerRepo } from '../../repos/buyer/buyerRepo';
import { CartItemRepo } from '../../repos/cart/cartItemRepo';
import { ProductRepo } from '../../repos/product/productRepo';
import { AddProductToCartErrors } from './addProductToCartErrors';
import { AddProductToCartRequestDTO } from './addProductToCartRequestDTO';

type Response = Either<
  AddProductToCartErrors.ProductOutOfStock | AddProductToCartErrors.BuyerDoesntExists | SuccessOrFailure<any>,
  SuccessOrFailure<void>
>;

export class AddProductToCartUseCase implements UseCase<AddProductToCartRequestDTO, Promise<Response>> {
  private cartItemRepo: CartItemRepo;
  private buyerRepo: BuyerRepo;
  private productRepo: ProductRepo;

  constructor(cartItemRepo: CartItemRepo, buyerRepo: BuyerRepo, productRepo: ProductRepo) {
    this.cartItemRepo = cartItemRepo;
    this.buyerRepo = buyerRepo;
    this.productRepo = productRepo;
  }

  async execute(request: AddProductToCartRequestDTO): Promise<Response> {
    const buyerId = BuyerId.create(new UniqueEntityID(request.buyerId)).getValue() as BuyerId;
    const isBuyerExists = await this.buyerRepo.exists(buyerId);

    if (!isBuyerExists) {
      return left(new AddProductToCartErrors.BuyerDoesntExists(request.buyerId));
    }

    let cartItem: CartItem;

    const searchedProduct = await this.productRepo.getProduct(request.productId);
    if (searchedProduct.isNotFound) {
      return left(new AddProductToCartErrors.ProductDoesntExists(request.productId));
    }

    const product = searchedProduct.getValue() as Product;

    if (request.quantity > product.stock) {
      return left(new AddProductToCartErrors.QuantityExceedsAvailableStock());
    }

    const searchedCartItemByProductId = await this.cartItemRepo.getCartItem(request.productId, request.buyerId);
    if (searchedCartItemByProductId.isFound) {
      cartItem = searchedCartItemByProductId.getValue() as CartItem;

      const increaseQtyResult = cartItem.increaseQuantity(request.quantity, product.stock);

      if (increaseQtyResult.isLeft()) {
        return left(increaseQtyResult.value);
      }
    } else {
      const productId = ProductId.create(new UniqueEntityID(request.productId)).getValue() as ProductId;
      const cartItemOrError = CartItem.create({ buyerId, productId, quantity: request.quantity });
      if (cartItemOrError.isFailure) {
        return left(cartItemOrError);
      }
      cartItem = cartItemOrError.getValue() as CartItem;
    }

    await this.cartItemRepo.save(cartItem);

    return right(Result.ok<void>());
  }
}
