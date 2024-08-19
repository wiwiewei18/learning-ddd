import { SuccessOrFailure } from '../../../shared/core/Result';
import { EmailVerificationUrl } from './emailVerificationUrl';

let emailVerificationUrlOrError: SuccessOrFailure<EmailVerificationUrl>;

describe('EmailVerificationUrl', () => {
  it('should be able to create email verification url with frontend url and token', () => {
    emailVerificationUrlOrError = EmailVerificationUrl.create({
      emailVerificationToken: '123',
      frontendUrl: 'https://test.com/verify-email',
    });

    expect(emailVerificationUrlOrError.isSuccess).toBe(true);
  });
});
