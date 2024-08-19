import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { DomainEvent } from '../../../../../shared/domain/events/DomainEvent';
import { Warehouse } from '../warehouse';

export class WarehouseCreated implements DomainEvent {
  dateTimeOccurred: Date;
  warehouse: Warehouse;

  constructor(warehouse: Warehouse) {
    this.dateTimeOccurred = new Date();
    this.warehouse = warehouse;
  }

  getAggregateId(): UniqueEntityID {
    return this.warehouse.id;
  }
}
