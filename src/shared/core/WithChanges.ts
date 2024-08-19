import { Result, SuccessOrFailureResult } from './Result';

export class Changes {
  private changes: SuccessOrFailureResult<unknown>[];

  constructor() {
    this.changes = [];
  }

  public addChange(result: SuccessOrFailureResult<unknown>): void {
    this.changes.push(result);
  }

  public getCombinedChangesResult(): SuccessOrFailureResult<unknown> {
    return Result.combineSuccessOrFailureResults(this.changes);
  }
}

export interface WithChanges {
  changes: Changes;
}
