import { UserRepo } from '../../repos/userRepo/userRepo';
import { DeleteBuyerUseCase } from '../../useCases/buyer/deleteBuyer/DeleteBuyerUseCase';
import { DeleteSellerUseCase } from '../../useCases/seller/deleteSeller/deleteSellerUseCase';
import { DeleteUnverifiedBuyerScheduleHandler } from './deleteUnverifiedBuyerSchedule';
import { DeleteUnverifiedSellerScheduleHandler } from './deleteUnverifiedSellerSchedule';

export class UserScheduleHandler {
  private userRepo: UserRepo;

  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  getHandlers() {
    return [this.createDeleteUnverifiedBuyerScheduleHandler(), this.createDeleteUnverifiedSellerScheduleHandler()];
  }

  private createDeleteUnverifiedBuyerScheduleHandler() {
    return new DeleteUnverifiedBuyerScheduleHandler(this.createDeleteBuyerUseCase());
  }

  private createDeleteBuyerUseCase() {
    return new DeleteBuyerUseCase(this.userRepo);
  }

  private createDeleteSellerUseCase() {
    return new DeleteSellerUseCase(this.userRepo);
  }

  private createDeleteUnverifiedSellerScheduleHandler() {
    return new DeleteUnverifiedSellerScheduleHandler(this.createDeleteSellerUseCase());
  }
}
