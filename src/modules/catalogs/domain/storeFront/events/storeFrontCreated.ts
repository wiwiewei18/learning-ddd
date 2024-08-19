import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { DomainEvent } from '../../../../../shared/domain/events/DomainEvent';
import { StoreFront } from '../storeFront';

export class StoreFrontCreated implements DomainEvent {
  dateTimeOccurred: Date;
  storeFront: StoreFront;

  constructor(storeFront: StoreFront) {
    this.dateTimeOccurred = new Date();
    this.storeFront = storeFront;
  }

  getAggregateId(): UniqueEntityID {
    return this.storeFront.id;
  }
}
