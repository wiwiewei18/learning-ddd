import { Request, RequestHandler, Response } from 'express';
import { BaseController, RequestMethods } from '../../../../../shared/infra/http/models/BaseController';
import { RegisterAsBuyerErrors } from './RegisterAsBuyerErrors';
import { RegisterAsBuyerRequestDTO } from './RegisterAsBuyerRequestDTO';
import { RegisterAsBuyerUseCase } from './RegisterAsBuyerUseCase';

export class RegisterAsBuyerController extends BaseController {
  path = '/v2/users/buyers';
  method = RequestMethods.POST;
  middleware?: RequestHandler[] | undefined;

  private useCase: RegisterAsBuyerUseCase;

  constructor(useCase: RegisterAsBuyerUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<unknown> {
    const dto = req.body as RegisterAsBuyerRequestDTO;

    try {
      const result = await this.useCase.execute(dto);
      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case RegisterAsBuyerErrors.EmailAlreadyTaken:
          case RegisterAsBuyerErrors.PhoneNumberAlreadyTaken:
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
