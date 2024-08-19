import { Maybe } from '../../../../shared/core/Result';
import { Buyer } from '../../domain/buyer/buyer';
import { BuyerId } from '../../domain/buyer/buyerId';

export interface BuyerRepo {
  exists(buyerId: BuyerId): Promise<boolean>;
  save(buyer: Buyer): Promise<void>;
  getBuyerByBaseUserId(id: string): Promise<Maybe<Buyer>>;
}
