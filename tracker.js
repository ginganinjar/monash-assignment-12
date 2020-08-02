const express = require("express");
const path = require("path");
const inquirer = require("inquirer");
const db = require("./modules/sqlCom"); // load db connection
const sqlQueries = require("./modules/queries"); // template for queries
const screenTime = require("./modules/banners");

const app = express();
app.use(express.static(path.join(__dirname, ".")));

// variables
let employeeList = [];
let departmentList = [];
let departmentListObj;

function getIDbyRole(namedKey, objArray) {
  for (var i = 0; i < objArray.length; i++) {
    if (objArray[i].title === namedKey) {
      return objArray[i];
    }
  }
}

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
  }loadObjects();
}

async function loadObjects() {
  db.query(sqlQueries.utilGetRoleIdsTitles(), function (err, results) {
    roleList = [];
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      roleList.push(results[i].title);
    }
    roleListObj = results;
  });
  // present greeting to user.

  db.query(sqlQueries.utilGetEmployeeIdsNames(), function (err, results) {
    theEmployeeList = [];
    if (err) throw err;
    theEmployeeList.push("Empty");
    for (let i = 0; i < results.length; i++) {
      employeeList.push(results[i].first_name + " " + results[i].last_name);
    }
    employeeListObj = results;
  });

  db.query(sqlQueries.utilGetDepartmentIdsNames(), function (err, results) {
    departmentList = [];
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      departmentList.push(results[i].name);
    }
    departmentListObj = results;
  });
}

function promptUser(input, title, theMessage, choices) {
  return inquirer.prompt([
    {
      type: input,
      name: title,
      message: theMessage,
      choices: choices,
    },
  ]);
}

async function start() {
  theAnswer = "";
  
  while (theAnswer.menuSelection !== "Exit") {
    loadObjects();
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
        "Change Employee Role",
        "Change Employee Manager",
        new inquirer.Separator(),
        "Delete Employee",
        "Delete Department",
        "Delete Role",
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
        let firstName = await promptUser(
          "prompt",
          "employeeFirstName",
          "Enter Employee First Name :",
          []
        );

        let lastName = await promptUser(
          "prompt",
          "employeeLastName",
          "Enter Employees Last Name :",
          []
        );

        let selectedRole = await promptUser(
          "list",
          "jobRole",
          "Enter Job Title",
          roleList
        );

        // get the correct role ID based on description
        let roleID = getIDbyRole(selectedRole.jobRole, roleListObj).id;

        let selectedManager = await promptUser(
          "list",
          "employeeManager",
          "Enter Employees Manager :",
          employeeList
        );

        // Get the correct ID for the appropriate manager
        let newManagerID = findEmployeeId(
          selectedManager.employeeManager,
          employeeListObj
        )
          ? findEmployeeId(selectedManager.employeeManager, employeeListObj)
          : null;

        sendThisSQL = await sqlQueries.addEmployee(
          firstName.employeeFirstName,
          lastName.employeeLastName,
          roleID,
          newManagerID
        );
        await loadObjects();
        break;

      case "Add Department":
        let newDepartment = await promptUser(
          "prompt",
          "departmentName",
          "Enter the department name :",
          []
        );

        sendThisSQL = await sqlQueries.addDepartment(
          newDepartment.departmentName
        );
        await loadObjects();
        break;

      case "Add Role":
        let newTitle = await promptUser(
          "prompt",
          "roleTitle",
          "Enter the Position/Role title :",
          []
        );

        let pay = await promptUser(
          "prompt",
          "pay",
          "Enter the position pay :",
          []
        );

        let department = await promptUser(
          "list",
          "departmentList",
          "Enter the department:",
          departmentList
        );

        let newRoleId = getDepartmentId(
          department.departmentList,
          departmentListObj
        ).id;
        sendThisSQL = await sqlQueries.addRole(
          newTitle.roleTitle,
          pay.pay,
          newRoleId,
          newRoleId
        );
        await loadObjects();
        break;

      // updated / change the employee's assigned position

      case "Change Employee Role":
         theEmployee = await promptUser(
          "list",
          "employeeToUpdate",
          "Select Employee to update :",
          employeeList
        );

        let newRole = await promptUser(
          "list",
          "newPosition",
          `Select ${theEmployee.employeeToUpdate}'s new position :`,
          roleList
        );

        const updateThis = findEmployeeId(
          theEmployee.employeeToUpdate,
          employeeListObj
        )
          ? findEmployeeId(theEmployee.employeeToUpdate, employeeListObj)
          : null;
        const toThisRole = getIDbyRole(newRole.newPosition, roleListObj).id;

        sendThisSQL = sqlQueries.updateEmployeeRole(updateThis, toThisRole);

        break;

      // update / change the employee's manager position

      case "Change Employee Manager":
        theEmployee = await promptUser(
          "list",
          "employeeToUpdate",
          "Select Employee to update :",
          employeeList
        );

        let theNewManager = await promptUser(
          "list",
          "selectedManager",
          "Select Employees new manager :",
          employeeList
        );

        const updateThisEmployee = findEmployeeId(
          theEmployee.employeeToUpdate,
          employeeListObj
        )
          ? findEmployeeId(theEmployee.employeeToUpdate, employeeListObj)
          : null;
        if (theNewManager.selectedManager == updateThisEmployee) {
          changeToThisManager = null;
        } else {
          changeToThisManager = findEmployeeId(
            theNewManager.selectedManager,
            employeeListObj
          );
        }

        sendThisSQL = sqlQueries.updateEmployeeManager(
          changeToThisManager,
          updateThisEmployee
        );

        break;
      // Delete and remove employee from system

      case "Delete Employee":
        let deleteThis = await promptUser(
          "list",
          "selectedID",
          "Select employee to delete :",
          employeeList
        );

        let deleteThisEmployee = findEmployeeId(
          deleteThis.selectedID,
          employeeListObj
        )
          ? findEmployeeId(deleteThis.selectedID, employeeListObj)
          : null;
        // assign the correct value to the sql query.
        sendThisSQL = sqlQueries.deleteEmployee(deleteThisEmployee);
        // clean up the array
        employeeListObj = employeeListObj.filter(function (el) {
          return el.id != deleteThisEmployee;
        });

        break;
      // Delete and remove depaertment
      case "Delete Department":
        let deleteThisDept = await promptUser(
          "list",
          "departmentToDelete",
          "Select department to delete :",
          departmentListObj
        );

        let removeDepartmentId = getDepartmentId(
          deleteThisDept.departmentToDelete,
          departmentListObj
        ).id;
        sendThisSQL = sqlQueries.deleteDepartment(removeDepartmentId);
        // clean up the array
        departmentListObj = departmentListObj.filter(function (el) {
          return el.id != deleteThisDept;
        });

        break;
      // Delete and remove role from system

      case "Delete Role":
        deleteThisRole = await promptUser(
          "list",
          "roleToDelete",
          "Select role/position to delete :",
          roleList
        );

        let roleToDeleteByID = getIDbyRole(
          deleteThisRole.roleToDelete,
          roleListObj
        ).id;
        sendThisSQL = sqlQueries.deleteRole(roleToDeleteByID);
        // clean up the array
        roleListObj = roleListObj.filter(function (el) {
          return el.id != deleteThisRole;
        });

        break;
      default:
    }

    // if the user wants to terminate - do so here
    if (theAnswer.menuSelection == "Exit") {
      screenTime.showHeader("./assets/bye.txt");

      setTimeout(function () {
        process.exit(22);
      }, 250);
    }

    db.query(sendThisSQL, function (err, result) {
      if (err) throw err;
      console.log("\n");

      if (result.affectedRows) {
        console.log("Success...");
      } else {
        console.table(result);
      }

      // console.clear();
    });

    toContinue = await promptUser(
      "prompt",
      "tocontinue",
      "\033[31m Press Enter to comtinue",
      []
    );

    console.clear();
  }
}

let myFirstPromise = new Promise((resolve, reject) => {
  screenTime.showHeader("./assets/intro.txt");
  setTimeout(function () {
    resolve("Success!"); // Yay! Everything went well!
  }, 250);
});

myFirstPromise.then((successMessage) => {
  // successMessage is whatever we passed in the resolve(...) function above.
  loadObjects();
  start();
});
