import { Email } from '../../../../shared/domain/valueObjects/email';
import { User } from '../../domain/user/user';

export type AuthenticationConfiguration = {
  jwtSecret: string;
  buyerEmailVerificationCallbackUrl: string;
  sellerEmailVerificationCallbackUrl: string;
  emailVerificationSenderName: string;
  emailVerificationSenderEmailAddress: string;
  captchaSecretKey: string;
};

export interface AuthService {
  generateEmailVerificationToken(email: Email): string;
  saveEmailVerificationToken(jwt: string, email: Email): Promise<void>;
  getToken<T>(jwt: string): Promise<T>;
  getAccessTokens(userId: string): Promise<string[]>;
  validateJWTExpiry(jwt: string): Promise<boolean>;
  validateJWTString(jwt: string): Promise<boolean>;
  decodeJWT<T>(jwt: string): Promise<T>;
  validateCaptcha(responseToken: string): Promise<boolean>;
  generateRefreshToken(): string;
  saveAuthenticatedUser(user: User): Promise<void>;
  signJWT<T>(claims: T, expiryInMinutes: number): string;
}
