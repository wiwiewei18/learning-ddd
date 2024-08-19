import { Country } from '../../domain/country';
import { CountryDetails } from '../../domain/countryDetails';
import { CountryId } from '../../domain/countryId';

export interface CountryRepo {
  exists(countryId: CountryId): Promise<boolean>;
  save(country: Country): Promise<void>;
  getAvailableCountries(): Promise<CountryDetails[]>;
}
