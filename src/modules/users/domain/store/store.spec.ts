import { DomainEvents } from '../../../../shared/domain/events/DomainEvents';
import { createRandomUser } from '../user/tests/fixtures/user.fixture';
import { User } from '../user/user';
import { UserRoles } from '../user/userRoles';
import { StoreCreated } from './events/storeCreated';
import { Store } from './store';
import { createRandomStore } from './tests/fixtures/store.fixture';

describe('Store', () => {
  afterEach(() => {
    DomainEvents.clearHandlers();
    DomainEvents.clearMarkedAggregates();
  });

  it('should be able to create valid store', () => {
    const user = createRandomUser(UserRoles.SELLER) as User;

    const storeOrError = Store.create({
      userId: user.userId,
      addressDetail: 'some address detail',
      countryCode: 'SG',
      description: 'store description',
      name: 'Store Name',
      postalCode: '530121',
    });

    expect(storeOrError.isSuccess).toBe(true);
  });

  it('should generate store created event when new store is created', () => {
    const store = createRandomStore();

    const domainEventNames = store.domainEvents.map((d) => d.constructor.name);
    expect(domainEventNames).toContainEqual(StoreCreated.name);
  });
});
