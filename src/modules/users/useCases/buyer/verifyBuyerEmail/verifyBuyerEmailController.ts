import { Request, RequestHandler, Response } from 'express';
import { BaseController, RequestMethods } from '../../../../../shared/infra/http/models/BaseController';
import { VerifyBuyerEmailErrors } from './verifyBuyerEmailErrors';
import { VerifyBuyerEmailRequestDTO } from './verifyBuyerEmailRequestDTO';
import { VerifyBuyerEmailUseCase } from './verifyBuyerEmailUseCase';

export class VerifyBuyerEmailController extends BaseController {
  path: string = '/v2/users/buyers/verify-email';
  method: RequestMethods = RequestMethods.POST;
  middleware?: RequestHandler[] | undefined;

  private useCase: VerifyBuyerEmailUseCase;

  constructor(useCase: VerifyBuyerEmailUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<unknown> {
    const dto = req.body as VerifyBuyerEmailRequestDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case VerifyBuyerEmailErrors.InvalidToken:
            return this.clientError(res, error.getErrorValue());
          case VerifyBuyerEmailErrors.TokenAlreadyExpired:
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
