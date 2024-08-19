import { SuccessOrFailure } from '../../core/Result';
import { Email } from './email';

let emailOrError: SuccessOrFailure<Email>;
let email: Email;

describe('Email', () => {
  it('should be able to create email with valid email', () => {
    emailOrError = Email.create('test@test.com');
    expect(emailOrError.isSuccess).toBe(true);
  });

  it('should be fail to create email when the email provided is not valid', () => {
    emailOrError = Email.create('test');
    expect(emailOrError.isFailure).toBe(true);
  });

  it('should be formatted to lowercase string', () => {
    emailOrError = Email.create('Test@Test.com');
    email = emailOrError.getValue() as Email;
    expect(email.value).toBe('test@test.com');
  });
});
