import { Guard } from '../../../shared/core/Guard';
import { Entity } from '../../../shared/domain/Entity';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { EmailAddress } from './emailAddress';
import { EmailId } from './emailId';
import { EmailBody } from './emailBody';
import { Result, SuccessOrFailure } from '../../../shared/core/Result';

interface EmailProps {
  senderAddress: EmailAddress;
  senderName: string;
  recipientAddress: EmailAddress;
  recipientName: string;
  subject: string;
  emailBody: EmailBody;
}

export class Email extends Entity<EmailProps> {
  get emailId(): EmailId {
    return EmailId.create(this._id).getValue() as EmailId;
  }

  get senderAddress(): EmailAddress {
    return this.props.senderAddress;
  }

  get senderName(): string {
    return this.props.senderName;
  }

  get recipientAddress(): EmailAddress {
    return this.props.recipientAddress;
  }

  get recipientName(): string {
    return this.props.recipientName;
  }

  get subject(): string {
    return this.props.subject;
  }

  get emailBody(): EmailBody {
    return this.props.emailBody;
  }

  private constructor(props: EmailProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: EmailProps, id?: UniqueEntityID): SuccessOrFailure<Email> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.recipientAddress,
        argumentName: 'recipientAddress',
      },
      {
        argument: props.recipientName,
        argumentName: 'recipientName',
      },
      {
        argument: props.senderAddress,
        argumentName: 'senderAddress',
      },
      {
        argument: props.senderName,
        argumentName: 'senderName',
      },
      {
        argument: props.subject,
        argumentName: 'subject',
      },
      {
        argument: props.emailBody,
        argumentName: 'emailBody',
      },
    ]);

    if (nullGuard.isFailure) {
      return Result.fail<Email>(nullGuard.getErrorValue());
    }

    if (props.recipientAddress.equals(props.senderAddress)) {
      return Result.fail<Email>(`Email recipient address can't be same with sender address`);
    }

    return Result.ok<Email>(
      new Email(
        {
          recipientAddress: props.recipientAddress,
          recipientName: props.recipientName,
          senderAddress: props.senderAddress,
          senderName: props.senderName,
          subject: props.subject,
          emailBody: props.emailBody,
        },
        id,
      ),
    );
  }
}
