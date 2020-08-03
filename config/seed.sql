
USE CMS;
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Finance');
INSERT INTO department (name) VALUES ('Legal');

USE CMS;
SELECT * FROM department;

USE CMS;
INSERT INTO role (title, salary, department_id) VALUES ('Sales Lead', '100000', '1');
INSERT INTO role (title, salary, department_id) VALUES ('Salesperson', '80000', '1');
INSERT INTO role (title, salary, department_id) VALUES ('Lead Engineer', '150000', '2');
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', '120000', '2');
INSERT INTO role (title, salary, department_id) VALUES ('Accountant', '125000', '3');
INSERT INTO role (title, salary, department_id) VALUES ('Legal Team Lead', '250000', '4');
INSERT INTO role (title, salary, department_id) VALUES ('Lawyer', '190000', '4');

USE CMS;
SELECT * FROM role;
USE CMS;
SELECT title
    FROM role
    ORDER BY department_id ASC, title ASC;

USE CMS;
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Ashley', 'Rodriguez', 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Mike', 'Chan', 2, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Kevin', 'Tupik', 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Malia', 'Brown', 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Sarah', 'Lourd', 6, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Tom', 'Allen', 7, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Christian', 'Eckenrode', 3, 3);

USE CMS;
SELECT * FROM employee;

-- ------------------------
-- VIEW DATA
-- ------------------------

-- viewAllEmployees
USE CMS;
SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS 'Employee', d.name AS 'Department', r.title, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
    FROM employee e
        LEFT JOIN employee m ON m.id = e.manager_id
        LEFT JOIN Role r ON e.role_id = r.id
        LEFT JOIN Department d ON d.id = r.department_id
    ORDER BY e.id ASC;

-- viewAllEmployeesByDepartment
USE CMS;
SELECT d.name, CONCAT(e.first_name, ' ', e.last_name) AS 'Employee', r.title, d.name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
    FROM employee e
        LEFT JOIN employee m ON m.id = e.manager_id
        JOIN Role r ON e.role_id = r.id
        JOIN Department d ON d.id = r.department_id
    ORDER BY d.name ASC;

-- viewAllEmployeesByManager
USE CMS;
SELECT IFNULL(CONCAT(m.first_name, ' ', m.last_name), '') AS 'Manager', CONCAT(e.first_name, ' ', e.last_name) AS 'Employee', d.name, r.title, d.name, r.salary
    FROM employee e
        LEFT JOIN employee m ON m.id = e.manager_id
        JOIN Role r ON e.role_id = r.id
        JOIN Department d ON d.id = r.department_id
    ORDER BY m.first_name ASC;

-- viewDepartments
USE CMS;
SELECT name AS 'Department Name'
        FROM department
        ORDER BY name ASC;

-- viewDepartmentBudgets
USE CMS;
SELECT department_id, SUM(salary)
    FROM role
    GROUP BY department_id;

USE CMS;
SELECT department_id, salary
    FROM role;

USE CMS;
SELECT e.id AS 'Employee ID', d.name AS 'Department', d.id AS 'Department ID', r.title AS 'Title', r.salary AS 'Salary'
    FROM employee e
        JOIN Role r ON e.role_id = r.id
        JOIN Department d ON d.id = r.department_id
    ORDER BY d.id ASC;

USE CMS;
select role_id from employee;

USE CMS;
SELECT d.name AS 'Department', CONCAT(e.first_name, ' ', e.last_name) AS 'Employee', r.title, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
    FROM employee e
        LEFT JOIN employee m ON m.id = e.manager_id
        JOIN Role r ON e.role_id = r.id
        JOIN Department d ON d.id = r.department_id
    ORDER BY d.name ASC;

USE CMS;
SELECT role_id, COUNT(role_id)
    FROM employee
    GROUP BY role_id
    HAVING COUNT(role_id) > 0;


SELECT 
    email, 
    COUNT(email)
FROM
    contacts
GROUP BY email
HAVING COUNT(email) > 1;

-- ------------------------
-- UPDATE QUERIES
-- ------------------------

USE CMS;
UPDATE employee e
    SET
        e.role_id = ?
    WHERE
        e.id = ?;

USE CMS; SELECT * FROM employee WHERE id = 12;

USE CMS;
UPDATE employee e
    SET
        e.manager_id = ?
    WHERE
        e.id = ?;

USE CMS; SELECT * FROM employee WHERE id = 12;


-- ------------------------
-- UTILITY QUERIES
-- ------------------------

-- queries for addEmployee()
USE CMS;
SELECT e.id, e.first_name, e.last_name
    FROM employee e
    ORDER BY e.first_name ASC;

USE CMS;
SELECT r.id, r.title
    FROM role r
    ORDER BY r.title ASC;

-- queries for addDepartment()
USE CMS;
SELECT d.id, d.name
        FROM department d
        ORDER BY d.name ASC;

-- removeEmployee
USE CMS;
-- DELETE FROM employee where id = ?;


-- updateEmployeeRole

-- updateEmployeeManager

-- viewAllRoles

-- addRole

-- removeRole


-- ------------------------
-- REMOVE QUERIES
-- ------------------------

-- queries for addEmployee()
USE CMS;

-- USE CMS;
-- DELETE FROM role where id = 3;
-- DELETE FROM role where id = 9;

use CMS; select * from role;
use CMS; select * from employee;
use CMS; select * from department;
-- use CMS; DELETE FROM role where id = 9;
-- use CMS; DELETE FROM department where id = 6;
use CMS; select * from role;
use CMS; select * from employee;
use CMS; select * from department;




USE CMS;
SELECT r.id, r.title
            FROM role r
            ORDER BY r.title ASC;