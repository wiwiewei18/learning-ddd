import { Request, RequestHandler, Response } from 'express';
import { BaseController, RequestMethods } from '../../../../../shared/infra/http/models/BaseController';
import { VerifySellerEmailErrors } from './verifySellerEmailErrors';
import { VerifySellerEmailRequestDTO } from './verifySellerEmailRequestDTO';
import { VerifySellerEmailUseCase } from './verifySellerEmailUseCase';

export class VerifySellerEmailController extends BaseController {
  path: string = '/v2/users/sellers/verify-email';
  method: RequestMethods = RequestMethods.POST;
  middleware?: RequestHandler[] | undefined;

  private useCase: VerifySellerEmailUseCase;

  constructor(useCase: VerifySellerEmailUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<unknown> {
    const dto = req.body as VerifySellerEmailRequestDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case VerifySellerEmailErrors.InvalidToken:
            return this.clientError(res, error.getErrorValue());
          case VerifySellerEmailErrors.TokenAlreadyExpired:
            return this.gone(res, error.getErrorValue());
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
