import { Schema, model } from 'mongoose';
import { UserRoles } from '../../../domain/user/userRoles';

export enum TokenTypes {
  VERIFY_EMAIL = 'verify email',
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export interface TokenProps {
  userRole: UserRoles;
  token: string;
  email: string;
  type: TokenTypes;
  userId: string;
}

const tokenSchema = new Schema<TokenProps>({
  userRole: { type: String, required: false },
  token: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, required: true },
  userId: { type: String, required: false },
});

const tokenModel = model<TokenProps>('Token', tokenSchema);

export { tokenModel };
