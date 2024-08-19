import { mock } from 'jest-mock-extended';
import { EmailService } from '../../services/emailService/emailService';
import { SendEmailUseCase } from './SendEmailUseCase';

let mockEmailService: EmailService;
let sendEmailUseCase: SendEmailUseCase;

describe('SendEmailUseCase', () => {
  beforeEach(() => {
    mockEmailService = mock<EmailService>();
    sendEmailUseCase = new SendEmailUseCase(mockEmailService);
  });

  it('should be able to send email with valid details', async () => {
    const result = await sendEmailUseCase.execute({
      html: '<html>hello world</html>',
      recipientEmailAddress: 'test1@test.com',
      recipientName: 'doe',
      senderEmailAddress: 'test@test.com',
      senderName: 'john',
      subject: 'hello world',
    });

    expect(result.isRight()).toBe(true);
    expect(mockEmailService.sendEmail).toHaveBeenCalled();
  });

  it('should fail to send email when the email data is invalid', async () => {
    const result = await sendEmailUseCase.execute({
      html: 'invalid html',
      recipientEmailAddress: 'test1@test.com',
      recipientName: 'doe',
      senderEmailAddress: 'test@test.com',
      senderName: 'john',
      subject: 'hello world',
    });

    expect(result.isLeft()).toBe(true);
    expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
  });
});
