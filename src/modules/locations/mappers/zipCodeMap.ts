import { ZipCode } from '../domain/zipCode';
import { ZipCodePersistenceDTO } from '../dtos/zipCodeDTO';

export class ZipCodeMap {
  static toPersistence(zipCode: ZipCode): ZipCodePersistenceDTO {
    return {
      zip_code_id: zipCode.zipCodeId.getStringValue(),
      country_id: zipCode.countryId.getStringValue(),
      code: zipCode.code,
    };
  }
}
