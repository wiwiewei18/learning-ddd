import { Result, SuccessOrFailure } from '../../core/Result';
import { ValueObject } from '../ValueObject';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: EmailProps) {
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

  static create(email: string): SuccessOrFailure<Email> {
    if (!this.isValidEmail(email)) {
      return Result.fail<Email>(`Email address is not valid`);
    }
    return Result.ok<Email>(new Email({ value: this.format(email) }));
  }
}
