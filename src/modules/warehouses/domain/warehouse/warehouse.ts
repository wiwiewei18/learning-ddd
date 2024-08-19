import { Guard } from '../../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { WarehouseCreated } from './events/warehouseCreated';
import { WarehouseId } from './valueObjects/warehouseId';
import { WarehouseName } from './valueObjects/warehouseName';

interface WarehouseProps {
  name: WarehouseName;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  createdAt?: Date;
}

export class Warehouse extends AggregateRoot<WarehouseProps> {
  get warehouseId(): WarehouseId {
    return WarehouseId.create(this._id).getValue() as WarehouseId;
  }

  get name(): WarehouseName {
    return this.props.name;
  }

  get address(): string {
    return this.props.address;
  }

  get country(): string {
    return this.props.country;
  }

  get state(): string {
    return this.props.state;
  }

  get city(): string {
    return this.props.city;
  }

  get zipCode(): string {
    return this.props.zipCode;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  private constructor(props: WarehouseProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: WarehouseProps, id?: UniqueEntityID): SuccessOrFailure<Warehouse> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.name,
        argumentName: 'name',
      },
      {
        argument: props.address,
        argumentName: 'address',
      },
      {
        argument: props.country,
        argumentName: 'country',
      },
      {
        argument: props.state,
        argumentName: 'state',
      },
      {
        argument: props.city,
        argumentName: 'city',
      },
      {
        argument: props.zipCode,
        argumentName: 'zipCode',
      },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Warehouse>(guardResult.getErrorValue());
    }

    const isNewWarehouse = !!id === false;

    const warehouse = new Warehouse(
      {
        ...props,
        createdAt: props.createdAt ? props.createdAt : new Date(),
      },
      id,
    );

    if (isNewWarehouse) {
      warehouse.addDomainEvent(new WarehouseCreated(warehouse));
    }

    return Result.ok<Warehouse>(warehouse);
  }
}
