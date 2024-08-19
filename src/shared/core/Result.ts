abstract class _Result<T> {
  protected error?: string;
  protected _value?: T;

  constructor(error?: string, _value?: T) {
    this.error = error;
    this._value = _value;
  }

  getErrorValue(): string {
    return this.error as string;
  }

  abstract getValue(): T | undefined;
}

export class SuccessOrFailureResult<T> extends _Result<T> {
  isSuccess: boolean;
  isFailure: boolean;

  constructor(isSuccess: boolean, error?: string, value?: T) {
    super(error, value);
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    Object.freeze(this);
  }

  getValue(): T | undefined {
    if (!this.isSuccess) {
      throw new Error(`Can't get the value of an error result`);
    }
    return this._value;
  }
}

class SearchResult<T> extends _Result<T> {
  isFound: boolean;
  isNotFound: boolean;

  constructor(isFound: boolean, error?: string, value?: T) {
    super(error, value);
    this.isFound = isFound;
    this.isNotFound = !isFound;
    Object.freeze(this);
  }

  getValue(): T | undefined {
    if (!this.isFound) {
      throw new Error(`Can't get the value of an not found result`);
    }
    return this._value;
  }
}

export class Result {
  private static createSuccessOrFailureResult<T>(success: boolean, error?: string, value?: T) {
    if (success && error) {
      throw new Error(`Invalid Operation: a result cannot be successful and contain an error`);
    }
    if (!success && !error) {
      throw new Error(`Invalid Operation: a failing result needs to contain an error message`);
    }
    return new SuccessOrFailureResult<T>(success, error, value);
  }

  private static createSearchResult<T>(found: boolean, error?: string, value?: T) {
    if (found && error) {
      throw new Error(`Invalid Operation: a result cannot be successful and contain an error`);
    }
    if (!found && !error) {
      throw new Error(`Invalid Operation: a failing result needs to contain an error message`);
    }
    return new SearchResult<T>(found, error, value);
  }

  static combineSuccessOrFailureResults<T>(results: SuccessOrFailureResult<T>[]): SuccessOrFailureResult<T> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok<T>() as SuccessOrFailureResult<T>;
  }

  static combineSearchResults<T>(results: SearchResult<T>[]): SearchResult<T> {
    for (const result of results) {
      if (result.isNotFound) return result;
    }
    return Result.found<T>() as SearchResult<T>;
  }

  static ok<T>(value?: T): SuccessOrFailureResult<T> {
    return Result.createSuccessOrFailureResult<T>(true, undefined, value);
  }

  static fail<T>(error: string): SuccessOrFailureResult<T> {
    return Result.createSuccessOrFailureResult<T>(false, error, undefined);
  }

  static found<T>(value?: T): SearchResult<T> {
    return Result.createSearchResult<T>(true, undefined, value);
  }

  static notFound<T>(error: string): SearchResult<T> {
    return Result.createSearchResult<T>(false, error, undefined);
  }
}

export type Maybe<T> = SearchResult<T>;

export type SuccessOrFailure<T> = SuccessOrFailureResult<T>;
