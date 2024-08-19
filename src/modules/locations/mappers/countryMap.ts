import { Country } from '../domain/country';
import { CountryPersistenceDTO } from '../dtos/countryDTO';

export class CountryMap {
  static toPersistence(country: Country): CountryPersistenceDTO {
    return {
      country_id: country.countryId.getStringValue(),
      name: country.name,
      code: country.code,
    };
  }
}
