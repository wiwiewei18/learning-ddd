/* eslint-disable no-await-in-loop */
import { Either, left, right } from '../../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import { WarehouseName } from '../../../domain/warehouse/valueObjects/warehouseName';
import { Warehouse } from '../../../domain/warehouse/warehouse';
import { WarehouseRepo } from '../../../repos/warehouse/warehouseRepo/warehouseRepo';
import { CreateWarehouseErrors } from './createWarehouseErrors';
import { CreateWarehouseRequestDTO } from './createWarehouseRequestDTO';

type Response = Either<CreateWarehouseErrors.NameAlreadyTaken | SuccessOrFailure<any>, SuccessOrFailure<void>>;

export class CreateWarehouseUseCase implements UseCase<CreateWarehouseRequestDTO, Promise<Response>> {
  private warehouseRepo: WarehouseRepo;

  constructor(warehouseRepo: WarehouseRepo) {
    this.warehouseRepo = warehouseRepo;
  }

  async execute(request: CreateWarehouseRequestDTO): Promise<Response> {
    const searchedWarehouseByName = await this.warehouseRepo.getWarehouseByName(request.name);
    if (searchedWarehouseByName.isFound) {
      return left(new CreateWarehouseErrors.NameAlreadyTaken());
    }

    const warehouseNameOrError = WarehouseName.create(request.name);
    if (warehouseNameOrError.isFailure) {
      return left(Result.fail<WarehouseName>(warehouseNameOrError.getErrorValue()));
    }

    const warehouseName = warehouseNameOrError.getValue() as WarehouseName;

    const warehouseOrError = Warehouse.create({
      name: warehouseName,
      address: request.address,
      city: request.city,
      country: request.country,
      state: request.state,
      zipCode: request.zipCode,
    });
    if (warehouseOrError.isFailure) {
      return left(Result.fail<Warehouse>(warehouseOrError.getErrorValue()));
    }

    const warehouse = warehouseOrError.getValue() as Warehouse;

    await this.warehouseRepo.save(warehouse);

    return right(Result.ok<void>());
  }
}
