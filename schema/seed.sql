use `CMS`;

-- TRUNCATE TABLE employee;
-- TRUNCATE TABLE role;
-- TRUNCATE TABLE department;

DELETE FROM employee WHERE 1 = 1;
DELETE FROM role WHERE 1 = 1;
DELETE FROM department WHERE 1 = 1;

INSERT INTO department (id, name)
VALUES
    (1, 'Dep A'),
    (2, 'Dep B'),
    (3, 'Dep C'),
    (4, 'Dep D');

INSERT INTO role (id, title, salary, department_id)
VALUES
    (1, 'Manager', 5, 1),
    (2, 'Role B', 10, 1),
    (3, 'Role C', 15, 1),
    (11, 'Manager', 20, 2),
    (12, 'Role E', 25, 2),
    (13, 'Role F', 30, 2),
    (21, 'Manager', 35, 3),
    (22, 'Role H', 40, 3),
    (23, 'Role I', 45, 3),
    (31, 'Manager', 50, 4),
    (32, 'Role K', 55, 4),
    (33, 'Role L', 60, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'Lura', 'Johnson', 1, NULL),
    (2, 'Coby', 'Lowe', 2, 1),
    (3, 'London', 'Medhurst', 3, 1),

    (11, 'Maude', 'Runolfsson', 11, NULL),
    (12, 'Angelo', 'Haley', 12, 11),
    (13, 'Birdie', 'Welch', 13, 11),

    (21, 'Ford', 'Connelly', 21, NULL),
    (22, 'Price', 'Ritchie', 22, 21),
    (23, 'Alisa', 'Schowalter', 23, 21),

    (31, 'Matilde', 'Torp', 31, NULL),
    (32, 'Evert', 'Reynolds', 32, 31),
    (33, 'Jan', 'Botsford', 32, 31);
