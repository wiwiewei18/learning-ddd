/* eslint-disable import/no-import-module-exports */
import { Sequelize } from 'sequelize';

import 'dotenv/config';

const { NODE_ENV, SQLDB_USER, SQLDB_PASSWORD, SQLDB_HOST, SQLDB_PORT, SQLDB_PROD_NAME, SQLDB_DEV_NAME, SQLDB_TEST_NAME } =
  process.env;

const databaseCredentials = {
  development: {
    username: SQLDB_USER,
    password: SQLDB_PASSWORD,
    database: SQLDB_DEV_NAME,
    host: SQLDB_HOST,
    dialect: 'mysql',
  },
  test: {
    username: SQLDB_USER,
    password: SQLDB_PASSWORD,
    database: SQLDB_TEST_NAME,
    host: SQLDB_HOST,
    dialect: 'mysql',
  },
  production: {
    username: SQLDB_USER,
    password: SQLDB_PASSWORD,
    database: SQLDB_PROD_NAME,
    host: SQLDB_HOST,
    dialect: 'mysql',
  },
};

const { username, password, database, host, dialect } = databaseCredentials[NODE_ENV];

export const sequelize = new Sequelize(database, username, password, {
  host,
  port: SQLDB_PORT,
  dialect,
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

module.exports = { ...databaseCredentials, sequelize };
