
// --------------------------------------------------------------------
// all views
const viewEmployees = () => {
    return `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS 'Employee', d.name AS 'Department', r.title AS 'Title', r.salary AS 'Salary', CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
            FROM employee e
                LEFT JOIN employee m ON m.id = e.manager_id
                LEFT JOIN Role r ON e.role_id = r.id
                LEFT JOIN Department d ON d.id = r.department_id
            ORDER BY e.id ASC;`;
};

const viewEmployeesByManager = () => {
    return `SELECT IFNULL(CONCAT(m.first_name, ' ', m.last_name), '-self-') AS 'Manager', CONCAT(e.first_name, ' ', e.last_name) AS 'Employee', d.name, r.title, d.name, r.salary
            FROM employee e
                LEFT JOIN employee m ON m.id = e.manager_id
                JOIN Role r ON e.role_id = r.id
                JOIN Department d ON d.id = r.department_id
            ORDER BY m.first_name ASC;`;
};

const viewEmployeesByDepartment = () => {
    return `SELECT d.name AS 'Department', CONCAT(e.first_name, ' ', e.last_name) AS 'Employee', r.title, d.name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
            FROM employee e
                LEFT JOIN employee m ON m.id = e.manager_id
                JOIN Role r ON e.role_id = r.id
                JOIN Department d ON d.id = r.department_id
            ORDER BY d.name;`;
};

const viewDepartments = () => {
    return `SELECT name AS 'Department Name'
            FROM department
            ORDER BY name ASC;`;
};

const viewRoles = () => {
    return `SELECT title AS Role
            FROM role
            ORDER BY title ASC;`;
};

const viewDepartmentBudgets = () => {
    return `not implemented`;
};


// --------------------------------------------------------------------
// all inserts

const addEmployee = (first, last, roleid, managerid) => {
    return `INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('${first}', '${last}', ${roleid}, ${managerid});`;
};

const addDepartment = (name) => {
    return `INSERT INTO department (name) \
            VALUES ('${name}');`;
};

const addRole = (title, salary, departmentid) => {
    return `INSERT INTO role (title, salary, department_id)
            VALUES ('${title}', '${salary}', '${departmentid}');`;
};

// --------------------------------------------------------------------
// all updates

const updateEmployeeRole = (employeeid, roleid) => {
    return `UPDATE employee e
            SET
                e.role_id = ${roleid}
            WHERE
                e.id = ${employeeid};`;
};

const updateEmployeeManager = (managerid, employeeid) => {
    return `UPDATE employee e
            SET
                e.manager_id = ${managerid}
            WHERE
                e.id = ${employeeid};`;
};

// --------------------------------------------------------------------
// all deletes

const deleteEmployee = (employeeid) => {
    return `DELETE FROM employee where id = ${employeeid};`;
};

const deleteDepartment = (deleteDepartmentId) => {
    return `DELETE FROM department where id = ${deleteDepartmentId};`;
};

const deleteRole = (deleteRoleID) => {
    return `DELETE FROM role where id = ${deleteRoleID};`;
};


// --------------------------------------------------------------------
// all selects

const utilGetEmployeeIdsNames = () => {
    return `SELECT e.id, e.first_name, e.last_name
            FROM employee e
            ORDER BY e.first_name ASC;`;
};

const utilGetRoleIdsTitles = () => {
    return `SELECT r.id, r.title
            FROM role r
            ORDER BY r.title ASC;`;
};

const utilGetDepartmentIdsNames = () => {
    return `SELECT d.id, d.name
            FROM department d
            ORDER BY d.name ASC;
    `;
};
//  all view queries
exports.viewEmployees = viewEmployees;
exports.viewEmployeesByManager = viewEmployeesByManager;
exports.viewEmployeesByDepartment = viewEmployeesByDepartment;
exports.viewDepartments = viewDepartments;
exports.viewRoles = viewRoles;
exports.viewDepartmentBudgets = viewDepartmentBudgets;


// all inserts
exports.addEmployee = addEmployee;
exports.addDepartment = addDepartment;
exports.addRole = addRole;

// all updates
exports.updateEmployeeRole = updateEmployeeRole;
exports.updateEmployeeManager = updateEmployeeManager;

// all deletes
exports.deleteEmployee = deleteEmployee;
exports.deleteDepartment = deleteDepartment;
exports.deleteRole = deleteRole;

// all 
exports.utilGetEmployeeIdsNames = utilGetEmployeeIdsNames;
exports.utilGetRoleIdsTitles = utilGetRoleIdsTitles;
exports.utilGetDepartmentIdsNames = utilGetDepartmentIdsNames;