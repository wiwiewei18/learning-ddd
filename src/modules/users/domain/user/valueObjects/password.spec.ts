import { SuccessOrFailure } from '../../../../../shared/core/Result';
import { Password } from './password';

let passwordOrError: SuccessOrFailure<Password>;
let password: Password;

describe('Password', () => {
  describe('Password creation', () => {
    it('should be able to create password when meet with the criteria', () => {
      passwordOrError = Password.create({ value: 'Password1!' });
      expect(passwordOrError.isSuccess).toBe(true);
    });

    it('should be fail to create password when password length is less than 8 characters', () => {
      passwordOrError = Password.create({ value: 'pass1!' });
      expect(passwordOrError.isFailure).toBe(true);
    });

    it(`should be fail to create password when password doesn't contain number`, () => {
      passwordOrError = Password.create({ value: 'password!' });
      expect(passwordOrError.isFailure).toBe(true);
    });

    it(`should be fail to create password when password doesn't contain special character`, () => {
      passwordOrError = Password.create({ value: 'password1' });
      expect(passwordOrError.isFailure).toBe(true);
    });
  });

  test('given plain password, when get the hashed password, should be able to get the hashed password value', async () => {
    password = Password.create({ value: 'password1!' }).getValue() as Password;
    const hashedValue = await password.getHashedValue();

    expect(hashedValue).not.toBe('password1!');
    expect(typeof hashedValue === 'string').toBe(true);
  });

  test('given hashed password, when get the hashed password, the hashed value should be same', async () => {
    password = Password.create({ value: 'hashed123', isHashed: true }).getValue() as Password;
    const hashedValue = await password.getHashedValue();

    expect(hashedValue).toBe('hashed123');
  });

  test('given plain password, when i compare the password, it should same with provided plain password', async () => {
    password = Password.create({ value: 'password1!' }).getValue() as Password;

    expect(await password.comparePassword('password1!')).toBe(true);
  });
});
