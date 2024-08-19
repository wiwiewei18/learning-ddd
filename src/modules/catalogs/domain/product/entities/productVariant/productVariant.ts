import { Guard } from '../../../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../../../shared/core/Result';
import { Entity } from '../../../../../../shared/domain/Entity';
import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { BaseProductId } from '../../valueObjects/baseProductId';
import { ProductPrice } from '../../valueObjects/productPrice';
import { ProductVariantId } from './valueObjects/productVariantId';
import { ProductVariantAttribute } from './valueObjects/variantAttribute';

export type VariantImageUrls = {
  regularImageUrl: string;
  thumbnailImageUrl: string;
};

export type VariantImageBuffers = {
  regularImageBuffer: Buffer;
  thumbnailImageBuffer: Buffer;
};

interface ProductVariantProps {
  baseProductId: BaseProductId;
  price: ProductPrice;
  stock: number;
  isDefault: boolean;
  attributes?: ProductVariantAttribute[];
  thumbnailImageUrl?: string;
  regularImageUrl?: string;
  isActive?: boolean;
  createdAt?: Date | string;
  averageRating?: number;
  numSales?: number;
}

export class ProductVariant extends Entity<ProductVariantProps> {
  static maxAttributesLength = 2;

  get productVariantId(): ProductVariantId {
    return ProductVariantId.create(this._id).getValue() as ProductVariantId;
  }

  get baseProductId(): BaseProductId {
    return this.props.baseProductId;
  }

  get attributes(): ProductVariantAttribute[] | undefined {
    return this.props.attributes;
  }

  get thumbnailImageUrl(): string | undefined {
    return this.props.thumbnailImageUrl;
  }

  get regularImageUrl(): string | undefined {
    return this.props.regularImageUrl;
  }

  get price(): ProductPrice {
    return this.props.price;
  }

  get stock(): number {
    return this.props.stock;
  }

  get isActive(): boolean | undefined {
    return this.props.isActive;
  }

  get isDefault(): boolean {
    return this.props.isDefault;
  }

  get createdAt(): Date | string | undefined {
    return this.props.createdAt;
  }

  get averageRating(): number | undefined {
    return this.props.averageRating;
  }

  get numSales(): number | undefined {
    return this.props.numSales;
  }

  private constructor(props: ProductVariantProps, id?: UniqueEntityID) {
    super(props, id);
  }

  setAsDefault(): void {
    this.props.isDefault = true;
  }

  unsetAsDefault(): void {
    this.props.isDefault = false;
  }

  static create(props: ProductVariantProps, id?: UniqueEntityID): SuccessOrFailure<ProductVariant> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.baseProductId,
        argumentName: 'baseProductId',
      },
      {
        argument: props.price,
        argumentName: 'price',
      },
      {
        argument: props.stock,
        argumentName: 'stock',
      },
      {
        argument: props.isDefault,
        argumentName: 'isDefault',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<ProductVariant>(guardResult.getErrorValue());
    }

    if (props.attributes && props.attributes.length > this.maxAttributesLength) {
      return Result.fail<ProductVariant>(`Max attribute for product variant is ${this.maxAttributesLength}`);
    }

    return Result.ok<ProductVariant>(
      new ProductVariant(
        {
          ...props,
          attributes: props.attributes ? props.attributes : [],
          isActive: props.isActive ? props.isActive : true,
          createdAt: props.createdAt ? props.createdAt : new Date(),
          averageRating: props.averageRating ? props.averageRating : 0,
          numSales: props.numSales ? props.numSales : 0,
        },
        id,
      ),
    );
  }
}
