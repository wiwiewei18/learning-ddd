import { DomainEventHandle } from '../../../shared/domain/events/DomainEventHandle';
import { DomainEvents } from '../../../shared/domain/events/DomainEvents';
import { logger } from '../../../shared/infra/logger';
import { BuyerEmailVerified } from '../../users/domain/user/events/buyerEmailVerified';
import { CreateBuyerUseCase } from '../useCases/buyer/createBuyer/createBuyerUseCase';

export class AfterBuyerEmailVerified implements DomainEventHandle {
  private createBuyerUseCase: CreateBuyerUseCase;

  constructor(createBuyerUseCase: CreateBuyerUseCase) {
    this.setupSubscriptions();
    this.createBuyerUseCase = createBuyerUseCase;
  }

  setupSubscriptions(): void {
    DomainEvents.register((event) => this.onBuyerEmailVerified(event as BuyerEmailVerified), BuyerEmailVerified.name);
  }

  private async onBuyerEmailVerified(event: BuyerEmailVerified): Promise<void> {
    const { user } = event;

    try {
      const result = await this.createBuyerUseCase.execute({ userId: user.userId.getStringValue() });

      if (result.isLeft()) {
        throw new Error(result.value.getErrorValue());
      }

      logger.info(`Success to execute createBuyerUseCase AfterBuyerEmailCreated`);
    } catch (error) {
      logger.error(error, `Failed to execute createBuyerUseCase AfterBuyerEmailCreated`);
    }
  }
}
