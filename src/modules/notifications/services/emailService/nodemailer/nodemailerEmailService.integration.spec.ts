import { Transporter } from 'nodemailer';
import { createRandomEmail } from '../../../domain/tests/fixtures/email.fixture';
import { EmailService } from '../emailService';
import { NodemailerEmailService } from './nodemailerEmailService';

let nodemailerEmailService: EmailService;
let nodemailerTestTransporter: Transporter;

describe('EmailService integration test', () => {
  beforeAll(async () => {
    nodemailerTestTransporter = await NodemailerEmailService.createCreateTestTransporter();
  }, 100000);

  beforeEach(() => {
    nodemailerEmailService = new NodemailerEmailService(nodemailerTestTransporter);
  });

  afterAll(() => {
    nodemailerTestTransporter.close();
  }, 100000);

  it('should be able to send email', async () => {
    const email = createRandomEmail();

    const sendEmailSpy = jest.spyOn(nodemailerEmailService, 'sendEmail');

    await nodemailerEmailService.sendEmail(email);

    expect(sendEmailSpy).toHaveBeenCalled();
  }, 100000);
});
