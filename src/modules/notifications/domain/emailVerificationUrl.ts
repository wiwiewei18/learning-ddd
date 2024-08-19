import { Guard } from '../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';

interface EmailVerificationUrlProps {
  emailVerificationToken: string;
  frontendUrl: string;
}

export class EmailVerificationUrl extends ValueObject<EmailVerificationUrlProps> {
  get emailVerificationToken(): string {
    return this.props.emailVerificationToken;
  }

  get frontendUrl(): string {
    return this.props.frontendUrl;
  }

  get value(): string {
    return `${this.frontendUrl}?token=${this.emailVerificationToken}`;
  }

  private constructor(props: EmailVerificationUrlProps) {
    super(props);
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  static create(props: EmailVerificationUrlProps): SuccessOrFailure<EmailVerificationUrl> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.emailVerificationToken,
        argumentName: 'emailVerificationToken',
      },
      {
        argument: props.frontendUrl,
        argumentName: 'frontendUrl',
      },
    ]);

    if (nullGuard.isFailure) {
      return Result.fail<EmailVerificationUrl>(nullGuard.getErrorValue());
    }

    if (!this.isValidUrl(props.frontendUrl)) {
      return Result.fail<EmailVerificationUrl>(`Url ${props.frontendUrl} is not valid`);
    }

    return Result.ok<EmailVerificationUrl>(new EmailVerificationUrl(props));
  }
}
