import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { DomainEvent } from '../../../../../shared/domain/events/DomainEvent';
import { ProductVariant } from '../entities/productVariant/productVariant';
import { Product } from '../product';

export class ProductVariantCreated implements DomainEvent {
  dateTimeOccurred: Date;
  product: Product;
  productVariant: ProductVariant;

  constructor(product: Product, productVariant: ProductVariant) {
    this.dateTimeOccurred = new Date();
    this.product = product;
    this.productVariant = productVariant;
  }

  getAggregateId(): UniqueEntityID {
    return this.product.id;
  }
}
