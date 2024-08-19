import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { DomainEvent } from '../../../../../shared/domain/events/DomainEvent';
import { User } from '../user';

export class BuyerCreated implements DomainEvent {
  dateTimeOccurred: Date;
  user: User;

  constructor(user: User) {
    this.dateTimeOccurred = new Date();
    this.user = user;
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}
