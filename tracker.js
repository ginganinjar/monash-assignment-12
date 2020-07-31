const express = require("express");
const path = require("path");
const inquirer = require('inquirer'); 
const db = require("./modules/sqlCom"); // load db connection
const sqlQueries = require("./modules/queries"); // template for queries
const nav = require("./modules/nav");


const app = express();
app.use(express.static(path.join(__dirname, ".")));

// present greeting to user.



function promptUser(input, title, theMessage, choices) {
 
  return inquirer.prompt(
    
    [
    {
      type: input,
      name: title,
      message: theMessage,
      choices : choices
    }
  ]
  
  
  );
}

async function start() {
  theAnswer = "";

 while (theAnswer.menuSelection !== "Exit") {
  let theAnswer = await promptUser(
    "list",
    "menuSelection",
    "Enter Selection :",
    ["View Employees", 
    "View Employees by Manager", 
    "View Employees by Department", 
    "View Departments", 
    "View Roles", 
    "View Department Budgets", 
    new inquirer.Separator(),
    "Add Employee", 
    "Add Department", 
    "Add Role", 
    new inquirer.Separator(),
    "Update Employee Role", 
    "Update Employee Manager", 
    new inquirer.Separator(),
    "Remove Employee", 
    "Remove Department", 
    "Remove Role", 
    new inquirer.Separator(),
    "Exit",
    new inquirer.Separator()]
  );
 
switch(theAnswer.menuSelection) {
    case "View Employees":
     sendThisSQL = sqlQueries.viewEmployees();
      break;
    case "View Employees by Manager":
      sendThisSQL = sqlQueries.viewEmployeesByManager();
      break;
    case "View Employees by Department":
      sendThisSQL = sqlQueries.viewEmployeesByDepartment();
      break;
    case "View Departments":
      sendThisSQL = sqlQueries.viewDepartments();
      break;
    case "View Roles":
      sendThisSQL = sqlQueries.viewRoles();
      break;
    case "View Department Budgets":
      sendThisSQL = sqlQueries.viewDepartmentBudgets();
      break;

    default:
      // code block
  }

  db.query(sendThisSQL, function (err, result) {
    if (err) throw err;
    console.table("Result: " + result);
  });

  }
}

let myFirstPromise = new Promise((resolve, reject) => {
  require("./modules/banners")(app);

  setTimeout( function() {
    resolve("Success!")  // Yay! Everything went well!
  }, 250) 
}) 

myFirstPromise.then((successMessage) => {
  // successMessage is whatever we passed in the resolve(...) function above.
  // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
 start();

});
