CREATE SCHEMA `CMS` ;

CREATE TABLE `CMS`.`employee` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(30) NULL,
  `last_name` VARCHAR(45) NULL,
  `role_id` INT NULL,
  `manager_id` INT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `CMS`.`role` (
  `id` INT NOT NULL,
  `title` VARCHAR(30) NULL,
  `salary` DECIMAL(10) NULL,
  `department_id` INT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `CMS`.`department` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NULL,
  PRIMARY KEY (`id`));
