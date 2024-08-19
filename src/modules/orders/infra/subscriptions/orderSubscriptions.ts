import { AfterBuyerEmailVerified } from '../../subscriptions/afterBuyerEmailVerified';
import { CreateBuyerUseCase } from '../../useCases/buyer/createBuyer/createBuyerUseCase';

export class OrderSubscriptions {
  private createBuyerUseCase: CreateBuyerUseCase;

  constructor(createBuyerUseCase: CreateBuyerUseCase) {
    this.createBuyerUseCase = createBuyerUseCase;
  }

  setupSubscriptions() {
    new AfterBuyerEmailVerified(this.createBuyerUseCase);
  }
}
