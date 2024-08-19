import { UserPersistenceDTO } from '../../users/dtos/userDTO';

export interface BuyerPersistenceDTO {
  buyer_id: string;
  base_user_id: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
  User?: UserPersistenceDTO;
}
