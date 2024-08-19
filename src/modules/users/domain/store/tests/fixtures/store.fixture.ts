import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { UserId } from '../../../user/valueObjects/userId';
import { Store } from '../../store';

function createRandomStore(userId?: UserId): Store {
  const storeOrError = Store.create({
    userId: userId || (UserId.create(new UniqueEntityID('1')).getValue() as UserId),
    addressDetail: faker.location.streetAddress(),
    countryCode: 'SG',
    description: faker.company.buzzPhrase(),
    name: faker.company.name(),
    postalCode: faker.location.zipCode(),
  });
  if (storeOrError.isFailure) {
    throw new Error(storeOrError.getErrorValue());
  }
  return storeOrError.getValue() as Store;
}

export { createRandomStore };
