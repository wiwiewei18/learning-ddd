export type SchedulingServiceConfiguration = {
  emailVerificationExpiryTimeInMinutes: number;
};

export interface JobSchedule {
  name: string;
  data: JobScheduleData;
  nextRunAt: Date | null;
}

export type JobScheduleData = { [key: string]: any };

export interface SchedulingService {
  start(): Promise<void>;
  stop(): Promise<void>;
  cancelAllJobs(): Promise<void>;
  scheduleUnverifiedBuyerDeletion(buyerId: string): Promise<void>;
  cancelBuyerDeletionSchedule(buyerId: string): Promise<void>;
  cancelSellerDeletionSchedule(sellerId: string): Promise<void>;
  getAllScheduledJobs(name: string): Promise<JobSchedule[]>;
  scheduleUnverifiedSellerDeletion(sellerId: string): Promise<void>;
}
