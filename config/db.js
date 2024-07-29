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

//const connection = mysql.createConnection(process.env.DB_URL);
const connection = mysql.createConnection('mysql://3RSh6d36QBZx1fa.root:07mpHgW08fzOnJ4g@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');


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
