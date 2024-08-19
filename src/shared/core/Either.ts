class Left<TLeftValue, TRightValue> {
  readonly value: TLeftValue;

  constructor(value: TLeftValue) {
    this.value = value;
  }

  isLeft(): this is Left<TLeftValue, TRightValue> {
    return true;
  }

  isRight(): this is Right<TLeftValue, TRightValue> {
    return false;
  }
}

class Right<TLeftValue, TRightValue> {
  readonly value: TRightValue;

  constructor(value: TRightValue) {
    this.value = value;
  }

  isLeft(): this is Left<TLeftValue, TRightValue> {
    return false;
  }

  isRight(): this is Right<TLeftValue, TRightValue> {
    return true;
  }
}

export type Either<TLeftValue, TRightValue> = Left<TLeftValue, TRightValue> | Right<TLeftValue, TRightValue>;

export const left = <TLeftValue, TRightValue>(leftValue: TLeftValue): Either<TLeftValue, TRightValue> => {
  return new Left(leftValue);
};

export const right = <TLeftValue, TRightValue>(rightValue: TRightValue): Either<TLeftValue, TRightValue> => {
  return new Right<TLeftValue, TRightValue>(rightValue);
};
