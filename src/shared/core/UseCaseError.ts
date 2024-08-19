interface UseCaseError {
  message: string;
}

export abstract class _UseCaseError implements UseCaseError {
  public readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
