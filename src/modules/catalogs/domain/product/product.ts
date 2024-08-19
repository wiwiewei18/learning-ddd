import { Either, left, right } from '../../../../shared/core/Either';
import { Guard } from '../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { CreateProductErrors } from '../../useCases/products/createProduct/createProductErrors';
import { StoreFrontId } from '../storeFront/valueObjects/storeFrontId';
import { ProductCategoryId } from './entities/productCategory/productCategoryId';
import { ProductVariant } from './entities/productVariant/productVariant';
import { ProductVariants } from './entities/productVariant/productVariants';
import { ProductVariantAttribute } from './entities/productVariant/valueObjects/variantAttribute';
import { ProductCreated } from './events/productCreated';
import { ProductVariantCreated } from './events/productVariantCreated';
import { BaseProductId } from './valueObjects/baseProductId';
import { BaseProductName } from './valueObjects/baseProductName';

export type AddVariantResult = Either<CreateProductErrors.DuplicateVariantAttributeOption, SuccessOrFailure<void>>;

interface ProductProps {
  name: BaseProductName;
  description: string;
  storeFrontId: StoreFrontId;
  productCategoryId: ProductCategoryId;
  imageCoverUrl: string;
  variants?: ProductVariants;
  createdAt?: Date;
  averageRating?: number;
  numSales?: number;
}

export class Product extends AggregateRoot<ProductProps> {
  get baseProductId(): BaseProductId {
    return BaseProductId.create(this._id).getValue() as BaseProductId;
  }

  get storeFrontId(): StoreFrontId {
    return this.props.storeFrontId;
  }

  get productCategoryId(): ProductCategoryId {
    return this.props.productCategoryId;
  }

  get name(): BaseProductName {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get imageCoverUrl(): string {
    return this.props.imageCoverUrl;
  }

  get averageRating(): number | undefined {
    return this.props.averageRating;
  }

  get numSales(): number | undefined {
    return this.props.numSales;
  }

  get variants(): ProductVariants | undefined {
    return this.props.variants;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  private constructor(props: ProductProps, id?: UniqueEntityID) {
    super(props, id);
  }

  addVariant(newVariant: ProductVariant): AddVariantResult {
    if (this.props.variants?.exists(newVariant)) {
      return left(
        new CreateProductErrors.DuplicateVariantAttributeOption(newVariant.attributes as ProductVariantAttribute[]),
      );
    }

    this.props.variants?.add(newVariant);
    this.addDomainEvent(new ProductVariantCreated(this, newVariant));
    return right(Result.ok<void>());
  }

  static create(props: ProductProps, id?: UniqueEntityID): SuccessOrFailure<Product> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.productCategoryId,
        argumentName: 'productCategoryId',
      },
      {
        argument: props.description,
        argumentName: 'description',
      },
      {
        argument: props.name,
        argumentName: 'name',
      },
      {
        argument: props.storeFrontId,
        argumentName: 'storeFrontId',
      },
      {
        argument: props.imageCoverUrl,
        argumentName: 'imageCoverUrl',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Product>(guardResult.getErrorValue());
    }

    const isNewProduct = !!id === false;

    const product = new Product(
      {
        ...props,
        variants: props.variants ? props.variants : ProductVariants.create([]),
        createdAt: props.createdAt ? props.createdAt : new Date(),
        averageRating: props.averageRating ? props.averageRating : 0,
        numSales: props.numSales ? props.numSales : 0,
      },
      id,
    );

    if (isNewProduct) {
      product.addDomainEvent(new ProductCreated(product));
    }

    return Result.ok<Product>(product);
  }
}
