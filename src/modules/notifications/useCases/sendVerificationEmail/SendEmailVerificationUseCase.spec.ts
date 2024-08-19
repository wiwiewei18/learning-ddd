import { MockProxy, mock } from 'jest-mock-extended';
import { UserRoles } from '../../../users/domain/user/userRoles';
import { EmailService } from '../../services/emailService/emailService';
import { EmailTemplateService } from '../../services/emailTemplateProvider/emailTemplateProvider';
import { SendEmailVerificationUseCase } from './SendEmailVerificationUseCase';

let mockEmailService: EmailService;
let mockEmailTemplateService: MockProxy<EmailTemplateService>;
let sendEmailVerificationUseCase: SendEmailVerificationUseCase;

describe('SendEmailVerificationUseCase', () => {
  beforeEach(() => {
    mockEmailService = mock<EmailService>();
    mockEmailTemplateService = mock<EmailTemplateService>();
    mockEmailTemplateService.generateEmailVerificationTemplate.mockResolvedValue(
      '<html>verify email {{{fullName}}} {{{verificationEmailUrl}}}</html>',
    );

    sendEmailVerificationUseCase = new SendEmailVerificationUseCase(
      {
        buyerEmailVerificationCallbackUrl: 'http://domain.com/',
        emailVerificationSenderEmailAddress: 'test1@test.com',
        sellerEmailVerificationCallbackUrl: 'http://domain.com/',
      },
      mockEmailService,
      mockEmailTemplateService,
    );
  });

  it('should be able to send email verification with valid details', async () => {
    const result = await sendEmailVerificationUseCase.execute({
      userRole: UserRoles.BUYER,
      emailVerificationToken: '123',
      recipientEmailAddress: 'test@test.com',
      recipientName: 'john',
    });

    expect(result.isRight()).toBe(true);
    expect(mockEmailService.sendEmail).toHaveBeenCalled();
    expect(mockEmailTemplateService.generateEmailVerificationTemplate).toHaveBeenCalled();
  });
});
