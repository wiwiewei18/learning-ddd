import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';

interface WarehouseNameProps {
  value: string;
}

export class WarehouseName extends ValueObject<WarehouseNameProps> {
  static maxLength = 70;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: WarehouseNameProps) {
    super(props);
  }

  static create(name: string): SuccessOrFailure<WarehouseName> {
    if (name.length > this.maxLength) {
      return Result.fail<WarehouseName>(`Warehouse name character shouldn't more than ${this.maxLength} chars`);
    }

    return Result.ok<WarehouseName>(new WarehouseName({ value: name }));
  }
}
