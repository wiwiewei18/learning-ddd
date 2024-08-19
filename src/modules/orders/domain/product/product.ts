import { Guard } from '../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { ProductVariantId } from '../../../catalogs/domain/product/entities/productVariant/valueObjects/productVariantId';
import { ProductId } from './productId';

interface ProductProps {
  // todo
  /**
   * this base product id should be not tight to the only product variant,
   *
   * for example when there is tuition,
   * the tuition id also be placed to baseProductId in order module context
   */
  baseProductId: ProductVariantId;
  name: string;
  stock: number;
}

export class Product extends AggregateRoot<ProductProps> {
  get productId(): ProductId {
    return ProductId.create(this._id).getValue() as ProductId;
  }

  get baseProductId(): ProductVariantId {
    return this.props.baseProductId;
  }

  get name(): string {
    return this.props.name;
  }

  get stock(): number {
    return this.props.stock;
  }

  private constructor(props: ProductProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: ProductProps, id?: UniqueEntityID): SuccessOrFailure<Product> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.baseProductId,
        argumentName: 'baseProductId',
      },
      {
        argument: props.name,
        argumentName: 'name',
      },
      {
        argument: props.stock,
        argumentName: 'stock',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getErrorValue());
    }

    return Result.ok<Product>(new Product(props, id));
  }
}
