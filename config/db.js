const mysql2 = require('mysql2');
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

const options = {
  host: process.env.TIDB_HOST,
  port: process.env.TIDB_PORT,
  user: process.env.TIDB_USER ,
  password: process.env.TIDB_PASSWORD ,
  database: process.env.TIDB_DATABASE ,
  ssl: process.env.TIDB_ENABLE_SSL === 'true' ? {
     minVersion: 'TLSv1.2',
     ca: process.env.TIDB_CA_PATH ? fs.readFileSync(process.env.TIDB_CA_PATH) : undefined
  } : null,
}

const conn = mysql2.createConnection(options);

//const connection = createConnection('mysql://3RSh6d36QBZx1fa.root:07mpHgW08fzOnJ4g@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');


// // Connect to the MySQL server
// connection.connect((error) => {
//   if (error) {
//     console.error('Error connecting to MySQL:', error);
//     return;
//   }
//   console.log('Connected to MySQL server.');
//   connection.end();
// });
//conn.end();

module.exports = Object.freeze({
  kal_db:conn.promise(),
});
