import { EmailService } from './emailService';

export class StubEmailService implements EmailService {
  sendEmail(): Promise<void> {
    return Promise.resolve();
  }
}
