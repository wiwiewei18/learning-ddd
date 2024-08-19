import { Maybe, Result } from '../../../../../shared/core/Result';
import { WarehouseId } from '../../../domain/warehouse/valueObjects/warehouseId';
import { Warehouse } from '../../../domain/warehouse/warehouse';
import { WarehousePersistenceDTO } from '../../../dtos/warehouseDTO';
import { WarehouseMap } from '../../../mappers/warehouseMap';
import { WarehouseRepo } from './warehouseRepo';

export class SequelizeWarehouseRepo implements WarehouseRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async exists(warehouseId: WarehouseId): Promise<boolean> {
    const warehouse = await this.models.Warehouse.findOne({ where: { warehouse_id: warehouseId.getStringValue() } });
    return !!warehouse === true;
  }

  async getWarehouseByName(name: string): Promise<Maybe<Warehouse>> {
    const warehouseModel = this.models.Warehouse;
    const rawWarehouse = await warehouseModel.findOne({ where: { name } });

    if (!rawWarehouse) {
      return Result.notFound<Warehouse>(`Warehouse with name ${name} not found`);
    }

    return Result.found<Warehouse>(WarehouseMap.toDomain(rawWarehouse));
  }

  async save(warehouse: Warehouse): Promise<void> {
    const warehouseModel = this.models.Warehouse;
    const rawSequelizeWarehouse = WarehouseMap.toPersistence(warehouse);

    const sequelizeWarehouse = await warehouseModel.findOne({
      where: { warehouse_id: warehouse.warehouseId.getStringValue() },
    });
    const isNewWarehouse = !sequelizeWarehouse;

    if (isNewWarehouse) {
      try {
        await warehouseModel.create(rawSequelizeWarehouse);
      } catch (error) {
        await this.delete(warehouse.warehouseId);
        throw error;
      }
    } else {
      rawSequelizeWarehouse.updated_at = new Date();
      Object.assign(sequelizeWarehouse, rawSequelizeWarehouse);
      await sequelizeWarehouse.save();
    }
  }

  async delete(warehouseId: WarehouseId): Promise<void> {
    await this.models.Warehouse.destroy({ where: { warehouse_id: warehouseId.getStringValue() } });
  }

  async getAllWarehouses(): Promise<Warehouse[]> {
    const warehouses = await this.models.Warehouse.findAll();

    return warehouses.map((warehouse: WarehousePersistenceDTO) => WarehouseMap.toDomain(warehouse));
  }
}
