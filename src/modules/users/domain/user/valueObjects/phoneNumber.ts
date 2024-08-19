import { parsePhoneNumber } from 'awesome-phonenumber';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';

interface PhoneNumberProps {
  value: string;
  countryCode?: string;
}

export class PhoneNumber extends ValueObject<PhoneNumberProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: PhoneNumberProps) {
    super(props);
  }

  private static getValidPhoneNumber(phoneNumber: string, countryCode?: string): SuccessOrFailure<string> {
    const option = countryCode ? { regionCode: countryCode } : undefined;

    const phoneNumberResult = parsePhoneNumber(phoneNumber, option);

    if (!phoneNumberResult.valid) {
      return Result.fail(phoneNumberResult.possibility);
    }

    return Result.ok<string>(phoneNumberResult.number.e164);
  }

  static create(props: PhoneNumberProps): SuccessOrFailure<PhoneNumber> {
    const phoneNumberOrError = this.getValidPhoneNumber(props.value, props.countryCode);

    if (phoneNumberOrError.isFailure) {
      return Result.fail<PhoneNumber>(`Phone number is not valid, reason: ${phoneNumberOrError.getErrorValue()}`);
    }

    const phoneNumber = phoneNumberOrError.getValue() as string;

    return Result.ok<PhoneNumber>(new PhoneNumber({ value: phoneNumber, countryCode: props.countryCode }));
  }
}
