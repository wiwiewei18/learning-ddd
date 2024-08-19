import { AfterStoreCreated } from '../../subscriptions/afterStoreCreated';
import { CreateStoreFrontUseCase } from '../../useCases/storeFront/createStoreFront/createStoreFrontUseCase';

export class CatalogSubscriptions {
  private createStoreFrontUseCase: CreateStoreFrontUseCase;

  constructor(createStoreFrontUseCase: CreateStoreFrontUseCase) {
    this.createStoreFrontUseCase = createStoreFrontUseCase;
  }

  setupSubscriptions() {
    new AfterStoreCreated(this.createStoreFrontUseCase);
  }
}
