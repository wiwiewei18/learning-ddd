import { CountryPersistenceDTO } from './countryDTO';

export interface ZipCodePersistenceDTO {
  zip_code_id: string;
  country_id: string;
  code: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
  Country?: CountryPersistenceDTO;
}
