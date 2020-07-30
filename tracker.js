const express = require("express");
const path = require("path");
const inquirer = require('inquirer'); 
const db = require("./modules/sqlCom"); // load db connection
const sqlQueries = require("./modules/queries"); // template for queries


const app = express();
app.use(express.static(path.join(__dirname, ".")));

// present greeting to user.
require("./modules/banners")(app);

db.query('SELECT * FROM CMS.department;', function (error, results, fields) {
  if (error) throw error
  console.table(results);
 })
