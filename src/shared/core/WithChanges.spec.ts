import { Result } from './Result';
import { Changes } from './WithChanges';

describe('Changes', () => {
  let changes: Changes;

  beforeEach(() => {
    changes = new Changes();
  });

  it('should create an empty list of changes', () => {
    expect(changes.getCombinedChangesResult()).toEqual(Result.ok());
  });

  test('when success changes added, then combined changes result should success', () => {
    const change = Result.ok('some change');
    changes.addChange(change);

    expect(changes.getCombinedChangesResult().isSuccess).toBe(true);
  });

  it('when there is one failed changes, then combined changes result should be failure', () => {
    const change1 = Result.ok('change 1');
    const change2 = Result.fail('change 2 failed');
    const change3 = Result.ok('change 3');
    changes.addChange(change1);
    changes.addChange(change2);
    changes.addChange(change3);

    const expected = Result.fail('change 2 failed');

    expect(changes.getCombinedChangesResult().isFailure).toBe(true);
    expect(changes.getCombinedChangesResult()).toEqual(expected);
  });
});
