import { Guard } from '../../../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../../../shared/core/Result';
import { Entity } from '../../../../../../shared/domain/Entity';
import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { ProductCategoryId } from './productCategoryId';
import { ProductCategoryCode } from './valueObjects/productCategoryCode';
import { ProductCategoryName } from './valueObjects/productCategoryName';

interface ProductCategoryProps {
  name: ProductCategoryName;
  code: ProductCategoryCode;
  parentProductCategoryId?: ProductCategoryId;
}

export class ProductCategory extends Entity<ProductCategoryProps> {
  get productCategoryId(): ProductCategoryId {
    return ProductCategoryId.create(this._id).getValue() as ProductCategoryId;
  }

  get name(): ProductCategoryName {
    return this.props.name;
  }

  get code(): ProductCategoryCode {
    return this.props.code;
  }

  get parentProductCategoryId(): ProductCategoryId {
    return this.props.parentProductCategoryId as ProductCategoryId;
  }

  private constructor(props: ProductCategoryProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: ProductCategoryProps, id?: UniqueEntityID): SuccessOrFailure<ProductCategory> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.name,
        argumentName: 'name',
      },
      {
        argument: props.code,
        argumentName: 'code',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<ProductCategory>(guardResult.getErrorValue());
    }

    return Result.ok<ProductCategory>(new ProductCategory(props, id));
  }
}
