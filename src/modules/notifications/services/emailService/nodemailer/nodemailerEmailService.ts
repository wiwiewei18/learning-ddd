import nodemailer from 'nodemailer';
import { EmailService } from '../emailService';
import { Email } from '../../../domain/email';
import { logger } from '../../../../../shared/infra/logger';

export class NodemailerEmailService implements EmailService {
  private transporter: nodemailer.Transporter;

  constructor(transporter: nodemailer.Transporter) {
    this.transporter = transporter;
  }

  static createTransporter(config: any): nodemailer.Transporter {
    return nodemailer.createTransport(config);
  }

  static async createCreateTestTransporter(): Promise<nodemailer.Transporter> {
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  async sendEmail(email: Email): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: { name: email.senderName, address: email.senderAddress.value },
        to: { name: email.recipientName, address: email.recipientAddress.value },
        subject: email.subject,
        html: email.emailBody.html,
      });
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
