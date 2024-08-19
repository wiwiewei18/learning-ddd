import { StorePersistenceDTO } from '../../users/dtos/storeDTO';

export interface StoreFrontPersistenceDTO {
  base_store_id: string;
  store_front_id: string;
  date_joined?: Date | string;
  is_verified?: boolean;
  profile_image_url?: string;
  store_front_banner_image_url?: string;
  average_rating?: number;
  num_ratings?: number;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
  Store?: StorePersistenceDTO;
}
