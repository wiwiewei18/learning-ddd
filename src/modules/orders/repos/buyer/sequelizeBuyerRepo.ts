import { Maybe, Result } from '../../../../shared/core/Result';
import { Buyer } from '../../domain/buyer/buyer';
import { BuyerId } from '../../domain/buyer/buyerId';
import { BuyerMap } from '../../mappers/buyerMap';
import { BuyerRepo } from './buyerRepo';

export class SequelizeBuyerRepo implements BuyerRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  private createBaseQuery(): any {
    return {
      where: {},
      include: [{ model: this.models.User, as: 'User' }],
    };
  }

  async save(buyer: Buyer): Promise<void> {
    const rawSequelizeBuyer = BuyerMap.toPersistence(buyer);
    const sequelizeBuyer = await this.models.Buyer.findOne({ where: { buyer_id: buyer.buyerId.getStringValue() } });

    if (sequelizeBuyer) {
      rawSequelizeBuyer.updated_at = new Date();
      Object.assign(sequelizeBuyer, rawSequelizeBuyer);
      await sequelizeBuyer.save();
    } else {
      await this.models.Buyer.create(rawSequelizeBuyer);
    }
  }

  async exists(buyerId: BuyerId): Promise<boolean> {
    const buyer = await this.models.Buyer.findOne({ where: { buyer_id: buyerId.getStringValue() } });
    return !!buyer === true;
  }

  async getBuyerByBaseUserId(id: string): Promise<Maybe<Buyer>> {
    const baseQuery = this.createBaseQuery();
    baseQuery.where = {
      base_user_id: id,
    };

    const buyer = await this.models.Buyer.findOne(baseQuery);
    if (!buyer) {
      return Result.notFound(`Buyer with base user id ${id} not found`);
    }
    return Result.found(BuyerMap.toDomain(buyer));
  }
}
