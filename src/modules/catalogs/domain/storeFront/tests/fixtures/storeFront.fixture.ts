import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { StoreId } from '../../../../../users/domain/store/valueObjects/storeId';
import { StoreFront } from '../../storeFront';

interface RandomStoreFrontProps {
  storeId: StoreId;
  storeName?: string;
}

function createRandomStoreFront(props?: RandomStoreFrontProps): StoreFront {
  const storeId = props?.storeId ? props.storeId : (StoreId.create(new UniqueEntityID('1')).getValue() as StoreId);

  const storeFrontOrError = StoreFront.create({
    description: faker.company.catchPhrase(),
    name: props?.storeName ? props.storeName : faker.company.name(),
    storeId,
  });

  if (storeFrontOrError.isFailure) {
    throw new Error(storeFrontOrError.getErrorValue());
  }

  return storeFrontOrError.getValue() as StoreFront;
}

export { createRandomStoreFront };
