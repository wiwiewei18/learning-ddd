export interface CountryPersistenceDTO {
  country_id: string;
  name: string;
  code: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
