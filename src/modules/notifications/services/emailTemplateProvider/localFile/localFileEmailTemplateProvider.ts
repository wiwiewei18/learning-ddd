import fs from 'fs';
import path from 'path';
import { EmailTemplateService } from '../emailTemplateProvider';

export class LocalFileEmailTemplateService implements EmailTemplateService {
  async generateEmailVerificationTemplate(): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileDir = path.resolve(__dirname, './verificationEmailTemplate.html');

      fs.readFile(fileDir, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data.toString('utf-8'));
      });
    });
  }
}
