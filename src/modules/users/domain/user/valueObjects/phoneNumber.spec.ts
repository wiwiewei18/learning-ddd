import { SuccessOrFailure } from '../../../../../shared/core/Result';
import { PhoneNumber } from './phoneNumber';

let phoneNumberOrError: SuccessOrFailure<PhoneNumber>;
// let phoneNumber: PhoneNumber;

describe('PhoneNumber', () => {
  it('should be able to create phone number from number without phone country code when phone country code is provided', () => {
    phoneNumberOrError = PhoneNumber.create({ value: '85553886', countryCode: 'SG' });

    expect(phoneNumberOrError.isSuccess).toBe(true);
  });

  it('should be able to create phone number from number with phone country code when phone country code is not provided', () => {
    phoneNumberOrError = PhoneNumber.create({ value: '+6585553886' });

    expect(phoneNumberOrError.isSuccess).toBe(true);
  });

  it('should be fail to create phone number from number without phone country code when provided country code is invalid', () => {
    phoneNumberOrError = PhoneNumber.create({ value: '85553886', countryCode: 'invalid' });

    expect(phoneNumberOrError.isFailure).toBe(true);
  });

  it('should be fail to create phone number from number without phone country code and country code', () => {
    phoneNumberOrError = PhoneNumber.create({ value: '85553886' });

    expect(phoneNumberOrError.isFailure).toBe(true);
  });
});
