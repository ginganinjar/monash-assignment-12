const inquirer = require('inquirer');

const sqlQueries = require('./modules/queries');
const screenTime = require('./modules/banners');

function promptUser(type, name, message, choices) {
  return inquirer.prompt([{
    type,
    name,
    message,
    choices,
  }]);
}

async function selectEmployee(employees) {
  const selectedEmployee = await promptUser(
    'list',
    'id',
    'Select employee:',
    // convert to name/value pair
    employees.map((e) => ({ name: `${e.employee} - ${e.department_name || 'No department'}`, value: e.id }))
  );

  return employees.find((e) => e.id === selectedEmployee.id);
}

async function selectRole(roles) {
  const selectedRole = await promptUser(
    'list',
    'id',
    'Select role:',
    // convert to name/value pair
    roles.map((r) => ({ name: `${r.title} - ${r.department_name || 'No department'}`, value: r.id }))
  );

  return roles.find((m) => m.id === selectedRole.id);
}

async function selectManager(managers) {
  const selectedManager = await promptUser(
    'list',
    'id',
    'Select manager:',
    // convert to name/value pair
    managers.map((m) => ({ name: m.manager, value: m.id }))
  );

  return managers.find((m) => m.id === selectedManager.id);
}

async function selectDepartment(departments) {
  const selectedDepartment = await promptUser(
    'list',
    'id',
    'Select department:',
    // convert to name/value pair
    departments.map((d) => ({ name: d.name, value: d.id }))
  );

  return departments.find((d) => d.id === selectedDepartment.id);
}

async function start() {
  let theAnswer = {};

  let employees;
  let managers;
  let roles;
  let departments;

  let employee;
  let manager;
  let role;
  let department;

  console.log(await screenTime.showHeader('./assets/intro.txt'));

  while (theAnswer.menuSelection !== 'Exit') {
    theAnswer = await promptUser(
      'list',
      'menuSelection',
      'Enter Selection:',
      [
        'View Employees',
        'View Employees by Manager',
        'View Employees by Department',
        'View Roles',
        'View Departments',
        'View Department Budgets',
        new inquirer.Separator(),
        'Add Employee',
        'Add Role',
        'Add Department',
        new inquirer.Separator(),
        'Change Employee Role',
        'Change Employee Manager',
        new inquirer.Separator(),
        'Delete Employee',
        'Delete Role',
        'Delete Department',
        new inquirer.Separator(),
        'Exit',
        new inquirer.Separator(),
      ]
    );

    switch (theAnswer.menuSelection) {
      case 'View Employees':
        console.table(await sqlQueries.viewEmployees());
        break;
      case 'View Employees by Manager':
        managers = await sqlQueries.getManagers();

        if (managers.length === 0) {
          console.log('No managers');
        } else {
          manager = await selectManager(managers);

          console.log('Empolyees managed by', manager.manager);
          console.table(await sqlQueries.viewEmployeesByManager(manager.id));
        }
        break;
      case 'View Employees by Department':
        departments = await sqlQueries.viewDepartments();

        if (departments.length === 0) {
          console.log('No departments');
        } else {
          department = await selectDepartment(departments);

          console.log('Employees of', department.name);
          console.table(await sqlQueries.viewEmployeesByDepartment(department.id));
        }
        break;
      case 'View Roles':
        console.table(await sqlQueries.viewRoles());
        break;
      case 'View Departments':
        console.table(await sqlQueries.viewDepartments());
        break;
      case 'View Department Budgets':
        departments = await sqlQueries.viewDepartments();

        if (departments.length === 0) {
          console.log('No departments');
        } else {
          department = await selectDepartment(departments);

          console.log('Budge of', department.name);
          console.table(await sqlQueries.viewDepartmentBudgets(department.id));
        }
        break;
      case 'Add Employee':
        break;
      case 'Add Role':
        break;
      case 'Add Department':
        break;
      case 'Change Employee Role':
        break;
      case 'Change Employee Manager':
        break;
      case 'Delete Employee':
        employees = await sqlQueries.viewEmployees();

        if (employees.length === 0) {
          console.log('No more employees');
        } else {
          employee = await selectEmployee(employees);

          await sqlQueries.deleteEmployee(employee.id);

          console.log(employee.employee, 'deleted');
        }

        break;
      case 'Delete Role':
        roles = await sqlQueries.viewRoles();

        if (roles.length === 0) {
          console.log('No more roles');
        } else {
          role = await selectRole(roles);

          await sqlQueries.deleteRole(role.id);

          console.log(role.title, 'deleted');
        }

        break;
      case 'Delete Department':
        departments = await sqlQueries.viewDepartments();

        if (departments.length === 0) {
          console.log('No more departments');
        } else {
          department = await selectDepartment(departments);

          await sqlQueries.deleteDepartment(department.id);

          console.log(department.name, 'deleted');
        }

        break;
      case 'Exit':
        console.log(await screenTime.showHeader('./assets/bye.txt'));
        process.exit(22);

        break;
      default:
        // do nothing
    }

    console.log('\n');
  }
}

start();
