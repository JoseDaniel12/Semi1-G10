const mysql = require('mysql2');
require('dotenv').config();

const conn = mysql.createConnection({
  host: process.env.BASE_HOST,
  port: process.env.DB_PORT,
  user: process.env.BASE_USER,
  database: process.env.BASE_NOMBRE,
  password: process.env.BASE_PASSWORD,
  multipleStatements: true
});

conn.connect(function (err) {
    if (err) {
      console.log(`ERROR: DB not connected: \n${err.stack}`);
      console.log(`Host: ${conn.host}`);
      console.log(`Port: ${conn.port}`);
      console.log(`User: ${conn.user}`);
      console.log(`Database: ${conn.database}`);
      console.log(`Password: ${conn.password}`);
      return;
    }
    console.log('> Correct, DB connected.');
});

module.exports = conn;
