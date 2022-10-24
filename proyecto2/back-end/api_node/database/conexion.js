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
      console.log(`Host: ${con.host}`);
      console.log(`Port: ${con.port}`);
      console.log(`User: ${con.user}`);
      console.log(`Database: ${con.database}`);
      console.log(`Password: ${con.password}`);
      return;
    }
    console.log('> Correct, DB connected.');
});

module.exports = conn;
