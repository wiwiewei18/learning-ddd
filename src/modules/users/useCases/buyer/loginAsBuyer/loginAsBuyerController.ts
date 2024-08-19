import { Request, RequestHandler, Response } from 'express';
import { BaseController, RequestMethods } from '../../../../../shared/infra/http/models/BaseController';
import { LoginAsBuyerErrors } from './loginAsBuyerErrors';
import { LoginAsBuyerRequestDTO } from './loginAsBuyerRequestDTO';
import { LoginAsBuyerResponseDTO } from './loginAsBuyerResponseDTO';
import { LoginAsBuyerUseCase } from './loginAsBuyerUseCase';

export class LoginAsBuyerController extends BaseController {
  path: string = '/v2/users/buyers/login';
  method: RequestMethods = RequestMethods.POST;
  middleware?: RequestHandler[];

  private useCase: LoginAsBuyerUseCase;

  constructor(useCase: LoginAsBuyerUseCase, middleware: RequestHandler[]) {
    super();
    this.useCase = useCase;
    this.middleware = middleware;
  }

  protected async executeImpl(req: Request, res: Response): Promise<unknown> {
    const dto = req.body as LoginAsBuyerRequestDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case LoginAsBuyerErrors.EmailNotVerified:
            return this.forbidden(res, error.getErrorValue());
          case LoginAsBuyerErrors.IncorrectEmailOrPassword:
            return this.unauthorized(res, error.getErrorValue());
          default:
            return this.fail(res, error.getErrorValue());
        }
      }

      return this.ok<LoginAsBuyerResponseDTO>(res, result.value.getValue());
    } catch (error) {
      return this.fail(res, error as Error);
    }
  }
}
