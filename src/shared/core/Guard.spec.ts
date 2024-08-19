import { Guard, GuardResponse } from './Guard';
import { SuccessOrFailureResult } from './Result';

describe('guard', () => {
  let result: SuccessOrFailureResult<GuardResponse> | null;
  const argName = 'testArgument';
  const secondaryArgName = 'secondaryTestArgument';

  beforeEach(() => {
    result = null;
  });

  describe('against null or undefined', () => {
    it('knows that value provided equates to success', () => {
      result = Guard.againstNullOrUndefined(true, argName);
      expect(result.isSuccess).toBeTruthy();
    });

    it('knows that null value equates to failure', () => {
      result = Guard.againstNullOrUndefined(null, argName);
      expect(result.isSuccess).toBeFalsy();
      expect(result.getErrorValue()).toEqual(`${argName} is null or undefined`);
    });

    it('knows that undefined value equates to failure', () => {
      result = Guard.againstNullOrUndefined(undefined, argName);
      expect(result.isSuccess).toBeFalsy();
      expect(result.getErrorValue()).toEqual(`${argName} is null or undefined`);
    });

    it('knows that empty string still equates to success', () => {
      result = Guard.againstNullOrUndefined('', argName);
      expect(result.isSuccess).toBeTruthy();
    });

    it('knows that false boolean type is equates to success', () => {
      result = Guard.againstNullOrUndefined(false, argName);
      expect(result.isSuccess).toBeTruthy();
    });
  });

  describe('against null or undefined bulk', () => {
    it('knows that values provided equates to success', () => {
      result = Guard.againstNullOrUndefinedBulk([
        { argumentName: argName, argument: true },
        { argumentName: secondaryArgName, argument: 12 },
      ]);
      expect(result.isSuccess).toBeTruthy();
    });

    it('knows that a single null value equates to failure', () => {
      result = Guard.againstNullOrUndefinedBulk([
        { argumentName: argName, argument: null },
        { argumentName: secondaryArgName, argument: 12 },
      ]);

      expect(result.isSuccess).toBeFalsy();
      expect(result.getErrorValue()).toEqual(`${argName} is null or undefined`);
    });

    it('knows that a single undefined value equates to failure', () => {
      result = Guard.againstNullOrUndefinedBulk([
        { argumentName: argName, argument: undefined },
        { argumentName: secondaryArgName, argument: 12 },
      ]);

      expect(result.isSuccess).toBeFalsy();
      expect(result.getErrorValue()).toEqual(`${argName} is null or undefined`);
    });
  });
});
