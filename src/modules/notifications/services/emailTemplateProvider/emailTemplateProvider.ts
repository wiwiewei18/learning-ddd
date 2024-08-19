export interface EmailTemplateService {
  generateEmailVerificationTemplate(): Promise<string>;
}
