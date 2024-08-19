import { Maybe } from '../../../../../shared/core/Result';
import { Warehouse } from '../../../domain/warehouse/warehouse';
import { WarehouseId } from '../../../domain/warehouse/valueObjects/warehouseId';

export interface WarehouseRepo {
  exists(warehouseId: WarehouseId): Promise<boolean>;
  save(warehouse: Warehouse): Promise<void>;
  getWarehouseByName(name: string): Promise<Maybe<Warehouse>>;
  getAllWarehouses(): Promise<Warehouse[]>;
  delete(warehouseId: WarehouseId): Promise<void>;
}
