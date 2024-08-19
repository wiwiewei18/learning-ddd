import { Request } from 'express';
import { JWTUserClaims } from '../../../domain/user/jwt';

export interface DecodedExpressRequest extends Request {
  decoded?: JWTUserClaims;
}
