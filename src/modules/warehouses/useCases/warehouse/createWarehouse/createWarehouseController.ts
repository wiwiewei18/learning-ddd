import { RequestHandler, Response } from 'express';
import { BaseController, RequestMethods } from '../../../../../shared/infra/http/models/BaseController';
import { TypedRequest } from '../../../../../shared/infra/http/models/typedRequest';
import { CreateWarehouseUseCase } from './createWarehouseUseCase';
import { CreateWarehouseRequestDTO } from './createWarehouseRequestDTO';
import { CreateWarehouseErrors } from './createWarehouseErrors';

type BodyExpressRequest = {
  name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
};

export class CreateWarehouseController extends BaseController {
  path = '/v1/warehouses/warehouses';
  method: RequestMethods = RequestMethods.POST;
  middleware?: RequestHandler[] | undefined;

  private useCase: CreateWarehouseUseCase;

  constructor(useCase: CreateWarehouseUseCase, middleware: RequestHandler[]) {
    super();
    this.useCase = useCase;
    this.middleware = middleware;
  }

  protected async executeImpl(
    req: TypedRequest<Record<string, never>, BodyExpressRequest>,
    res: Response,
  ): Promise<unknown> {
    const dto: CreateWarehouseRequestDTO = {
      name: req.body.name,
      address: req.body.address,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      zipCode: req.body.zipCode,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateWarehouseErrors.NameAlreadyTaken:
            return this.clientError(res, error.getErrorValue());
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
