import { logger } from '../../../shared/infra/logger';
import { CountryDetails } from '../domain/countryDetails';
import { CountryPersistenceDTO } from '../dtos/countryDTO';

export class CountryDetailsMap {
  static toDomain(raw: CountryPersistenceDTO): CountryDetails {
    const countryDetailsOrError = CountryDetails.create({
      name: raw.name,
    });

    if (countryDetailsOrError.isFailure) {
      logger.error(countryDetailsOrError.getErrorValue());
      throw new Error();
    }

    return countryDetailsOrError.getValue() as CountryDetails;
  }
}
