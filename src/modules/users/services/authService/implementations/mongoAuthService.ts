import jwtClient from 'jsonwebtoken';
import { Model } from 'mongoose';
import { Email } from '../../../../../shared/domain/valueObjects/email';
import { JWTEmailVerificationClaims } from '../../../domain/user/jwt';
import { User } from '../../../domain/user/user';
import { UserRoles } from '../../../domain/user/userRoles';
import { AuthService, AuthenticationConfiguration } from '../authService';
import { CaptchaClient } from './captchaClient';
import { TokenProps, TokenTypes } from './mongoModels';

export class MongoAuthService implements AuthService {
  private tokenModel: Model<TokenProps>;
  private captchaClient: CaptchaClient;

  constructor(
    private config: AuthenticationConfiguration,
    tokenModel: Model<TokenProps>,
    captchaClient: CaptchaClient,
  ) {
    this.tokenModel = tokenModel;
    this.captchaClient = captchaClient;
  }

  signJWT<T>(claims: T, expiryInMinutes: number): string {
    const expiresInSeconds = expiryInMinutes * 60;

    return jwtClient.sign(claims as object, this.config.jwtSecret, { expiresIn: expiresInSeconds });
  }

  async decodeJWT<T>(jwt: string): Promise<T> {
    return new Promise((resolve, reject) => {
      jwtClient.verify(jwt, this.config.jwtSecret, (err, decoded) => {
        if (err) return reject(err);
        return resolve(decoded as T);
      });
    });
  }

  generateEmailVerificationToken(email: Email): string {
    const emailVerificationTokenExpiresInMinute = 30;
    const token = this.signJWT<JWTEmailVerificationClaims>({ email: email.value }, emailVerificationTokenExpiresInMinute);
    return token;
  }

  async saveEmailVerificationToken(jwt: string, email: Email): Promise<void> {
    await this.tokenModel.create({ token: jwt, type: TokenTypes.VERIFY_EMAIL, email: email.value });
  }

  async getToken<T>(jwt: string): Promise<T> {
    return this.tokenModel.findOne({ token: jwt }) as T;
  }

  async getAccessTokens(userId: string): Promise<string[]> {
    const tokens = await this.tokenModel.find({ userId, type: TokenTypes.ACCESS });
    return tokens.map((t) => t.token);
  }

  async validateJWTExpiry(jwt: string): Promise<boolean> {
    return new Promise((resolve) => {
      jwtClient.verify(jwt, this.config.jwtSecret, (err) => {
        if (err && err instanceof jwtClient.TokenExpiredError) {
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }

  async validateJWTString(jwt: string): Promise<boolean> {
    return new Promise((resolve) => {
      jwtClient.verify(jwt, this.config.jwtSecret, (err) => {
        if (err && err instanceof jwtClient.JsonWebTokenError) {
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }

  async validateCaptcha(responseToken: string): Promise<boolean> {
    return this.captchaClient.validateResponse(responseToken);
  }

  generateRefreshToken(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 256; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  async saveAuthenticatedUser(user: User): Promise<void> {
    if (user.isLoggedIn()) {
      await this.tokenModel.create({
        userType: UserRoles.BUYER,
        email: user.email.value,
        token: user.accessToken,
        type: TokenTypes.ACCESS,
        userId: user.userId.getStringValue(),
      });

      await this.tokenModel.create({
        userType: UserRoles.BUYER,
        email: user.email.value,
        token: user.refreshToken,
        type: TokenTypes.REFRESH,
        userId: user.userId.getStringValue(),
      });
    }
  }
}
