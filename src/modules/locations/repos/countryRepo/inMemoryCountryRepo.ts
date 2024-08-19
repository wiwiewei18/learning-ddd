import { Country } from '../../domain/country';
import { CountryDetails } from '../../domain/countryDetails';
import { CountryId } from '../../domain/countryId';
import { CountryPersistenceDTO } from '../../dtos/countryDTO';
import { CountryDetailsMap } from '../../mappers/countryDetailsMap';
import { CountryMap } from '../../mappers/countryMap';
import { CountryRepo } from './countryRepo';

export class InMemoryCountryRepo implements CountryRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async exists(countryId: CountryId): Promise<boolean> {
    for (const country of this.models.Country) {
      if (country.country_id === countryId.getStringValue()) {
        return true;
      }
    }
    return false;
  }

  async save(country: Country): Promise<void> {
    if (!(await this.exists(country.countryId))) {
      this.models.Country.push(CountryMap.toPersistence(country));
    }
  }

  async getAvailableCountries(): Promise<CountryDetails[]> {
    return this.models.Country.map((c: CountryPersistenceDTO) => CountryDetailsMap.toDomain(c));
  }
}
