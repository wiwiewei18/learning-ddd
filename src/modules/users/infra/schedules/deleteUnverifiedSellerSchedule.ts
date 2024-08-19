import { Job } from '@hokify/agenda';
import { logger } from '../../../../shared/infra/logger';
import { ScheduleHandler } from '../../../../shared/infra/scheduler/scheduleHandler';
import { JobScheduleData } from '../../../../shared/infra/scheduler/schedulingService';
import { DeleteSellerUseCase } from '../../useCases/seller/deleteSeller/deleteSellerUseCase';
import { deleteUnverifiedSellerJobName } from './jobNames';

export class DeleteUnverifiedSellerScheduleHandler implements ScheduleHandler {
  readonly key = deleteUnverifiedSellerJobName;
  private deleteSellerUseCase: DeleteSellerUseCase;

  constructor(deleteSellerUseCase: DeleteSellerUseCase) {
    this.deleteSellerUseCase = deleteSellerUseCase;
  }

  async execute(job: Job<JobScheduleData>): Promise<void> {
    try {
      const result = await this.deleteSellerUseCase.execute({ sellerId: job.attrs.data.sellerId });

      if (result.isLeft()) {
        throw new Error(result.value.getErrorValue());
      }

      logger.info(`Success to execute DeleteSellerUseCase on deleteUnverifiedSeller schedule`);
    } catch (error) {
      logger.error(error, `Failed to execute DeleteSellerUseCase on deleteUnverifiedSeller schedule`);
    }
  }
}
