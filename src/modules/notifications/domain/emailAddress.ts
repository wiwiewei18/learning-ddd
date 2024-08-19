import { Result, SuccessOrFailure } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';

interface EmailAddressProps {
  value: string;
}

export class EmailAddress extends ValueObject<EmailAddressProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: EmailAddressProps) {
    super(props);
  }

  private static isValidEmail(email: string): boolean {
    const regex =
      /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(email);
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }

  static create(email: string): SuccessOrFailure<EmailAddress> {
    if (!this.isValidEmail(email)) {
      return Result.fail<EmailAddress>(`Email address is not valid`);
    }
    return Result.ok<EmailAddress>(new EmailAddress({ value: this.format(email) }));
  }
}
