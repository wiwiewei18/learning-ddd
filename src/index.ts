import { AppConfiguration } from './config/appConfig';
import { CompositionRoot } from './shared/composition/compositionRoot';
import { MongooseDatabaseConnection } from './shared/infra/database/mongoose/mongooseDatabaseConnection';
import { SequelizeDatabaseConnection } from './shared/infra/database/sequelize/sequelizeDatabaseConnection';

const config = new AppConfiguration();

const sequelizeDatabaseConnection = new SequelizeDatabaseConnection(config.getDatabaseConfiguration().sequelize);
const mongooseDatabaseConnection = new MongooseDatabaseConnection(config.getDatabaseConfiguration().mongoose);

Promise.all([mongooseDatabaseConnection.isConnected(), sequelizeDatabaseConnection.isConnected()]).then(async () => {
  const compositionRoot = new CompositionRoot(config);
  const webServer = compositionRoot.getWebServer();
  await webServer.start();
});
