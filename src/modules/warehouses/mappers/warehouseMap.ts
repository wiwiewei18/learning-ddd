import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { logger } from '../../../shared/infra/logger';
import { Warehouse } from '../domain/warehouse/warehouse';
import { WarehousePersistenceDTO, WarehousePublicDTO } from '../dtos/warehouseDTO';
import { WarehouseName } from '../domain/warehouse/valueObjects/warehouseName';

export class WarehouseMap {
  static toDomain(raw: WarehousePersistenceDTO): Warehouse {
    const name = WarehouseName.create(raw.name).getValue() as WarehouseName;

    const warehouseOrError = Warehouse.create(
      {
        name,
        address: raw.address,
        country: raw.country,
        state: raw.state,
        city: raw.city,
        zipCode: raw.zip_code,
      },
      new UniqueEntityID(raw.warehouse_id),
    );

    if (warehouseOrError.isFailure) {
      logger.error(warehouseOrError.getErrorValue());
      throw new Error();
    }

    return warehouseOrError.getValue() as Warehouse;
  }

  static toPersistence(warehouse: Warehouse): WarehousePersistenceDTO {
    return {
      warehouse_id: warehouse.warehouseId.getStringValue(),
      name: warehouse.name.value,
      address: warehouse.address,
      country: warehouse.country,
      state: warehouse.state,
      city: warehouse.city,
      zip_code: warehouse.zipCode,
    };
  }

  static toDTO(warehouse: Warehouse): WarehousePublicDTO {
    return {
      name: warehouse.name.value,
      address: warehouse.address,
      country: warehouse.country,
      state: warehouse.state,
      city: warehouse.city,
      zipCode: warehouse.zipCode,
    };
  }
}
