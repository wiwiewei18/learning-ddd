import { JsonWebTokenError } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { AppConfiguration } from '../../../../../config/appConfig';
import { CompositionRoot } from '../../../../../shared/composition/compositionRoot';
import { JWTEmailVerificationClaims } from '../../../domain/user/jwt';
import { createRandomUser } from '../../../domain/user/tests/fixtures/user.fixture';
import { User } from '../../../domain/user/user';
import { UserRoles } from '../../../domain/user/userRoles';
import { AuthService } from '../authService';
import { tokenModel } from './mongoModels';

let authService: AuthService;
let randomUser: User;

describe('MongoAuthService', () => {
  let compositionRoot: CompositionRoot;

  beforeAll(async () => {
    const config = new AppConfiguration();

    await mongoose.connect(config.getDatabaseConfiguration().mongoose.dbUrl);

    compositionRoot = new CompositionRoot(config);
  });

  beforeEach(() => {
    authService = compositionRoot.getAuthService();
    randomUser = createRandomUser(UserRoles.BUYER);
  });

  afterEach(async () => {
    jest.useRealTimers();
    await tokenModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('generateEmailVerificationToken', () => {
    it('should be able to generate email verification token when provided with valid email', () => {
      const emailVerificationToken = authService.generateEmailVerificationToken(randomUser.email);

      expect(emailVerificationToken).toEqual(expect.any(String));
    });
  });

  describe('saveEmailVerificationToken', () => {
    it('should be able to save email verification token with valid jwt', async () => {
      const emailVerificationToken = authService.generateEmailVerificationToken(randomUser.email);
      await authService.saveEmailVerificationToken(emailVerificationToken, randomUser.email);
      const token = await authService.getToken(emailVerificationToken);
      expect(token).toBeDefined();
    });
  });

  describe('validateJWTExpiry', () => {
    it('should be able to validate jwt is malformed or not', async () => {
      const isTokenValid = await authService.validateJWTString('invalidToken');

      expect(isTokenValid).toBe(false);
    });

    it('should be able to validate jwt expiry', async () => {
      jest.useFakeTimers();

      const emailVerificationToken = authService.generateEmailVerificationToken(randomUser.email);

      const currentDate = new Date();
      const minutesToAdd = 31;
      const futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
      jest.setSystemTime(futureDate);

      const isTokenActive = await authService.validateJWTExpiry(emailVerificationToken);

      expect(isTokenActive).toBe(false);
    });
  });

  describe('decodeJWT', () => {
    it('should be able to decode the valid jwt', async () => {
      const emailVerificationToken = authService.generateEmailVerificationToken(randomUser.email);

      const decoded = await authService.decodeJWT<JWTEmailVerificationClaims>(emailVerificationToken);

      expect(decoded.email).toEqual(randomUser.email.value);
    });

    it('should throw error when try to decode invalid jwt', async () => {
      await expect(authService.decodeJWT<JWTEmailVerificationClaims>('invalidToken')).rejects.toBeInstanceOf(
        JsonWebTokenError,
      );
    });
  });

  describe('saveAuthenticatedUser', () => {
    it('should be able to save authenticated buyer', async () => {
      await authService.saveAuthenticatedUser(randomUser);

      const buyerAccessToken = await authService.getToken(randomUser.accessToken as string);
      const buyerRefreshToken = await authService.getToken(randomUser.refreshToken as string);

      expect(buyerAccessToken).toBeDefined();
      expect(buyerRefreshToken).toBeDefined();
    });
  });
});
