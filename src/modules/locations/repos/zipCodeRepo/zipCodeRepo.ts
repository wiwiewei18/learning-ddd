import { CountryId } from '../../domain/countryId';
import { ZipCode } from '../../domain/zipCode';
import { ZipCodeDetails } from '../../domain/zipCodeDetails';
import { ZipCodeId } from '../../domain/zipCodeId';

export interface ZipCodeRepo {
  exists(zipCodeId: ZipCodeId): Promise<boolean>;
  save(zipCode: ZipCode): Promise<void>;
  getZipCodesByCountryId(countryId: CountryId): Promise<ZipCodeDetails[]>;
}
