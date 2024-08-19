import { AppError } from '../../../../shared/core/AppError';
import { Either, left, right } from '../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../shared/core/Result';
import { UseCase } from '../../../../shared/core/UseCase';
import { UserRoles } from '../../../users/domain/user/userRoles';
import { Email } from '../../domain/email';
import { EmailAddress } from '../../domain/emailAddress';
import { EmailBody } from '../../domain/emailBody';
import { EmailVerificationUrl } from '../../domain/emailVerificationUrl';
import { EmailService } from '../../services/emailService/emailService';
import { EmailTemplateService } from '../../services/emailTemplateProvider/emailTemplateProvider';
import { SendEmailVerificationRequestDTO } from './SendEmailVerificationRequestDTO';

type Response = Either<AppError.UnexpectedError | SuccessOrFailure<any>, SuccessOrFailure<void>>;

type SendEmailVerificationUseCaseConfig = {
  buyerEmailVerificationCallbackUrl: string;
  sellerEmailVerificationCallbackUrl: string;
  emailVerificationSenderEmailAddress: string;
};

export class SendEmailVerificationUseCase implements UseCase<SendEmailVerificationRequestDTO, Promise<Response>> {
  private emailService: EmailService;
  private emailTemplateService: EmailTemplateService;

  constructor(
    private config: SendEmailVerificationUseCaseConfig,
    emailService: EmailService,
    emailTemplateService: EmailTemplateService,
  ) {
    this.emailService = emailService;
    this.emailTemplateService = emailTemplateService;
  }

  private getFrontendUrl(userType: UserRoles): string {
    return userType === 'buyer'
      ? this.config.buyerEmailVerificationCallbackUrl
      : this.config.sellerEmailVerificationCallbackUrl;
  }

  async execute(request: SendEmailVerificationRequestDTO): Promise<Response> {
    const frontendUrl = this.getFrontendUrl(request.userRole);

    const emailVerificationUrlOrError = EmailVerificationUrl.create({
      frontendUrl,
      emailVerificationToken: request.emailVerificationToken,
    });

    if (emailVerificationUrlOrError.isFailure) {
      return left(Result.fail<EmailVerificationUrl>(emailVerificationUrlOrError.getErrorValue().toString()));
    }

    const emailVerificationUrl = emailVerificationUrlOrError.getValue() as EmailVerificationUrl;

    const templateHtml = await this.emailTemplateService.generateEmailVerificationTemplate();
    const emailBodyOrError = EmailBody.create({
      html: templateHtml,
      htmlContents: { fullName: request.recipientName, verificationEmailUrl: emailVerificationUrl.value },
    });

    if (emailBodyOrError.isFailure) {
      return left(Result.fail<EmailBody>(emailBodyOrError.getErrorValue()));
    }

    const emailBody = emailBodyOrError.getValue() as EmailBody;

    const recipientAddressOrError = EmailAddress.create(request.recipientEmailAddress);
    const senderAddressOrError = EmailAddress.create(this.config.emailVerificationSenderEmailAddress);

    const combinedResult = Result.combineSuccessOrFailureResults([recipientAddressOrError, senderAddressOrError]);
    if (combinedResult.isFailure) {
      return left(Result.fail<EmailAddress>(combinedResult.getErrorValue()));
    }

    const recipientAddress = recipientAddressOrError.getValue() as EmailAddress;
    const senderAddress = senderAddressOrError.getValue() as EmailAddress;

    const emailOrError = Email.create({
      emailBody,
      recipientAddress,
      recipientName: request.recipientName,
      senderAddress,
      senderName: request.recipientName,
      subject: 'Email Verification',
    });

    if (emailOrError.isFailure) {
      return left(Result.fail<Email>(emailOrError.getErrorValue().toString()));
    }

    const email = emailOrError.getValue() as Email;

    await this.emailService.sendEmail(email);

    return right(Result.ok<void>());
  }
}
