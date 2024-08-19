import { UniqueEntityID } from '../../../../domain/UniqueEntityID';
import { DomainEvents } from '../../../../domain/events/DomainEvents';
import { logger } from '../../../logger';
import models from '../models';

const dispatchEventsCallback = (model: any, primaryKeyField: string) => {
  const aggregateId = new UniqueEntityID(model[primaryKeyField]);
  DomainEvents.dispatchEventsForAggregate(aggregateId);
};

export async function createHooksForAggregateRoots() {
  const { Buyer, User, Store } = models;

  User.addHook('afterCreate', (m: any) => dispatchEventsCallback(m, 'user_id'));
  User.addHook('afterDestroy', (m: any) => dispatchEventsCallback(m, 'user_id'));
  User.addHook('afterUpdate', (m: any) => dispatchEventsCallback(m, 'user_id'));
  User.addHook('afterSave', (m: any) => dispatchEventsCallback(m, 'user_id'));
  User.addHook('afterUpsert', (m: any) => dispatchEventsCallback(m, 'user_id'));

  Buyer.addHook('afterCreate', (m: any) => dispatchEventsCallback(m, 'buyer_id'));
  Buyer.addHook('afterDestroy', (m: any) => dispatchEventsCallback(m, 'buyer_id'));
  Buyer.addHook('afterUpdate', (m: any) => dispatchEventsCallback(m, 'buyer_id'));
  Buyer.addHook('afterSave', (m: any) => dispatchEventsCallback(m, 'buyer_id'));
  Buyer.addHook('afterUpsert', (m: any) => dispatchEventsCallback(m, 'buyer_id'));

  Store.addHook('afterCreate', (m: any) => dispatchEventsCallback(m, 'store_id'));
  Store.addHook('afterDestroy', (m: any) => dispatchEventsCallback(m, 'store_id'));
  Store.addHook('afterUpdate', (m: any) => dispatchEventsCallback(m, 'store_id'));
  Store.addHook('afterSave', (m: any) => dispatchEventsCallback(m, 'store_id'));
  Store.addHook('afterUpsert', (m: any) => dispatchEventsCallback(m, 'store_id'));

  logger.info(`Sequelize hooks setup completed`);
}
