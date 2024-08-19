import { logger } from '../../logger';

type CallablePromise<T> = () => Promise<T>;

export class MigrationUtils {
  static async run(promises: CallablePromise<any>[]) {
    for (const command of promises) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await command();
      } catch (err: any) {
        if (!err.original) {
          logger.error(err);
          throw new Error(err);
        } else if (err.original.code === 'ER_DUP_FIELDNAME') {
          /**
           * error when the same field name already exists
           */
          logger.info('passable error occurred: ER_DUP_FIELDNAME');
        } else if (err.original.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
          /**
           * when the field doesn't exists and we try to drop it
           */
          logger.info(`passable error occurred: ER_CANT_DROP_FIELD_OR_KEY`);
        } else if (err.name === 'SequelizeUnknownConstraintError') {
          logger.info(`passable error. trying to remove constraint that's already been removed`);
        } else {
          logger.error(err);
          throw new Error(err);
        }
      }
    }
  }
}
