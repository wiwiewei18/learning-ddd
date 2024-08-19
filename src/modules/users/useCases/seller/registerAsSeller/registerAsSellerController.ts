import { Request, RequestHandler, Response } from 'express';
import { BaseController, RequestMethods } from '../../../../../shared/infra/http/models/BaseController';
import { RegisterAsSellerErrors } from './registerAsSellerErrors';
import { RegisterAsSellerRequestDTO } from './registerAsSellerRequestDTO';
import { RegisterAsSellerUseCase } from './registerAsSellerUseCase';

export class RegisterAsSellerController extends BaseController {
  path: string = '/v2/users/sellers';
  method: RequestMethods = RequestMethods.POST;
  middleware?: RequestHandler[] | undefined;

  private useCase: RegisterAsSellerUseCase;

  constructor(useCase: RegisterAsSellerUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<unknown> {
    const dto = req.body as RegisterAsSellerRequestDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case RegisterAsSellerErrors.EmailAlreadyTaken:
          case RegisterAsSellerErrors.PhoneNumberAlreadyTaken:
          case RegisterAsSellerErrors.StoreNameAlreadyTaken:
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
