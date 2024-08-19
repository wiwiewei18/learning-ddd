// todo: later on will try using doppler and docker to configure the testing environment
import 'dotenv/config';
import { ContentStorageServiceConfiguration } from '../modules/catalogs/services/contentStorageService/contentStorageService';
import { EmailServiceConfiguration } from '../modules/notifications/services/emailService/emailService';
import { AuthenticationConfiguration } from '../modules/users/services/authService/authService';
import { MongooseDatabaseConfiguration } from '../shared/infra/database/mongoose/mongooseDatabaseConnection';
import { SequelizeDatabaseConfiguration } from '../shared/infra/database/sequelize/sequelizeDatabaseConnection';
import { HttpConfiguration } from '../shared/infra/http/webServer';
import { SchedulingServiceConfiguration } from '../shared/infra/scheduler/schedulingService';

export type DatabaseConfiguration = {
  sequelize: SequelizeDatabaseConfiguration;
  mongoose: MongooseDatabaseConfiguration;
};

export class AppConfiguration {
  private getRequiredConfiguration(name: string) {
    const configurationValue = process.env[name];
    if (!configurationValue) {
      throw new Error(`${name} is required environment variable`);
    }
    return configurationValue;
  }

  isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  isTesting() {
    return process.env.NODE_ENV === 'test';
  }

  private getSequelizeDatabaseConfiguration(): SequelizeDatabaseConfiguration {
    let database;

    if (this.isProduction()) {
      database = this.getRequiredConfiguration('SQLDB_PROD_NAME');
    } else if (this.isTesting()) {
      database = this.getRequiredConfiguration('SQLDB_TEST_NAME');
    } else {
      database = this.getRequiredConfiguration('SQLDB_DEV_NAME');
    }

    return {
      username: this.getRequiredConfiguration('SQLDB_USER'),
      password: this.getRequiredConfiguration('SQLDB_PASSWORD'),
      database,
      host: this.getRequiredConfiguration('SQLDB_HOST'),
      port: Number(this.getRequiredConfiguration('SQLDB_PORT')),
    };
  }

  private getMongooseDatabaseConfiguration(): MongooseDatabaseConfiguration {
    const dbName = this.isTesting()
      ? this.getRequiredConfiguration('MONGODB_TEST_NAME')
      : this.getRequiredConfiguration('MONGODB_DEV_NAME');

    return {
      dbUrl: this.isProduction()
        ? this.getRequiredConfiguration('MONGODB_PROD_URL')
        : `${this.getRequiredConfiguration('MONGODB_URL')}${dbName}`,
    };
  }

  getDatabaseConfiguration(): DatabaseConfiguration {
    return {
      sequelize: this.getSequelizeDatabaseConfiguration(),
      mongoose: this.getMongooseDatabaseConfiguration(),
    };
  }

  getServerConfiguration(): HttpConfiguration {
    return {
      port: Number(process.env.PORT) || 5000,
    };
  }

  getAuthenticationConfiguration(): AuthenticationConfiguration {
    return {
      buyerEmailVerificationCallbackUrl: this.getRequiredConfiguration('BUYER_EMAIL_VERIFICATION_CALLBACK_URL'),
      sellerEmailVerificationCallbackUrl: this.getRequiredConfiguration('SELLER_EMAIL_VERIFICATION_CALLBACK_URL'),
      emailVerificationSenderEmailAddress: this.getRequiredConfiguration('EMAIL_VERIFICATION_SENDER_EMAIL'),
      emailVerificationSenderName: this.getRequiredConfiguration('EMAIL_VERIFICATION_SENDER_NAME'),
      jwtSecret: this.getRequiredConfiguration('JWT_SECRET'),
      captchaSecretKey: this.getRequiredConfiguration('RECAPTCHA_SECRET_KEY'),
    };
  }

  getEmailServiceConfiguration(): EmailServiceConfiguration {
    return {
      apiKey: this.getRequiredConfiguration('MAIL_API_KEY'),
      domain: this.getRequiredConfiguration('MAIL_DOMAIN'),
      host: this.getRequiredConfiguration('MAIL_HOST'),
    };
  }

  getContentStorageServiceConfiguration(): ContentStorageServiceConfiguration {
    const bucketName = this.isProduction()
      ? this.getRequiredConfiguration('S3_PROD_BUCKET_NAME')
      : this.getRequiredConfiguration('S3_DEV_BUCKET_NAME');

    const publicUrl = this.isProduction()
      ? this.getRequiredConfiguration('S3_PROD_CDN_PUBLIC_URL')
      : this.getRequiredConfiguration('S3_DEV_CDN_PUBLIC_URL');

    return {
      accessKeyId: this.getRequiredConfiguration('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.getRequiredConfiguration('S3_SECRET_ACCESS_KEY'),
      endpoint: this.getRequiredConfiguration('S3_ENDPOINT'),
      region: this.getRequiredConfiguration('S3_REGION'),
      bucketName,
      publicUrl,
      saveLocationBaseDirPath: this.isProduction() ? 'prod' : 'dev',
    };
  }

  getScheduleServiceConfiguration(): SchedulingServiceConfiguration {
    return {
      emailVerificationExpiryTimeInMinutes: 30,
    };
  }
}
