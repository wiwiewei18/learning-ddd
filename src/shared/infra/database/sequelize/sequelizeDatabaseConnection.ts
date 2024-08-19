import { Sequelize } from 'sequelize';
import { DatabaseConnection } from '../databaseConnection';

export type SequelizeDatabaseConfiguration = {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
};

export class SequelizeDatabaseConnection implements DatabaseConnection {
  private sequelize: Sequelize;

  constructor(private config: SequelizeDatabaseConfiguration) {
    this.sequelize = this.createSequelize();
  }

  private createSequelize() {
    return new Sequelize(this.config.database, this.config.username, this.config.password, {
      host: this.config.host,
      port: this.config.port,
      dialect: 'mysql',
      dialectOptions: { decimalNumbers: true },
      logging: false,
      define: {
        freezeTableName: true,
        timestamps: true,
        underscored: true,
      },
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
    });
  }

  async isConnected(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      return true;
    } catch (error) {
      return false;
    }
  }

  async stop(): Promise<void> {
    await this.sequelize.close();
  }
}
