import { MockProxy, mock } from 'jest-mock-extended';
import { Result } from '../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { BaseProductId } from '../../../catalogs/domain/product/valueObjects/baseProductId';
import { BuyerId } from '../../domain/buyer/buyerId';
import { CartItem } from '../../domain/cart/cartItem';
import { Product } from '../../domain/product/product';
import { ProductId } from '../../domain/product/productId';
import { BuyerRepo } from '../../repos/buyer/buyerRepo';
import { CartItemRepo } from '../../repos/cart/cartItemRepo';
import { ProductRepo } from '../../repos/product/productRepo';
import { AddProductToCartErrors } from './addProductToCartErrors';
import { AddProductToCartUseCase } from './addProductToCartUseCase';

describe('Feature: Add product to cart', () => {
  let mockCartItemRepo: MockProxy<CartItemRepo>;
  let mockBuyerRepo: MockProxy<BuyerRepo>;
  let mockProductRepo: MockProxy<ProductRepo>;
  let buyerId: BuyerId;
  let productId: ProductId;
  let product: Product;
  let baseProductId: BaseProductId;

  beforeEach(() => {
    mockCartItemRepo = mock<CartItemRepo>();

    mockBuyerRepo = mock<BuyerRepo>();
    mockBuyerRepo.exists.mockResolvedValue(true);

    baseProductId = BaseProductId.create(new UniqueEntityID('a')).getValue() as BaseProductId;
    product = Product.create({ baseProductId, name: 'a', stock: 1 }).getValue() as Product;

    mockProductRepo = mock<ProductRepo>();
    mockProductRepo.getProduct.mockResolvedValue(Result.found(product));

    buyerId = BuyerId.create(new UniqueEntityID('a')).getValue() as BuyerId;
    productId = ProductId.create(new UniqueEntityID('a')).getValue() as ProductId;
  });

  describe('Scenario: Buyer success add product to cart', () => {
    describe('Given Buyer has empty cart', () => {
      describe('When Buyer add product to cart', () => {
        test('Then the selected product should exists in cart', async () => {
          mockCartItemRepo.getCartItem.mockResolvedValue(Result.notFound('e'));

          const addProductToCartUseCase = new AddProductToCartUseCase(mockCartItemRepo, mockBuyerRepo, mockProductRepo);

          const result = await addProductToCartUseCase.execute({
            buyerId: 'a',
            productId: 'a',
            quantity: 1,
          });

          expect(result.isRight()).toBe(true);
          expect(mockCartItemRepo.save).toHaveBeenCalled();
        });
      });
    });

    describe('Given Buyer has cart with product named "math book"', () => {
      beforeEach(() => {
        product = Product.create({ baseProductId, name: 'a', stock: 3 }).getValue() as Product;
        mockProductRepo.getProduct.mockResolvedValue(Result.found(product));
      });

      describe('When Buyer add the math book to cart', () => {
        test('Then math book quantity should be increased by 1', async () => {
          const cartItem = CartItem.create({
            buyerId,
            productId,
            quantity: 1,
          }).getValue() as CartItem;

          mockCartItemRepo.getCartItem.mockResolvedValue(Result.found(cartItem));

          const addProductToCartUseCase = new AddProductToCartUseCase(mockCartItemRepo, mockBuyerRepo, mockProductRepo);

          const result = await addProductToCartUseCase.execute({
            buyerId: 'a',
            productId: 'a',
            quantity: 1,
          });

          expect(result.isRight()).toBe(true);
          expect(cartItem.quantity).toBe(2);

          type CartItemRepoSaveParams = Parameters<typeof mockCartItemRepo.save>;
          expect(mockCartItemRepo.save).toHaveBeenCalledWith<CartItemRepoSaveParams>(cartItem);
        });
      });

      describe('When Buyer add the math book to cart with 2 quantity', () => {
        test('Then math book quantity in cart should 3 quantity', async () => {
          const cartItem = CartItem.create({
            buyerId,
            productId,
            quantity: 1,
          }).getValue() as CartItem;

          mockCartItemRepo.getCartItem.mockResolvedValue(Result.found(cartItem));

          const addProductToCartUseCase = new AddProductToCartUseCase(mockCartItemRepo, mockBuyerRepo, mockProductRepo);

          const result = await addProductToCartUseCase.execute({
            buyerId: 'a',
            productId: 'a',
            quantity: 2,
          });

          expect(result.isRight()).toBe(true);
          expect(cartItem.quantity).toBe(3);

          type CartItemRepoSaveParams = Parameters<typeof mockCartItemRepo.save>;
          expect(mockCartItemRepo.save).toHaveBeenCalledWith<CartItemRepoSaveParams>(cartItem);
        });
      });
    });
  });

  describe('Scenario: Buyer failed to add product to cart with quantity more than available stock', () => {
    describe('Given Buyer has empty cart And Product named "math book" with 1 stock', () => {
      describe('When Buyer add "math book" to cart with 2 quantity', () => {
        test('Then "math book" should not added to cart And Buyer should receive QuantityExceedsAvailableStock error', async () => {
          mockCartItemRepo.getCartItem.mockResolvedValue(Result.notFound('e'));

          const addProductToCartUseCase = new AddProductToCartUseCase(mockCartItemRepo, mockBuyerRepo, mockProductRepo);

          const result = await addProductToCartUseCase.execute({ buyerId: 'a', productId: 'a', quantity: 2 });

          expect(result.isLeft()).toBe(true);
          expect(result.value.constructor).toEqual(AddProductToCartErrors.QuantityExceedsAvailableStock);
          expect(mockCartItemRepo.save).not.toHaveBeenCalled();
        });
      });
    });

    describe('Given Product named "math book" with 1 quantity And Buyer has "math book" with 1 quantity inside cart', () => {
      describe('When Buyer add "math book" to cart', () => {
        test('Then "math book" should not added to cart And Buyer should receive ProductOutOfStock error', async () => {
          const cartItem = CartItem.create({
            buyerId,
            productId,
            quantity: 1,
          }).getValue() as CartItem;

          mockCartItemRepo.getCartItem.mockResolvedValue(Result.found(cartItem));

          const addProductToCartUseCase = new AddProductToCartUseCase(mockCartItemRepo, mockBuyerRepo, mockProductRepo);

          const result = await addProductToCartUseCase.execute({
            buyerId: 'a',
            productId: 'a',
            quantity: 1,
          });

          expect(result.isLeft()).toBe(true);
          expect(mockCartItemRepo.save).not.toHaveBeenCalled();
          expect(result.value.constructor).toEqual(AddProductToCartErrors.ProductOutOfStock);
        });
      });
    });
  });
});
