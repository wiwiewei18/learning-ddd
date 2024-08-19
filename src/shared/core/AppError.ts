import { logger } from '../infra/logger';
import { SuccessOrFailureResult } from './Result';
import { _UseCaseError } from './UseCaseError';

export namespace AppError {
  export class UnexpectedError extends SuccessOrFailureResult<_UseCaseError> {
    public constructor(err: unknown) {
      super(false, `An unexpected error occurred.`);
      logger.error(err, `Unexpected error occurred`);
    }

    public static create(err: unknown): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}
