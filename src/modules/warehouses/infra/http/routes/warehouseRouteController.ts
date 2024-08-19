import models from '../../../../../shared/infra/database/sequelize/models';
import { Middleware } from '../../../../../shared/infra/http/utils/Middleware';
import { SequelizeWarehouseRepo } from '../../../repos/warehouse/warehouseRepo/sequelizeWarehouseRepo';
import { WarehouseRepo } from '../../../repos/warehouse/warehouseRepo/warehouseRepo';
import { CreateWarehouseController } from '../../../useCases/warehouse/createWarehouse/createWarehouseController';
import { CreateWarehouseUseCase } from '../../../useCases/warehouse/createWarehouse/createWarehouseUseCase';
import { GetWarehousesController } from '../../../useCases/warehouse/getWarehouses/getWarehousesController';
import { GetWarehousesUseCase } from '../../../useCases/warehouse/getWarehouses/getWarehousesUseCase';

type WarehouseRouteControllerConfig = {
  isTesting: boolean;
};

export class WarehouseRouteController {
  private warehouseRepo: WarehouseRepo;
  private middleware: Middleware;

  constructor(
    private config: WarehouseRouteControllerConfig,
    middleware: Middleware,
  ) {
    this.warehouseRepo = this.getWarehouseRepo();
    this.middleware = middleware;
  }

  getControllers() {
    return [this.createCreateWarehouseController(), this.createGetWarehousesController()];
  }

  private getWarehouseRepo() {
    if (!this.warehouseRepo) {
      this.warehouseRepo = this.config.isTesting ? new SequelizeWarehouseRepo(models) : new SequelizeWarehouseRepo(models);
    }

    return this.warehouseRepo;
  }

  private createCreateWarehouseController() {
    return new CreateWarehouseController(this.createCreateWarehouseUseCase(), [this.middleware.createFormDataParser()]);
  }

  private createCreateWarehouseUseCase() {
    return new CreateWarehouseUseCase(this.warehouseRepo);
  }

  private createGetWarehousesController() {
    return new GetWarehousesController(this.createGetWarehousesUseCase());
  }

  private createGetWarehousesUseCase() {
    return new GetWarehousesUseCase(this.warehouseRepo);
  }
}
