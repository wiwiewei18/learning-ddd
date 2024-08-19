const mysql = require('mysql2');

require('dotenv').config();

const { SQLDB_HOST, SQLDB_USER, SQLDB_PASSWORD, SQLDB_PORT, SQLDB_DEV_NAME, SQLDB_TEST_NAME, NODE_ENV } = process.env;

const dbName = NODE_ENV === 'development' ? SQLDB_DEV_NAME : SQLDB_TEST_NAME;

const connection = mysql.createConnection({
  host: SQLDB_HOST,
  user: SQLDB_USER,
  password: SQLDB_PASSWORD,
  port: SQLDB_PORT,
});

connection.connect((err) => {
  if (err) throw err;
  connection.query(`CREATE DATABASE ${dbName}`, (err, result) => {
    if (err && err.code === 'ER_DB_CREATE_EXISTS') {
      console.log(`${dbName} DB already created`);
      process.exit(0);
    }

    if (err) throw err;

    console.log(`${dbName} DB created`);
    process.exit(0);
  });
});
