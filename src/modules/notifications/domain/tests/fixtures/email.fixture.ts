import { Email } from '../../email';
import { EmailAddress } from '../../emailAddress';
import { EmailBody } from '../../emailBody';

function createRandomEmail(): Email {
  const recipientAddress = EmailAddress.create('test@test.com').getValue() as EmailAddress;
  const senderAddress = EmailAddress.create('test1@test.com').getValue() as EmailAddress;
  const emailBody = EmailBody.create({ html: '<html>hello world</html>' }).getValue() as EmailBody;

  const emailOrError = Email.create({
    recipientAddress,
    recipientName: 'john',
    senderAddress,
    senderName: 'doe',
    emailBody,
    subject: 'this is subject',
  });

  if (emailOrError.isFailure) {
    throw new Error(emailOrError.getErrorValue());
  }

  return emailOrError.getValue() as Email;
}

export { createRandomEmail };
