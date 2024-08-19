import { SuccessOrFailure } from '../../../shared/core/Result';
import { Email } from './email';
import { EmailAddress } from './emailAddress';
import { EmailBody } from './emailBody';

let emailOrError: SuccessOrFailure<Email>;

describe('Email', () => {
  it('should be able to create email', () => {
    const recipientAddress = EmailAddress.create('test@test.com').getValue() as EmailAddress;
    const senderAddress = EmailAddress.create('test1@test.com').getValue() as EmailAddress;
    const emailBody = EmailBody.create({ html: '<html>hello world</html>' }).getValue() as EmailBody;

    emailOrError = Email.create({
      recipientAddress,
      recipientName: 'john',
      senderAddress,
      senderName: 'doe',
      emailBody,
      subject: 'this is subject',
    });

    expect(emailOrError.isSuccess).toBe(true);
  });

  it('should not allow the recipient address to be same with sender address', () => {
    const recipientAddress = EmailAddress.create('test@test.com').getValue() as EmailAddress;
    const senderAddress = EmailAddress.create('test@test.com').getValue() as EmailAddress;
    const emailBody = EmailBody.create({ html: '<html>hello world</html>' }).getValue() as EmailBody;

    emailOrError = Email.create({
      recipientAddress,
      recipientName: 'john',
      senderAddress,
      senderName: 'doe',
      emailBody,
      subject: 'this is subject',
    });

    expect(emailOrError.isFailure).toBe(true);
  });
});
