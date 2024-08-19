import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { DomainEvent } from '../../../../../shared/domain/events/DomainEvent';
import { Product } from '../product';

export class ProductCreated implements DomainEvent {
  dateTimeOccurred: Date;
  product: Product;

  constructor(product: Product) {
    this.dateTimeOccurred = new Date();
    this.product = product;
  }

  getAggregateId(): UniqueEntityID {
    return this.product.id;
  }
}
