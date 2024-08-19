import { AppError } from '../../../../../shared/core/AppError';
import { Either, left, right } from '../../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import { Warehouse } from '../../../domain/warehouse/warehouse';
import { WarehouseRepo } from '../../../repos/warehouse/warehouseRepo/warehouseRepo';
import { GetWarehousesErrors } from './getWarehousesErrors';

type Response = Either<AppError.UnexpectedError | GetWarehousesErrors.WarehouseDoesntExists, SuccessOrFailure<Warehouse[]>>;

export class GetWarehousesUseCase implements UseCase<null, Promise<Response>> {
  private warehouseRepo: WarehouseRepo;

  constructor(warehouseRepo: WarehouseRepo) {
    this.warehouseRepo = warehouseRepo;
  }

  async execute(): Promise<Response> {
    try {
      const warehouses = await this.warehouseRepo.getAllWarehouses();

      if (!warehouses.length) {
        return left(new GetWarehousesErrors.WarehouseDoesntExists());
      }

      return right(Result.ok<Warehouse[]>(warehouses));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
