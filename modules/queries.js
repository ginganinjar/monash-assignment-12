const db = require('./sqlCom'); // load db connection

// --------------------------------------------------------------------

function queryAsync(query, params) {
  return new Promise((resolve, reject) => {
    db.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function insertAsync(query, params) {
  return new Promise((resolve, reject) => {
    db.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.insertId);
      }
    });
  });
}

// all views
const viewEmployees = async () => {
  const query = `
    SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee,
      d.name AS department_name,
      r.title, r.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN employee m ON m.id = e.manager_id
    LEFT JOIN role r ON r.id = e.role_id
    LEFT JOIN department d ON d.id = r.department_id
    ORDER BY e.first_name, e.last_name, r.title;
  `;

  return queryAsync(query);
};

const viewEmployeesByManager = async (managerId) => {
  const query = `
    SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee,
      d.name AS department_name,
      r.title, r.salary
    FROM employee e
    LEFT JOIN role r ON r.id = e.role_id
    LEFT JOIN department d ON d.id = r.department_id
    WHERE e.manager_id = ?
    ORDER BY e.first_name, e.last_name;
  `;

  return queryAsync(query, managerId);
};

const viewEmployeesByDepartment = async (departmentId) => {
  const query = `
    SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee,
      r.title, r.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r ON r.id = e.role_id AND r.department_id = ?
    LEFT JOIN employee m ON m.id = e.manager_id
    ORDER BY e.first_name, e.last_name
  `;

  return queryAsync(query, departmentId);
};

const viewDepartments = async () => {
  const query = `
    SELECT id, name
    FROM department
    ORDER BY name
  `;

  return queryAsync(query);
};

const viewRoles = async () => {
  const query = `
    SELECT r.id, r.title, r.salary, d.name AS department_name
    FROM role r
    LEFT JOIN department d ON d.id = r.department_id
    ORDER BY d.name, r.title
  `;

  return queryAsync(query);
};

const viewDepartmentBudgets = async (departmentId) => {
  const query = `
    SELECT sum(a.salary) AS total
    FROM department d
    LEFT JOIN (
      SELECT r.salary,  r.department_id
      FROM employee e
      JOIN role r ON r.id = e.role_id
    ) a ON a.department_id = d.id
    WHERE d.id = ?`;

  return queryAsync(query, departmentId);
};

// --------------------------------------------------------------------
// all inserts

const addEmployee = async (firstName, lastName, roleId, managerId) => {
  const query = `
    INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)
  `;

  return insertAsync(query, [firstName, lastName, roleId, managerId]);
};

const addDepartment = async (name) => {
  const query = `
    INSERT INTO department (name)
    VALUES (?)
  `;

  return insertAsync(query, name);
};

const addRole = async (title, salary, departmentId) => {
  const query = `
    INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?);
  `;

  return insertAsync(query, [title, salary, departmentId]);
};

// --------------------------------------------------------------------
// all updates

const updateEmployeeRole = async (employeeId, roleId) => {
  const query = `
    UPDATE employee SET role_id = ? WHERE id = ?
  `;

  return queryAsync(query, [roleId, employeeId]);
};

const updateEmployeeManager = async (employeeId, managerId) => {
  const query = `
    UPDATE employee SET manager_id = ? WHERE id = ?
  `;

  return queryAsync(query, [managerId, employeeId]);
};

// --------------------------------------------------------------------
// all deletes

const deleteEmployee = async (employeeId) => queryAsync('DELETE FROM employee WHERE id = ?', employeeId);

const deleteDepartment = async (departmentId) => queryAsync('DELETE FROM department WHERE id = ?', departmentId);

const deleteRole = async (roleId) => queryAsync('DELETE FROM role WHERE id = ?', roleId);

// --------------------------------------------------------------------
// all selects

const getManagers = async () => {
  const query = `
    SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS manager,
      d.name AS department_name
    FROM employee e
    LEFT JOIN role r ON r.id = e.role_id
    LEFT JOIN department d ON d.id = r.department_id
    WHERE e.id IN (SELECT manager_id FROM employee)
  `;

  return queryAsync(query);
};

module.exports = {
  //  all view queries
  viewEmployees,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  viewRoles,
  viewDepartments,
  viewDepartmentBudgets,

  // all inserts
  addEmployee,
  addRole,
  addDepartment,

  // all updates
  updateEmployeeRole,
  updateEmployeeManager,

  // all deletes
  deleteEmployee,
  deleteRole,
  deleteDepartment,

  // all selects
  getManagers,
};
