import mongoose from 'mongoose';
import { DatabaseConnection } from '../databaseConnection';

export type MongooseDatabaseConfiguration = {
  dbUrl: string;
};

export class MongooseDatabaseConnection implements DatabaseConnection {
  constructor(private config: MongooseDatabaseConfiguration) {
    mongoose.connect(this.config.dbUrl);
  }

  async isConnected(): Promise<boolean> {
    if (mongoose.connection.readyState === 1) return true;
    return false;
  }
}
