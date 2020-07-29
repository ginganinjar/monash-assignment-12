const express = require("express");

const path = require("path");
const { sqlCom } = require("./modules/sqlCom");

const app = express();
app.use(express.static(path.join(__dirname, ".")));

// present greeting to user.
require("./modules/banners")(app);
require("./modules/sqlCom");

const user = require('./modules/sqlCom',"hello");

console.log(`User: ${user.sqlCom()}`);