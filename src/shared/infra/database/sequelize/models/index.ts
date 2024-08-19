/* eslint-disable global-require, import/no-dynamic-require, security/detect-non-literal-require, no-param-reassign, security/detect-non-literal-fs-filename, @typescript-eslint/no-var-requires */

import { readdirSync, statSync } from 'fs';
import { basename as _basename, join } from 'path';
import { logger } from '../../../logger';
import { sequelize } from '../config/config';

const basename = _basename(__filename);

interface Models {
  [key: string]: any;
}

const inMemoryModels: Models = {};

const initializeModel = (dirPath: string, models: Models = {}) => {
  readdirSync(dirPath)
    .filter((file) => file.indexOf('.') !== 0 && file !== basename && !file.includes('.map'))
    .forEach((file) => {
      if (statSync(join(dirPath, file)).isDirectory()) {
        models = initializeModel(join(dirPath, file), models);
      } else {
        try {
          const model = require(join(dirPath, file)).default(sequelize);
          const modelName = !model.modelName ? model.name : model.modelName;
          models[modelName] = model;

          inMemoryModels[modelName] = [];
        } catch (err) {
          logger.error(err, `Error initialize model on ${file}`);
          throw err;
        }
      }
    });
  return models;
};

const models = initializeModel(__dirname);

Object.keys(models).forEach(async (modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.inMemoryModels = inMemoryModels;

export default models;
