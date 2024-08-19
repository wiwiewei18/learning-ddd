import { Request, RequestHandler, Response } from 'express';
import { BaseController, RequestMethods } from '../../../../shared/infra/http/models/BaseController';
import { AddProductToCartErrors } from './addProductToCartErrors';
import { AddProductToCartRequestDTO } from './addProductToCartRequestDTO';
import { AddProductToCartUseCase } from './addProductToCartUseCase';

export class AddProductToCartController extends BaseController {
  path: string = '/v2/orders/carts';
  method: RequestMethods = RequestMethods.POST;
  middleware?: RequestHandler[];

  private useCase: AddProductToCartUseCase;

  constructor(useCase: AddProductToCartUseCase, middleware: RequestHandler[]) {
    super();
    this.useCase = useCase;
    this.middleware = middleware;
  }

  protected async executeImpl(req: Request, res: Response): Promise<unknown> {
    const dto = req.body as AddProductToCartRequestDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AddProductToCartErrors.BuyerDoesntExists:
          case AddProductToCartErrors.ProductDoesntExists:
          case AddProductToCartErrors.ProductOutOfStock:
          case AddProductToCartErrors.QuantityExceedsAvailableStock:
            return this.notFound(res, error.getErrorValue());
          default:
            return this.fail(res, error.getErrorValue());
        }
      }

      return this.ok(res);
    } catch (error) {
      return this.fail(res, error as Error);
    }
  }
}
