import { AfterBuyerCreated } from '../../subscriptions/afterBuyerCreated';
import { AfterSellerCreated } from '../../subscriptions/afterSellerCreated';
import { SendEmailVerificationUseCase } from '../../useCases/sendVerificationEmail/SendEmailVerificationUseCase';

export class NotificationSubscriptions {
  private sendEmailVerificationUseCase: SendEmailVerificationUseCase;

  constructor(sendEmailVerificationUseCase: SendEmailVerificationUseCase) {
    this.sendEmailVerificationUseCase = sendEmailVerificationUseCase;
  }

  setupSubscriptions() {
    new AfterBuyerCreated(this.sendEmailVerificationUseCase);
    new AfterSellerCreated(this.sendEmailVerificationUseCase);
  }
}
