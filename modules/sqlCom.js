const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: 'cms',
  // Your password
  password: 'cms',
  database: 'CMS',
});

connection.connect((err) => {
  if (err) {
    throw err;
  }
});

module.exports = connection;
