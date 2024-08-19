import { Maybe, Result } from '../../../../shared/core/Result';
import { StoreFront } from '../../domain/storeFront/storeFront';
import { StoreFrontId } from '../../domain/storeFront/valueObjects/storeFrontId';
import { StoreFrontMap } from '../../mappers/storeFrontMap';
import { StoreFrontRepo } from './storeFrontRepo';

export class SequelizeStoreFrontRepo implements StoreFrontRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  private createBaseQuery(): any {
    return {
      where: {},
      include: [{ model: this.models.Store, as: 'Store' }],
    };
  }

  async exists(storeFrontId: StoreFrontId): Promise<boolean> {
    const storeFront = await this.models.StoreFront.findOne({ where: { store_front_id: storeFrontId.getStringValue() } });
    return !!storeFront === true;
  }

  async save(storeFront: StoreFront): Promise<void> {
    const rawStoreFront = StoreFrontMap.toPersistence(storeFront);
    const sequelizeStoreFront = await this.models.StoreFront.findOne({
      where: { store_front_id: storeFront.storeFrontId.getStringValue() },
    });

    if (sequelizeStoreFront) {
      rawStoreFront.updated_at = new Date();
      Object.assign(sequelizeStoreFront, rawStoreFront);
      await sequelizeStoreFront.save();
    } else {
      await this.models.StoreFront.create(rawStoreFront);
    }
  }

  async getStoreFrontById(storeFrontId: string): Promise<Maybe<StoreFront>> {
    const baseQuery = this.createBaseQuery();
    baseQuery.where = {
      store_front_id: storeFrontId,
    };

    const rawStoreFront = await this.models.StoreFront.findOne(baseQuery);

    if (!rawStoreFront) {
      return Result.notFound<StoreFront>(`Store Front with id ${storeFrontId} not found`);
    }

    return Result.found<StoreFront>(StoreFrontMap.toDomain(rawStoreFront));
  }

  async getStoreFrontByName(name: string): Promise<Maybe<StoreFront>> {
    const baseQuery = this.createBaseQuery();
    baseQuery.include[0].where = {
      name,
    };
    const sequelizeStoreFront = await this.models.StoreFront.findOne(baseQuery);
    if (!sequelizeStoreFront) {
      return Result.notFound<StoreFront>(`Store front with name ${name} not found`);
    }
    return Result.found<StoreFront>(StoreFrontMap.toDomain(sequelizeStoreFront));
  }
}
