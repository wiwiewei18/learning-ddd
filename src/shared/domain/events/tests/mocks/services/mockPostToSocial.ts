import { MockJobCreatedEvent } from '../events/mockJobCreatedEvent';
import { MockJobDeletedEvent } from '../events/mockJobDeletedEvent';
import { DomainEvents } from '../../../DomainEvents';

export class MockPostToSocial {
  /**
   * This is how we may setup subscriptions to domain events.
   */

  setupSubscriptions(): void {
    DomainEvents.register((event) => this.handleJobCreatedEvent(event as MockJobCreatedEvent), MockJobCreatedEvent.name);
    DomainEvents.register((event) => this.handleJobDeletedEvent(event as MockJobDeletedEvent), MockJobDeletedEvent.name);
  }

  /**
   * These are examples of how we define the handlers for domain events.
   */

  handleJobCreatedEvent(event: MockJobCreatedEvent): void {
    // eslint-disable-next-line no-console
    console.info(`A job was created!!! ${event.getAggregateId()}`);
  }

  handleJobDeletedEvent(event: MockJobDeletedEvent): void {
    // eslint-disable-next-line no-console
    console.info(`A job was deleted!!! ${event.getAggregateId()}`);
  }
}
