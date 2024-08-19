import { Agenda } from '@hokify/agenda';
import mongoose from 'mongoose';
import {
  deleteUnverifiedBuyerJobName,
  deleteUnverifiedSellerJobName,
} from '../../../modules/users/infra/schedules/jobNames';
import { logger } from '../logger';
import { ScheduleHandler } from './scheduleHandler';
import { JobSchedule, JobScheduleData, SchedulingService, SchedulingServiceConfiguration } from './schedulingService';

export class AgendaSchedulingService implements SchedulingService {
  private agenda: Agenda;

  constructor(
    private config: SchedulingServiceConfiguration,
    controllers: ScheduleHandler[],
  ) {
    this.agenda = this.createAgenda();
    this.configureAgenda();
    this.setupSchedules(controllers);
  }

  private createAgenda() {
    const agenda = new Agenda();
    agenda.mongo(mongoose.connection.db as any);
    return agenda;
  }

  async start(): Promise<void> {
    await this.agenda.start();
  }

  async stop(): Promise<void> {
    await this.agenda.stop();
  }

  private configureAgenda() {
    this.agenda.on('ready', () => {
      logger.info(`Agenda is ready`);
    });

    this.agenda.on('error', (err) => {
      logger.error(err, `Error when connecting Agenda`);
    });

    this.agenda.on('processJob', (job) => {
      logger.info(job.attrs, `Agenda processJob event`);
    });

    this.agenda.on('complete', (job) => {
      logger.info(job.attrs, `Agenda complete event`);
    });

    this.agenda.on('start', (job) => {
      logger.info(job.attrs, `Agenda start event`);
    });

    this.agenda.on('success', (job) => {
      logger.info(job.attrs, `Agenda success event`);
    });

    this.agenda.on('fail', (err) => {
      logger.error(err, `Agenda fail event`);
    });
  }

  private setupSchedules(controllers: ScheduleHandler[]) {
    controllers.forEach(async (controller) => this.agenda.define(controller.key, controller.execute));
  }

  async scheduleUnverifiedBuyerDeletion(buyerId: string): Promise<void> {
    await this.agenda.schedule(`${this.config.emailVerificationExpiryTimeInMinutes} minutes`, deleteUnverifiedBuyerJobName, {
      buyerId,
    });
  }

  async cancelBuyerDeletionSchedule(buyerId: string): Promise<void> {
    await this.agenda.cancel({ name: deleteUnverifiedBuyerJobName, data: { buyerId } });
  }

  async getAllScheduledJobs(name: string): Promise<JobSchedule[]> {
    const jobs = await this.agenda.jobs({ name });
    const scheduledJobs: JobSchedule[] = jobs.map((job) => {
      return {
        name: job.attrs.name,
        data: job.attrs.data as JobScheduleData,
        nextRunAt: job.attrs.nextRunAt,
      };
    });

    return scheduledJobs;
  }

  async scheduleUnverifiedSellerDeletion(sellerId: string): Promise<void> {
    await this.agenda.schedule(
      `${this.config.emailVerificationExpiryTimeInMinutes} minutes`,
      deleteUnverifiedSellerJobName,
      {
        sellerId,
      },
    );
  }

  async cancelSellerDeletionSchedule(sellerId: string): Promise<void> {
    await this.agenda.cancel({ name: deleteUnverifiedSellerJobName, data: { sellerId } });
  }

  async cancelAllJobs(): Promise<void> {
    await this.agenda.cancel({});
  }
}
