import { AppError } from '../../../../shared/core/AppError';
import { Either, left, right } from '../../../../shared/core/Either';
import { Result, SuccessOrFailure } from '../../../../shared/core/Result';
import { UseCase } from '../../../../shared/core/UseCase';
import { Email } from '../../domain/email';
import { EmailAddress } from '../../domain/emailAddress';
import { EmailBody } from '../../domain/emailBody';
import { EmailService } from '../../services/emailService/emailService';
import { SendEmailRequestDTO } from './SendEmailRequestDTO';

type Response = Either<AppError.UnexpectedError | SuccessOrFailure<any>, SuccessOrFailure<void>>;

export class SendEmailUseCase implements UseCase<SendEmailRequestDTO, Promise<Response>> {
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
  }

  async execute(request: SendEmailRequestDTO): Promise<Response> {
    const emailBodyOrError = EmailBody.create({ html: request.html });
    const senderAddressOrError = EmailAddress.create(request.senderEmailAddress);
    const recipientAddressOrError = EmailAddress.create(request.recipientEmailAddress);

    const dtoResult = Result.combineSuccessOrFailureResults<any>([
      emailBodyOrError,
      senderAddressOrError,
      recipientAddressOrError,
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue()));
    }

    const emailBody: EmailBody = emailBodyOrError.getValue() as EmailBody;
    const senderAddress: EmailAddress = senderAddressOrError.getValue() as EmailAddress;
    const recipientAddress: EmailAddress = recipientAddressOrError.getValue() as EmailAddress;

    const emailOrError = Email.create({
      emailBody,
      recipientAddress,
      recipientName: request.recipientName,
      senderAddress,
      senderName: request.senderName,
      subject: request.subject,
    });

    if (emailOrError.isFailure) {
      return left(Result.fail<Email>(emailOrError.getErrorValue().toString()));
    }

    const email: Email = emailOrError.getValue() as Email;

    await this.emailService.sendEmail(email);

    return right(Result.ok<void>());
  }
}
