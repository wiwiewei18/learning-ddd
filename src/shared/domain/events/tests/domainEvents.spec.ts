import { UniqueEntityID } from '../../UniqueEntityID';
import { DomainEvents } from '../DomainEvents';
import { MockJobAggregateRoot } from './mocks/domain/mockJobAggregateRoot';
import { mockJobAggregateRootId } from './mocks/domain/mockJobAggregateRootId';
import { MockJobCreatedEvent } from './mocks/events/mockJobCreatedEvent';
import { MockPostToSocial } from './mocks/services/mockPostToSocial';

let social: MockPostToSocial;
let job: MockJobAggregateRoot | null;

// eslint-disable-next-line no-console
console.info = () => {};

describe('Domain Events', () => {
  beforeEach(() => {
    social = new MockPostToSocial();
    social.setupSubscriptions();

    DomainEvents.clearHandlers();
    DomainEvents.clearMarkedAggregates();

    job = null;
  });

  describe('Given a JobCreatedEvent, JobDeletedEvent and a PostToSocial handler class', () => {
    it('should be able to setup event subscription', () => {
      social = new MockPostToSocial();
      social.setupSubscriptions();

      expect(Object.keys(DomainEvents.getHandlers()).length).toBe(2);
      expect(DomainEvents.getHandler(MockJobCreatedEvent.name).length).toBe(1);
    });

    it('There should be exactly one handler subscribed to the JobCreatedEvent', () => {
      social = new MockPostToSocial();
      social.setupSubscriptions();

      expect(DomainEvents.getHandler(MockJobCreatedEvent.name).length).toBe(1);
    });

    it('There should be exactly one handler subscribed to the JobDeletedEvent', () => {
      social = new MockPostToSocial();
      social.setupSubscriptions();

      expect(DomainEvents.getHandler(MockJobCreatedEvent.name).length).toBe(1);
    });

    it('Should add the event to the DomainEvents list when the event is created', () => {
      job = MockJobAggregateRoot.createJob({ name: 'job name' }, mockJobAggregateRootId);

      const domainEventsAggregateSpy = jest.spyOn(DomainEvents, 'markAggregateForDispatch');

      expect(domainEventsAggregateSpy).toHaveBeenCalledTimes(0);
      expect(DomainEvents.getMarkedAggregates().length).toBe(1);
    });

    it('Should call the handlers when the event is dispatched after marking the aggregate root', () => {
      social = new MockPostToSocial();
      social.setupSubscriptions();

      const jobCreatedEventSpy = jest.spyOn(social, 'handleJobCreatedEvent');
      const jobDeletedEventSpy = jest.spyOn(social, 'handleJobDeletedEvent');

      // create the event, mark the aggregate
      job = MockJobAggregateRoot.createJob({ name: 'job name' }, mockJobAggregateRootId);
      job.deleteJob();

      // dispatch the events now
      DomainEvents.dispatchEventsForAggregate(mockJobAggregateRootId);

      expect(jobCreatedEventSpy).toHaveBeenCalled();
      expect(jobDeletedEventSpy).toHaveBeenCalled();
    });

    it('Should remove the marked aggregate from the marked aggregates list after it gets dispatched', () => {
      // create the event, mark the aggregate
      job = MockJobAggregateRoot.createJob({ name: 'job name' }, mockJobAggregateRootId);

      // dispatch the events now
      DomainEvents.dispatchEventsForAggregate(mockJobAggregateRootId);

      expect(DomainEvents.getMarkedAggregates().length).toBe(0);
    });

    it("Should keep the events when the aggregate events hasn't been dispatched", () => {
      job = MockJobAggregateRoot.createJob({ name: 'job name' }, new UniqueEntityID('99'));

      job.deleteJob();

      expect(DomainEvents.getMarkedAggregates()[0].domainEvents.length).toBe(2);
    });
  });
});
