import { UserRoles } from '../domain/user/userRoles';

export interface UserPersistenceDTO {
  user_id: string;
  first_name: string;
  last_name?: string;
  phone_number: string;
  country_code?: string;
  email: string;
  password: string;
  role: UserRoles;
  is_email_verified?: boolean;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
