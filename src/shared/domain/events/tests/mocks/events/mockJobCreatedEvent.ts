import { DomainEvent } from '../../../DomainEvent';
import { UniqueEntityID } from '../../../../UniqueEntityID';

export class MockJobCreatedEvent implements DomainEvent {
  dateTimeOccurred: Date;
  id: UniqueEntityID;

  constructor(id: UniqueEntityID) {
    this.id = id;
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.id;
  }
}
