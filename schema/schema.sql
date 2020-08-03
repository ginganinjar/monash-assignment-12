DROP DATABASE IF EXISTS `CMS`;
CREATE DATABASE `CMS`;

CREATE USER `cms`@localhost IDENTIFIED WITH mysql_native_password BY 'cms';
GRANT ALL ON CMS.* TO `cms`@localhost;
FLUSH PRIVILEGES;


CREATE TABLE `CMS`.`department` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `CMS`.`role` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30) NOT NULL,
    `salary` DECIMAL(10) NOT NULL,
    `department_id` INT,

    CONSTRAINT `fk_department`
        FOREIGN KEY (`department_id`)
        REFERENCES `department` (`id`)
        ON DELETE SET NULL,

    PRIMARY KEY (`id`)
);

CREATE TABLE `CMS`.`employee` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(45) NOT NULL,
    `role_id` INT,
    `manager_id` INT,

    CONSTRAINT `fk_role`
        FOREIGN KEY (`role_id`)
        REFERENCES `role` (`id`)
        ON DELETE SET NULL,

    CONSTRAINT `fk_manager`
        FOREIGN KEY (`manager_id`)
        REFERENCES `employee` (`id`)
        ON DELETE SET NULL,

    PRIMARY KEY (`id`)
);
