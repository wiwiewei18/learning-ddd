import bcrypt from 'bcryptjs';
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { Result, SuccessOrFailure } from '../../../../../shared/core/Result';
import { Guard } from '../../../../../shared/core/Guard';

interface PasswordProps {
  value: string;
  isHashed?: boolean;
}

export class Password extends ValueObject<PasswordProps> {
  static minLength = 8;
  salt = 10;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: PasswordProps) {
    super(props);
  }

  private static isAppropriateLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  private static isContainNumber(password: string): boolean {
    const pattern = /\d/;
    return pattern.test(password);
  }

  private static isContainSpecialCharacter(password: string): boolean {
    const pattern = /[!@#$%^&*(),.?":{}|<>]/;
    return pattern.test(password);
  }

  private async hashPassword(plainPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(this.salt, (genSaltErr, salt) => {
        if (genSaltErr) {
          reject(genSaltErr);
        } else {
          bcrypt.hash(plainPassword, salt, (hashErr, hash) => {
            if (hashErr) {
              reject(hashErr);
            } else {
              resolve(hash);
            }
          });
        }
      });
    });
  }

  isAlreadyHashed(): boolean {
    return this.props.isHashed === true;
  }

  async getHashedValue(): Promise<string> {
    return new Promise((resolve) => {
      if (this.isAlreadyHashed()) {
        resolve(this.props.value);
        return;
      }
      resolve(this.hashPassword(this.props.value));
    });
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    if (this.isAlreadyHashed()) {
      const hashedPassword = this.props.value;
      return this.bcryptCompare(plainPassword, hashedPassword);
    }

    return plainPassword === this.props.value;
  }

  private async bcryptCompare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainPassword, hashedPassword, (err, compareResult) => {
        if (err) reject(err);
        return resolve(compareResult);
      });
    });
  }

  static create(props: PasswordProps): SuccessOrFailure<Password> {
    const nullGuard = Guard.againstNullOrUndefined(props.value, 'value');
    if (nullGuard.isFailure) {
      return Result.fail<Password>(nullGuard.getErrorValue());
    }

    if (props.isHashed) {
      return Result.ok<Password>(new Password(props));
    }

    if (!this.isAppropriateLength(props.value)) {
      return Result.fail<Password>(`Password doesn't meet criteria, ${this.minLength} chars min`);
    }

    if (!this.isContainNumber(props.value)) {
      return Result.fail<Password>(`Password doesn't meet criteria, must contain number`);
    }

    if (!this.isContainSpecialCharacter(props.value)) {
      return Result.fail<Password>(`Password doesn't meet criteria, must contain special character`);
    }

    return Result.ok<Password>(new Password({ value: props.value, isHashed: false }));
  }
}
