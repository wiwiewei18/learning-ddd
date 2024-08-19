import { Request, Response } from 'express';
import { BaseController, RequestMethods } from '../../../../../shared/infra/http/models/BaseController';
import { GetWarehousesUseCase } from './getWarehousesUseCase';
import { WarehouseMap } from '../../../mappers/warehouseMap';
import { GetWarehousesResponseDTO } from './getWarehousesResponseDTO';
import { GetWarehousesErrors } from './getWarehousesErrors';

export class GetWarehousesController extends BaseController {
  path: string = '/v1/warehouses/warehouses';
  method: RequestMethods = RequestMethods.GET;
  middleware?: [] | undefined;

  private useCase: GetWarehousesUseCase;

  constructor(useCase: GetWarehousesUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async executeImpl(_req: Request, res: Response): Promise<unknown> {
    try {
      const result = await this.useCase.execute();
      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case GetWarehousesErrors.WarehouseDoesntExists:
            return this.notFound(res, error.getErrorValue());
          default:
            return this.fail(res, error.getErrorValue());
        }
      }

      const warehouseDetails = result.value.getValue();
      return this.ok<GetWarehousesResponseDTO>(res, {
        warehouses: warehouseDetails ? warehouseDetails.map((warehouse) => WarehouseMap.toDTO(warehouse)) : [],
      });
    } catch (error) {
      return this.fail(res, error as Error);
    }
  }
}
