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

async function addEmployee() {
  const firstName = await inquirer.prompt([{
    type: 'input',
    name: 'value',
    message: 'Enter Employee First Name :',
    validate: (value) => {
      if (value.length <= 2) {
        return 'Value is to short (min: 3)';
      }

      if (value.length > 30) {
        return 'Value is to long (max: 30)';
      }

      return true;
    },
  }]);

  const lastName = await inquirer.prompt([{
    type: 'input',
    name: 'value',
    message: 'Enter Employee Last Name :',
    validate: (value) => {
      if (value.length <= 2) {
        return 'Value is to short (min: 3)';
      }

      if (value.length > 30) {
        return 'Value is to long (max: 45)';
      }

      return true;
    },
  }]);

  let role = {};
  let manager = {};

  const roles = await sqlQueries.viewRoles();

  if (roles.length === 0) {
    console.log('No roles');
  } else {
    role = await selectRole(roles);
  }

  if (role && role.department_id) {
    const employeesOfDepartment = await sqlQueries.viewEmployeesByDepartment(role.department_id);

    if (employeesOfDepartment.length === 0) {
      console.log('No managers');
    } else {
      // selectManager expects manager and id fields therefore we re-map employee to manager field
      manager = await selectManager(employeesOfDepartment.map((e) => ({ manager: e.employee, id: e.id })));
    }
  }

  console.log('Adding employee:\n%o', {
    firstName: firstName.value,
    lastName: lastName.value,
    role: role.title || 'N/A',
    manager: manager.manager || 'N/A',
  });

  await sqlQueries.addEmployee(firstName.value, lastName.value, role.id || null, manager.id || null);
}

async function addRole() {
  const departments = await sqlQueries.viewDepartments();

  if (departments.length === 0) {
    console.log('No departments, add department first');

    return;
  }

  const title = await inquirer.prompt([{
    type: 'input',
    name: 'value',
    message: 'Enter the Position/Role title:',
    validate: (value) => {
      if (value.length <= 2) {
        return 'Value is to short (min: 3)';
      }

      if (value.length > 30) {
        return 'Value is to long (max: 30)';
      }

      return true;
    },
  }]);

  const salary = await inquirer.prompt([{
    type: 'input',
    name: 'value',
    message: 'Enter salary:',
    validate: (value) => {
      if (!Number.isNaN(parseFloat(value))) {
        return true;
      }

      return 'Invalid value';
    },
    // filter: Number // <- leads to NaN issue on invalid input
    filter: (value) => (Number.isNaN(parseFloat(value)) ? value : parseFloat(value)),
  }]);

  const department = await selectDepartment(departments);

  console.log('Adding role:\n%o', {
    title: title.value,
    salary: salary.value,
    department: department.name || 'N/A',
  });

  await sqlQueries.addRole(title.value, salary.value, department.id);
}

async function addDepartment() {
  const name = await inquirer.prompt([{
    type: 'input',
    name: 'value',
    message: 'Enter the department name:',
    validate: (value) => {
      if (value.length <= 2) {
        return 'Value is to short (min: 3)';
      }

      if (value.length > 30) {
        return 'Value is to long (max: 30)';
      }

      return true;
    },
  }]);

  console.log('Adding department:\n%o', {
    name: name.value,
  });

  await sqlQueries.addDepartment(name.value);
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

          console.table(await sqlQueries.viewEmployeesByManager(manager.id));
        }
        break;
      case 'View Employees by Department':
        departments = await sqlQueries.viewDepartments();

        if (departments.length === 0) {
          console.log('No departments');
        } else {
          department = await selectDepartment(departments);

          // console.log('Employees of', department.name);
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

          // console.log('Budge of', department.name);
          console.table(await sqlQueries.viewDepartmentBudgets(department.id));
        }
        break;
      case 'Add Employee':
        await addEmployee();

        break;
      case 'Add Role':
        await addRole();

        break;
      case 'Add Department':
        await addDepartment();

        break;
      case 'Change Employee Role':
        employees = await sqlQueries.viewEmployees();
        roles = await sqlQueries.viewRoles();

        if (employees.length === 0) {
          console.log('No employees');
        }

        if (roles.length === 0) {
          console.log('No roles');
        }

        if (employees.length > 0 && roles.length > 0) {
          employee = await selectEmployee(employees);

          role = await selectRole(roles);

          console.log('Changing role of', employee.employee, 'from', employee.title, 'to', role.title);

          await sqlQueries.updateEmployeeRole(employee.id, role.id);
        }

        break;
      case 'Change Employee Manager':
        employees = await sqlQueries.viewEmployees();

        if (employees.length === 0) {
          console.log('No employees');
        } else {
          let employee = await selectEmployee(employees);

          // we assume that anyone can be a manager for the user

          // employee cannot be a manager to himself
          managers = employees.filter((e) => e.id !== employee.id);

          // selectManager expects manager and id fields therefore we re-map employee to manager field
          managers = managers.map((e) => ({ manager: e.employee, id: e.id }));

          // add an option to remove the manager
          managers.push({ manager: 'No manager', id: null });

          manager = await selectManager(managers);

          console.log('Changing manager of', employee.employee, 'from', employee.manager || 'No manager', 'to', manager.manager);

          await sqlQueries.updateEmployeeManager(employee.id, manager.id || null);
        }

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
