export interface StorePersistenceDTO {
  store_id: string;
  user_id: string;
  address_detail: string;
  country_code: string;
  description: string;
  name: string;
  postal_code: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
