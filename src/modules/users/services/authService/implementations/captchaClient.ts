import { AxiosResponse } from 'axios';
import { BaseAPI } from '../../../../../shared/infra/http/BaseAPI';

export type CaptchaConfiguration = {
  secretKey: string;
};

export class CaptchaClient extends BaseAPI {
  constructor(private config: CaptchaConfiguration) {
    super('https://www.google.com/recaptcha/api');
  }

  async validateResponse(token: string): Promise<boolean> {
    const res: AxiosResponse = await this.post('/siteverify', null, {
      secret: this.config.secretKey,
      response: token,
    });

    return res.data.success;
  }
}
