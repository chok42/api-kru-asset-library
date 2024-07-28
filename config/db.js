const mysql = require('mysql2');
require('dotenv').config()
//ในเครื่อง
// const pool1 = mariadb.createPool({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "",
//     database: "kru_asset_library_db",
//     dateStrings: 'date',
// });

//
const connection = mysql.createConnection(process.env.DB_URL);


connection.connect(function(err) {
  if (err) {
      console.error('error connecting: ' + err.stack);
      return;
  }
  console.log('connected as id ' + connection.threadId);
});

module.exports = Object.freeze({
  kal_db:connection.promise(),
});
