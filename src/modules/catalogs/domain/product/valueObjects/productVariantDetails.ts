import { Guard } from '../../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { ProductVariantId } from '../entities/productVariant/valueObjects/productVariantId';
import { ProductVariantName } from '../entities/productVariant/valueObjects/productVariantName';
import { BaseProductId } from './baseProductId';
import { ProductPrice } from './productPrice';

interface ProductVariantDetailsProps {
  productVariantId: ProductVariantId;
  baseProductId: BaseProductId;
  thumbnailImageUrl: string;
  name: ProductVariantName;
  averageRating: number;
  numSales: number;
  price: ProductPrice;
}

export class ProductVariantDetails extends ValueObject<ProductVariantDetailsProps> {
  get productVariantId(): ProductVariantId {
    return this.props.productVariantId;
  }

  get baseProductId(): BaseProductId {
    return this.props.baseProductId;
  }

  get thumbnailImageUrl(): string {
    return this.props.thumbnailImageUrl;
  }

  get name(): ProductVariantName {
    return this.props.name;
  }

  get averageRating(): number {
    return this.props.averageRating;
  }

  get numSales(): number {
    return this.props.numSales;
  }

  get price(): ProductPrice {
    return this.props.price;
  }

  private constructor(props: ProductVariantDetailsProps) {
    super(props);
  }

  static create(props: ProductVariantDetailsProps): SuccessOrFailure<ProductVariantDetails> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.productVariantId,
        argumentName: 'productVariantId',
      },
      {
        argument: props.baseProductId,
        argumentName: 'baseProductId',
      },
      {
        argument: props.thumbnailImageUrl,
        argumentName: 'thumbnailImageUrl',
      },
      {
        argument: props.name,
        argumentName: 'name',
      },
      {
        argument: props.averageRating,
        argumentName: 'averageRating',
      },
      {
        argument: props.numSales,
        argumentName: 'numSales',
      },
      {
        argument: props.price,
        argumentName: 'price',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<ProductVariantDetails>(guardResult.getErrorValue());
    }

    return Result.ok<ProductVariantDetails>(new ProductVariantDetails(props));
  }
}
