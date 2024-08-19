import pino from 'pino';

export const logger =
  process.env.NODE_ENV === 'test'
    ? {
        error: () => {},
        info: () => {},
      }
    : pino({
        transport: {
          targets: [
            {
              level: 'error',
              target: 'pino-pretty',
              options: {
                colorize: false,
                destination: `logs/error.log`,
                translateTime: 'SYS:standard',
              },
            },
            {
              level: 'info',
              target: 'pino-pretty',
              options: {
                colorize: false,
                destination: `logs/all.log`,
                translateTime: 'SYS:standard',
              },
            },
            {
              level: 'info',
              target: 'pino-pretty',
              options: {
                colorize: true,
                ignore: 'pid,hostname',
              },
            },
          ],
        },
      });
