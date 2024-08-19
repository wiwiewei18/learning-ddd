import { DomainEventHandle } from '../../../shared/domain/events/DomainEventHandle';
import { DomainEvents } from '../../../shared/domain/events/DomainEvents';
import { logger } from '../../../shared/infra/logger';
import { SellerCreated } from '../../users/domain/user/events/sellerCreated';
import { SendEmailVerificationUseCase } from '../useCases/sendVerificationEmail/SendEmailVerificationUseCase';

export class AfterSellerCreated implements DomainEventHandle {
  private sendEmailVerificationUseCase: SendEmailVerificationUseCase;

  constructor(sendEmailVerificationUseCase: SendEmailVerificationUseCase) {
    this.setupSubscriptions();
    this.sendEmailVerificationUseCase = sendEmailVerificationUseCase;
  }

  setupSubscriptions(): void {
    DomainEvents.register((event) => this.onSellerCreated(event as SellerCreated), SellerCreated.name);
  }

  private async onSellerCreated(event: SellerCreated): Promise<void> {
    const { user } = event;

    try {
      const result = await this.sendEmailVerificationUseCase.execute({
        userRole: user.role.value,
        emailVerificationToken: user.emailVerificationToken as string,
        recipientEmailAddress: user.email.value,
        recipientName: user.fullName.value,
      });

      if (result.isLeft()) {
        // todo: retry mechanism or some sort to handle error between chaining event
        throw new Error(result.value.getErrorValue());
      }

      logger.info(`Success to execute SendEmailVerificationUseCase AfterSellerCreated`);
    } catch (error) {
      logger.error(error, `Failed to execute SendEmailVerificationUseCase AfterSellerCreated`);
    }
  }
}
