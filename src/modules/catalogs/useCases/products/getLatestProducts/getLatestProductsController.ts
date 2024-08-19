import { Request, Response } from 'express';
import { BaseController, RequestMethods } from '../../../../../shared/infra/http/models/BaseController';
import { ProductVariantDetailsMap } from '../../../mappers/productVariantDetailsMap';
import { GetLatestProductsResponseDTO } from './getLatestProductsResponseDTO';
import { GetLatestProductsUseCase } from './getLatestProductsUseCase';

export class GetLatestProductsController extends BaseController {
  path: string = '/v2/catalogs/products/latest';
  method: RequestMethods = RequestMethods.GET;
  middleware?: [] | undefined;

  private useCase: GetLatestProductsUseCase;

  constructor(useCase: GetLatestProductsUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async executeImpl(_req: Request, res: Response): Promise<unknown> {
    try {
      const result = await this.useCase.execute();
      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error.getErrorValue());
        }
      }

      const productDetails = result.value.getValue();
      return this.ok<GetLatestProductsResponseDTO>(res, {
        products: productDetails ? productDetails.map((product) => ProductVariantDetailsMap.toDTO(product)) : [],
      });
    } catch (error) {
      return this.fail(res, error as Error);
    }
  }
}
