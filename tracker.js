const express = require("express");
const path = require("path");
const inquirer = require("inquirer");
const db = require("./modules/sqlCom"); // load db connection
const sqlQueries = require("./modules/queries"); // template for queries
const nav = require("./modules/nav");

const app = express();
app.use(express.static(path.join(__dirname, ".")));

// variables
employeeList = [];
departmentList = [];

function findEmployeeId(namedKey, objArray) {
  for (var i = 0; i < objArray.length; i++) {
    if (
      objArray[i].first_name + " " + objArray[i].last_name ===
      namedKey.toString()
    ) {
      return objArray[i].id;
    }
  }
}

function getDepartmentId(namedKey, objArray) {
  for (var i = 0; i < objArray.length; i++) {
    if (objArray[i].name === namedKey) {
      return objArray[i];
    }
  }
}

// present greeting to user.

db.query(sqlQueries.utilGetEmployeeIdsNames(), function (err, results) {
  theEmployeeList = [];
  if (err) throw err;
  theEmployeeList.push("Empty");
  for (let i = 0; i < results.length; i++) {
    employeeList.push(results[i].first_name + " " + results[i].last_name);
  }
  employeeListObj = results;
  // console.log(employeeListObj);
});

db.query(sqlQueries.utilGetDepartmentIdsNames(), function (err, results) {
  if (err) throw err;
  for (let i = 0; i < results.length; i++) {
    departmentList.push(results[i].name);
  }
  departmentListObj = results;
})


function promptUser(input, title, theMessage, choices) {
  return inquirer.prompt([{
    type: input,
    name: title,
    message: theMessage,
    choices: choices,
  }, ]);
}

async function start() {
  theAnswer = "";

  while (theAnswer.menuSelection !== "Exit") {

    let theAnswer = await promptUser(
      "list",
      "menuSelection",
      "Enter Selection :",
      [
        "View Employees",
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
        new inquirer.Separator(),
      ]
    );

    switch (theAnswer.menuSelection) {
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

      case "Add Employee":
        db.query(sqlQueries.utilGetRoleIdsTitles(), function (err, results) {
          if (err) throw err;
          roleList = [];

          for (let i = 0; i < results.length; i++) {
            roleList.push(results[i].title);
          }
          roleFamily = results;
        });

        theAnswer = await promptUser(
          "prompt",
          "employeeFirstName",
          "Enter Employee First Name :",
          []
        );
        firstName = theAnswer.employeeFirstName;

        theAnswer = await promptUser(
          "prompt",
          "employeeLastName",
          "Enter Employees Last Name :",
          []
        );
        lastName = theAnswer.employeeLastName;

        theAnswer = await promptUser(
          "list",
          "jobRole",
          "Enter Job Title",
          roleList
        );

        var roleID = roleList.indexOf(theAnswer.jobRole);

        theAnswer = await promptUser(
          "list",
          "employeeManager",
          "Enter Employees Manager :",
          employeeList
        );

        // Get the correct ID for the appropriate manager
        var newManagerID = findEmployeeId(
            theAnswer.employeeManager,
            employeeListObj
          ) ?
          findEmployeeId(theAnswer.employeeManager, employeeListObj) :
          null;
        sendThisSQL = sqlQueries.addEmployee(
          firstName,
          lastName,
          roleID,
          newManagerID
        );
        break;

      case "Add Department":
        theAnswer = await promptUser(
          "prompt",
          "departmentName",
          "Enter the department name :",
          []
        );

        sendThisSQL = sqlQueries.addDepartment(theAnswer.departmentName);

        break;

      case "Add Role":
        theAnswer = await promptUser(
          "prompt",
          "roleTitle",
          "Enter the Position/Role title :",
          []
        );
        positionTitle = theAnswer.roleTitle;

        theAnswer = await promptUser(
          "prompt",
          "pay",
          "Enter the position pay :",
          []
        );
        positionPay = theAnswer.pay;

        theAnswer = await promptUser(
          "list",
          "departmentList",
          "Enter the department:",
          departmentList
        );

        var newRoleId = getDepartmentId(theAnswer.departmentList, departmentListObj).id;
        sendThisSQL = sqlQueries.addRole(positionTitle, positionPay, newRoleId, newRoleId);
        break;

      default:
        // code block
    }

    // if the user wants to terminate - do so here
    if (theAnswer.menuSelection == "Exit") {
      process.exit(22);
    }

    db.query(sendThisSQL, function (err, result) {
      if (err) throw err;
      console.log("\n");
      console.table(result);
      console.log("\n");
    });


  }

}

let myFirstPromise = new Promise((resolve, reject) => {
  require("./modules/banners")(app);

  setTimeout(function () {
    resolve("Success!"); // Yay! Everything went well!
  }, 250);
});

myFirstPromise.then((successMessage) => {
  // successMessage is whatever we passed in the resolve(...) function above.
  start();

});