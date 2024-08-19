import { Request, RequestHandler, Response } from 'express';
import { BaseController, RequestMethods } from '../../../../../shared/infra/http/models/BaseController';
import { LoginAsSellerErrors } from './loginAsSellerErrors';
import { LoginAsSellerRequestDTO } from './loginAsSellerRequestDTO';
import { LoginAsSellerResponseDTO } from './loginAsSellerResponseDTO';
import { LoginAsSellerUseCase } from './loginAsSellerUseCase';

export class LoginAsSellerController extends BaseController {
  path: string = '/v2/users/sellers/login';
  method: RequestMethods = RequestMethods.POST;
  middleware?: RequestHandler[] | undefined;

  private useCase: LoginAsSellerUseCase;

  constructor(useCase: LoginAsSellerUseCase, middleware: RequestHandler[]) {
    super();
    this.useCase = useCase;
    this.middleware = middleware;
  }

  protected async executeImpl(req: Request, res: Response): Promise<unknown> {
    const dto = req.body as LoginAsSellerRequestDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case LoginAsSellerErrors.SellerEmailNotVerified:
            return this.forbidden(res, error.getErrorValue());
          case LoginAsSellerErrors.IncorrectEmailOrPassword:
            return this.unauthorized(res, error.getErrorValue());
          default:
            return this.fail(res, error.getErrorValue());
        }
      }

      return this.ok<LoginAsSellerResponseDTO>(res, result.value.getValue());
    } catch (error) {
      return this.fail(res, error as Error);
    }
  }
}
