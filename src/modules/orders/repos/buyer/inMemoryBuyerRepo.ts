import { Maybe, Result } from '../../../../shared/core/Result';
import { UserPersistenceDTO } from '../../../users/dtos/userDTO';
import { Buyer } from '../../domain/buyer/buyer';
import { BuyerId } from '../../domain/buyer/buyerId';
import { BuyerMap } from '../../mappers/buyerMap';
import { BuyerRepo } from './buyerRepo';

export class InMemoryBuyerRepo implements BuyerRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async exists(buyerId: BuyerId): Promise<boolean> {
    for (const buyer of this.models.Buyer) {
      if (buyer.buyer_id === buyerId.getStringValue()) {
        return true;
      }
    }
    return false;
  }

  async save(buyer: Buyer): Promise<void> {
    if (!(await this.exists(buyer.buyerId))) {
      const rawBuyer = BuyerMap.toPersistence(buyer);

      rawBuyer.User = this.models.User.find((b: UserPersistenceDTO) => b.user_id === buyer.baseUserId.getStringValue());

      this.models.Buyer.push(rawBuyer);
    }
  }

  async getBuyerByBaseUserId(id: string): Promise<Maybe<Buyer>> {
    for (const buyer of this.models.Buyer) {
      if (buyer.User.user_id === id) {
        return Result.found(BuyerMap.toDomain(buyer));
      }
    }
    return Result.notFound(`Buyer with base user id ${id} not found`);
  }
}
