import { UserRoles } from '../../../users/domain/user/userRoles';

export interface SendEmailVerificationRequestDTO {
  recipientName: string;
  recipientEmailAddress: string;
  emailVerificationToken: string;
  userRole: UserRoles;
}
