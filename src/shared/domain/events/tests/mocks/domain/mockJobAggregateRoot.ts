import { AggregateRoot } from '../../../../AggregateRoot';
import { UniqueEntityID } from '../../../../UniqueEntityID';
import { MockJobCreatedEvent } from '../events/mockJobCreatedEvent';
import { MockJobDeletedEvent } from '../events/mockJobDeletedEvent';

export interface MockJobProps {
  name: string;
}

export class MockJobAggregateRoot extends AggregateRoot<MockJobProps> {
  public static createJob(props: MockJobProps, id?: UniqueEntityID): MockJobAggregateRoot {
    const job = new this(props, id);
    job.addDomainEvent(new MockJobCreatedEvent(job.id));
    return job;
  }

  public deleteJob(): void {
    this.addDomainEvent(new MockJobDeletedEvent(this.id));
  }
}
