import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { JWTUserClaims } from '../../../../modules/users/domain/user/jwt';
import { DecodedExpressRequest } from '../../../../modules/users/infra/http/models/decodedRequest';
import { AuthService } from '../../../../modules/users/services/authService/authService';
import { ObjectParser } from '../../../utils/objectParser';

type MiddlewareConfig = {
  isProduction: boolean;
};

export class Middleware {
  private authService: AuthService;

  constructor(
    private config: MiddlewareConfig,
    authService: AuthService,
  ) {
    this.authService = authService;
  }

  ensureCaptchaValidated() {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!this.config.isProduction) return next();

      const captchaToken = req.headers['captcha-token'] as string;

      const isCaptchaResponseValid = await this.authService.validateCaptcha(captchaToken);

      if (!isCaptchaResponseValid) {
        return this.endRequest(422, `Your captcha is error. Please try again!`, res);
      }

      return next();
    };
  }

  ensureAuthenticated() {
    return async (req: DecodedExpressRequest, res: Response, next: NextFunction) => {
      const accessToken = req.headers.authorization?.split(' ')[1];

      if (!accessToken) {
        return this.endRequest(403, `No access token provided`, res);
      }

      if (!(await this.authService.validateJWTString(accessToken))) {
        return this.endRequest(403, `Invalid access token`, res);
      }

      if (!(await this.authService.validateJWTExpiry(accessToken))) {
        return this.endRequest(403, `Expired access token`, res);
      }

      const decoded = await this.authService.decodeJWT<JWTUserClaims>(accessToken);

      const savedAccessTokens = await this.authService.getAccessTokens(decoded.userId);

      if (savedAccessTokens.length === 0) {
        return this.endRequest(403, `Access token not found. User is probably not logged in. Please login again`, res);
      }

      req.decoded = decoded;

      return next();
    };
  }

  private endRequest(statusCode: 400 | 401 | 403 | 422, message: string, res: Response) {
    return res.status(statusCode).send({ status: 'failure', code: statusCode, data: { message } });
  }

  createRateLimit(mins: number, maxRequests: number) {
    return rateLimit({ windowMs: mins * 60 * 1000, max: maxRequests, skipSuccessfulRequests: true });
  }

  createFormDataParser() {
    return (req: Request, _res: Response, next: NextFunction) => {
      req.body = ObjectParser.parseUnparsedObject(req.body);
      next();
    };
  }
}
