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
      console.log(`DB not connected, ' + ${err.stack}`);
      return;
    }
    console.log('> correct, DB connected');
});

module.exports = conn;
