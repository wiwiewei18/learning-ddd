import { CountryId } from '../../domain/countryId';
import { ZipCode } from '../../domain/zipCode';
import { ZipCodeDetails } from '../../domain/zipCodeDetails';
import { ZipCodeId } from '../../domain/zipCodeId';
import { CountryPersistenceDTO } from '../../dtos/countryDTO';
import { ZipCodePersistenceDTO } from '../../dtos/zipCodeDTO';
import { ZipCodeDetailsMap } from '../../mappers/zipCodeDetailsMap';
import { ZipCodeMap } from '../../mappers/zipCodeMap';
import { ZipCodeRepo } from './zipCodeRepo';

export class InMemoryZipCodeRepo implements ZipCodeRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async exists(zipCodeId: ZipCodeId): Promise<boolean> {
    for (const zipCode of this.models.ZipCode) {
      if (zipCode.zip_code_id === zipCodeId.getStringValue()) {
        return true;
      }
    }
    return false;
  }

  async save(zipCode: ZipCode): Promise<void> {
    if (!(await this.exists(zipCode.zipCodeId))) {
      const rawZipCode = ZipCodeMap.toPersistence(zipCode);

      rawZipCode.Country = this.models.Country.find(
        (c: CountryPersistenceDTO) => c.country_id === zipCode.countryId.getStringValue(),
      );

      this.models.ZipCode.push(rawZipCode);
    }
  }

  async getZipCodesByCountryId(countryId: CountryId): Promise<ZipCodeDetails[]> {
    const zipCodes = this.models.ZipCode.filter(
      (z: ZipCodePersistenceDTO) => z.Country?.country_id === countryId.getStringValue(),
    );
    return zipCodes.map((z: ZipCodePersistenceDTO) => ZipCodeDetailsMap.toDomain(z));
  }
}
