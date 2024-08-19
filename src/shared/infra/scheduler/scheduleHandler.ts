import { Job } from '@hokify/agenda';
import { JobScheduleData } from './schedulingService';

export interface ScheduleHandler {
  readonly key: string;
  execute(job: Job<JobScheduleData>): Promise<unknown>;
}
