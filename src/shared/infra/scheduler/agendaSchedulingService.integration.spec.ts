import mongoose from 'mongoose';
import { AppConfiguration } from '../../../config/appConfig';
import {
  deleteUnverifiedBuyerJobName,
  deleteUnverifiedSellerJobName,
} from '../../../modules/users/infra/schedules/jobNames';
import { CompositionRoot } from '../../composition/compositionRoot';
import { SchedulingService } from './schedulingService';

describe('AgendaSchedulingService', () => {
  let schedulingService: SchedulingService;
  let compositionRoot: CompositionRoot;

  beforeAll(async () => {
    const config = new AppConfiguration();

    await mongoose.connect(config.getDatabaseConfiguration().mongoose.dbUrl);

    compositionRoot = new CompositionRoot(config);
  });

  beforeEach(async () => {
    schedulingService = compositionRoot.getSchedulingService();
  });

  afterEach(async () => {
    await schedulingService.cancelAllJobs();
    await schedulingService.stop();
  });

  afterAll(async () => {
    await mongoose.connection.close(true);
  });

  describe('scheduleUnverifiedBuyerDeletion', () => {
    it('should be able to create schedule to delete unverified bu yer using buyer id', async () => {
      await schedulingService.scheduleUnverifiedBuyerDeletion('123');

      const activeUnverifiedBuyerDeletionJobs = await schedulingService.getAllScheduledJobs(deleteUnverifiedBuyerJobName);
      expect(activeUnverifiedBuyerDeletionJobs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('scheduleUnverifiedSellerDeletion', () => {
    it('should be able to create schedule to delete unverified seller using seller id', async () => {
      await schedulingService.scheduleUnverifiedSellerDeletion('123');

      const activeUnverifiedSellerDeletionJobs = await schedulingService.getAllScheduledJobs(deleteUnverifiedSellerJobName);
      expect(activeUnverifiedSellerDeletionJobs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('cancelBuyerDeletionSchedule', () => {
    it('should be able to cancel buyer deletion schedule', async () => {
      await schedulingService.scheduleUnverifiedBuyerDeletion('123');

      await schedulingService.cancelBuyerDeletionSchedule('123');

      const activeUnverifiedBuyerDeletionJobs = await schedulingService.getAllScheduledJobs(deleteUnverifiedBuyerJobName);

      expect(activeUnverifiedBuyerDeletionJobs.length).toBe(0);
    });

    it('should not cancel other buyer deletion schedule', async () => {
      await schedulingService.scheduleUnverifiedBuyerDeletion('123');
      await schedulingService.scheduleUnverifiedBuyerDeletion('234');

      await schedulingService.cancelBuyerDeletionSchedule('123');

      const activeUnverifiedBuyerDeletionJobs = await schedulingService.getAllScheduledJobs(deleteUnverifiedBuyerJobName);

      expect(activeUnverifiedBuyerDeletionJobs.length).toBe(1);
    });
  });

  describe('cancelSellerDeletionSchedule', () => {
    it('should be able to cancel seller deletion schedule', async () => {
      await schedulingService.scheduleUnverifiedSellerDeletion('123');

      await schedulingService.cancelSellerDeletionSchedule('123');

      const activeUnverifiedSellerDeletionJobs = await schedulingService.getAllScheduledJobs(deleteUnverifiedSellerJobName);

      expect(activeUnverifiedSellerDeletionJobs.length).toBe(0);
    });

    it('should not cancel other seller deletion schedule', async () => {
      await schedulingService.scheduleUnverifiedSellerDeletion('123');
      await schedulingService.scheduleUnverifiedSellerDeletion('234');

      await schedulingService.cancelSellerDeletionSchedule('123');

      const activeUnverifiedSellerDeletionJobs = await schedulingService.getAllScheduledJobs(deleteUnverifiedSellerJobName);

      expect(activeUnverifiedSellerDeletionJobs.length).toBe(1);
    });
  });
});
