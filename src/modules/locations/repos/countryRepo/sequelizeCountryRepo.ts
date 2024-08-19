import { Country } from '../../domain/country';
import { CountryDetails } from '../../domain/countryDetails';
import { CountryId } from '../../domain/countryId';
import { CountryPersistenceDTO } from '../../dtos/countryDTO';
import { CountryDetailsMap } from '../../mappers/countryDetailsMap';
import { CountryMap } from '../../mappers/countryMap';
import { CountryRepo } from './countryRepo';

export class SequelizeCountryRepo implements CountryRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async save(country: Country): Promise<void> {
    const rawCountry = CountryMap.toPersistence(country);

    const sequelizeCountry = await this.models.Country.findOne({
      where: { country_id: country.countryId.getStringValue() },
    });

    if (sequelizeCountry) {
      rawCountry.updated_at = new Date();
      Object.assign(sequelizeCountry, rawCountry);
      await sequelizeCountry.save();
    } else {
      await this.models.Country.create(rawCountry);
    }
  }

  async getAvailableCountries(): Promise<CountryDetails[]> {
    const countries = await this.models.Country.findAll({ where: {} });
    return countries.map((c: CountryPersistenceDTO) => CountryDetailsMap.toDomain(c));
  }

  async exists(countryId: CountryId): Promise<boolean> {
    const country = await this.models.Country.findOne({ where: { country_id: countryId.getStringValue() } });
    return !!country === true;
  }
}
