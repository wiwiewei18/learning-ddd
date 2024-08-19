import { Job } from '@hokify/agenda';
import { logger } from '../../../../shared/infra/logger';
import { ScheduleHandler } from '../../../../shared/infra/scheduler/scheduleHandler';
import { JobScheduleData } from '../../../../shared/infra/scheduler/schedulingService';
import { DeleteBuyerUseCase } from '../../useCases/buyer/deleteBuyer/DeleteBuyerUseCase';
import { deleteUnverifiedBuyerJobName } from './jobNames';

export class DeleteUnverifiedBuyerScheduleHandler implements ScheduleHandler {
  readonly key = deleteUnverifiedBuyerJobName;
  private deleteBuyerUseCase: DeleteBuyerUseCase;

  constructor(deleteBuyerUseCase: DeleteBuyerUseCase) {
    this.deleteBuyerUseCase = deleteBuyerUseCase;
  }

  async execute(job: Job<JobScheduleData>): Promise<void> {
    try {
      const result = await this.deleteBuyerUseCase.execute({ buyerId: job.attrs.data.buyerId });

      if (result.isLeft()) {
        throw new Error(result.value.getErrorValue());
      }

      logger.info(`Success to execute DeleteBuyerUseCase on deleteUnverifiedBuyer schedule`);
    } catch (error) {
      logger.error(error, `Failed to execute DeleteBuyerUseCase on deleteUnverifiedBuyer schedule`);
    }
  }
}
