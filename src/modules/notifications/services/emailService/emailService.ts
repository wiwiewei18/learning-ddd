import { Email } from '../../domain/email';

export type EmailServiceConfiguration = {
  apiKey: string;
  domain: string;
  host: string;
};

export interface EmailService {
  sendEmail(email: Email): Promise<void>;
}
