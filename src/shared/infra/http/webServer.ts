import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import fileUpload from 'express-fileupload';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import { Server } from 'http';
import { logger } from '../logger';
import { BaseController } from './models/BaseController';

export type HttpConfiguration = {
  port: number;
};

export class WebServer {
  private express: Express;
  private server: Server | undefined;
  private started = false;

  constructor(
    private config: HttpConfiguration,
    controllers: BaseController[],
  ) {
    this.express = this.createExpress();
    this.configureExpress();
    this.setupRoutes(controllers);
    this.setupDefaultRoutes();
  }

  private createExpress() {
    return express();
  }

  private configureExpress() {
    this.express.use(helmet());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cors({ origin: '*' }));
    this.express.use(mongoSanitize({ allowDots: true }));

    this.express.use(compression());
    this.express.use(fileUpload());
  }

  private setupRoutes(controllers: BaseController[]) {
    controllers.forEach((controller) => {
      if (controller.middleware) {
        controller.middleware.forEach((m) => {
          this.express.use(controller.path, m);
        });
      }

      this.express[controller.method](controller.path, (req, res) => controller.execute(req, res));
    });
  }

  private setupDefaultRoutes() {
    this.express.get('/', (_req, res) => {
      res.status(200).send({ status: 'success', code: 200, data: { message: `yo! we're up!` } });
    });

    this.express.use((req, res) => {
      res.status(404).send({
        status: 'failure',
        code: 404,
        data: { message: `${req.protocol}://${req.hostname}${req.originalUrl} url not found` },
      });
    });
  }

  getHttp() {
    if (!this.server) throw new Error(`Server not yet started`);
    return this.server;
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.express.listen(this.config.port, () => {
        logger.info(`Server is running on port ${this.config.port}`);
        this.started = true;
        resolve();
      });
    });
  }

  isStarted() {
    return this.started;
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          this.started = false;
          resolve();
        });
      }
    });
  }
}
