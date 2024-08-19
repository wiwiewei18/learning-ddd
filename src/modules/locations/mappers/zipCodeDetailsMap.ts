import { logger } from '../../../shared/infra/logger';
import { ZipCodeDetails } from '../domain/zipCodeDetails';
import { ZipCodePersistenceDTO } from '../dtos/zipCodeDTO';

export class ZipCodeDetailsMap {
  static toDomain(raw: ZipCodePersistenceDTO): ZipCodeDetails {
    const zipCodeOrError = ZipCodeDetails.create({ code: raw.code });

    if (zipCodeOrError.isFailure) {
      logger.error(zipCodeOrError.getErrorValue());
      throw new Error();
    }

    return zipCodeOrError.getValue() as ZipCodeDetails;
  }
}
