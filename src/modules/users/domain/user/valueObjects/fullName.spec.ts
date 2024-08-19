import { SuccessOrFailure } from '../../../../../shared/core/Result';
import { FullName } from './fullName';

let fullName: FullName;
let fullNameOrError: SuccessOrFailure<FullName>;

describe('FullName', () => {
  it('should be able to create full name based on first name and last name', () => {
    fullNameOrError = FullName.create({ firstName: 'john', lastName: 'doe' });
    expect(fullNameOrError.isSuccess).toBe(true);

    fullName = fullNameOrError.getValue() as FullName;
    expect(fullName.value).toBe('john doe');
  });

  it('should be able to create full name even though there is no last name', () => {
    fullNameOrError = FullName.create({ firstName: 'john' });
    fullName = fullNameOrError.getValue() as FullName;
    expect(fullName.value).toBe('john');
  });

  it('should be fail to create full name when the first name is provided with empty string', () => {
    fullNameOrError = FullName.create({ firstName: '' });
    expect(fullNameOrError.isFailure).toBe(true);
  });
});
