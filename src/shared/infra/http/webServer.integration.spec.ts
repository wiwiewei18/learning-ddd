import mongoose from 'mongoose';
import { AppConfiguration } from '../../../config/appConfig';
import { CompositionRoot } from '../../composition/compositionRoot';
import { WebServer } from './webServer';

describe('WebServer', () => {
  let compositionRoot: CompositionRoot;
  let server: WebServer;

  beforeAll(async () => {
    const config = new AppConfiguration();

    await mongoose.connect(config.getDatabaseConfiguration().mongoose.dbUrl);

    compositionRoot = new CompositionRoot(config);
    server = compositionRoot.getWebServer();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('can start', async () => {
    await server.start();

    expect(server.isStarted()).toBe(true);
  });

  it('can stop', async () => {
    await server.stop();

    expect(server.isStarted()).toBe(false);
  });
});
