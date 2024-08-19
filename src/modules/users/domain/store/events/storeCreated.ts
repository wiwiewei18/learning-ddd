import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { DomainEvent } from '../../../../../shared/domain/events/DomainEvent';
import { Store } from '../store';

export class StoreCreated implements DomainEvent {
  dateTimeOccurred: Date;
  store: Store;

  constructor(store: Store) {
    this.dateTimeOccurred = new Date();
    this.store = store;
  }

  getAggregateId(): UniqueEntityID {
    return this.store.id;
  }
}
