import { DomainEventHandle } from '../../../shared/domain/events/DomainEventHandle';
import { DomainEvents } from '../../../shared/domain/events/DomainEvents';
import { logger } from '../../../shared/infra/logger';
import { StoreCreated } from '../../users/domain/store/events/storeCreated';
import { CreateStoreFrontUseCase } from '../useCases/storeFront/createStoreFront/createStoreFrontUseCase';

export class AfterStoreCreated implements DomainEventHandle {
  private createStoreFront: CreateStoreFrontUseCase;

  constructor(createStoreFront: CreateStoreFrontUseCase) {
    this.setupSubscriptions();
    this.createStoreFront = createStoreFront;
  }

  setupSubscriptions(): void {
    DomainEvents.register((event) => this.onStoreCreated(event as StoreCreated), StoreCreated.name);
  }

  private async onStoreCreated(event: StoreCreated): Promise<void> {
    const { store } = event;

    try {
      const result = await this.createStoreFront.execute({ storeId: store.storeId.getStringValue() });

      if (result.isLeft()) {
        throw new Error(result.value.getErrorValue());
      }

      logger.info(`Success to execute CreateStoreFront use case AfterStoreCreated`);
    } catch (error) {
      logger.error(error, `Failed to execute CreateStoreFront use case AfterStoreCreated`);
    }
  }
}
