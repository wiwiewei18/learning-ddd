import { DomainEventHandle } from '../../../shared/domain/events/DomainEventHandle';
import { DomainEvents } from '../../../shared/domain/events/DomainEvents';
import { logger } from '../../../shared/infra/logger';
import { BuyerCreated } from '../../users/domain/user/events/buyerCreated';
import { SendEmailVerificationUseCase } from '../useCases/sendVerificationEmail/SendEmailVerificationUseCase';

export class AfterBuyerCreated implements DomainEventHandle {
  private sendEmailVerificationUseCase: SendEmailVerificationUseCase;

  constructor(sendEmailVerificationUseCase: SendEmailVerificationUseCase) {
    this.setupSubscriptions();
    this.sendEmailVerificationUseCase = sendEmailVerificationUseCase;
  }

  setupSubscriptions(): void {
    DomainEvents.register((event) => this.onBuyerCreated(event as BuyerCreated), BuyerCreated.name);
  }

  private async onBuyerCreated(event: BuyerCreated): Promise<void> {
    const { user } = event;

    try {
      const result = await this.sendEmailVerificationUseCase.execute({
        userRole: user.role.value,
        emailVerificationToken: user.emailVerificationToken as string,
        recipientEmailAddress: user.email.value,
        recipientName: user.fullName.value,
      });

      if (result.isLeft()) {
        throw new Error(result.value.getErrorValue());
      }

      logger.info(`Success to execute SendEmailVerificationUseCase AfterBuyerCreated`);
    } catch (error) {
      logger.error(error, `Failed to execute SendEmailVerificationUseCase AfterBuyerCreated`);
    }
  }
}
