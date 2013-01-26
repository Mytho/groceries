# CREATE DB
# ---------

CREATE DATABASE IF NOT EXISTS `groceries`;

# CREATE DATABASE_MODIFICATION
# ----------------------------

CREATE TABLE IF NOT EXISTS `groceries`.`database_modifications` (
	`id`          VARCHAR(255) NOT NULL,
	`applied_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`script_name` VARCHAR(255) NOT NULL,
	`comments`    VARCHAR(255) DEFAULT '',

	PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8;

# CREATE USER
# -----------

CREATE TABLE IF NOT EXISTS `groceries`.`users` (
	`id`       INT(11)     UNSIGNED NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(64) NOT NULL UNIQUE,
	`password` VARCHAR(64) NOT NULL,

	PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8;

# CREATE ITEM
# -----------

CREATE TABLE IF NOT EXISTS `groceries`.`items` (
	`id`          INT(11)      UNSIGNED NOT NULL AUTO_INCREMENT,
	`name`        VARCHAR(255) NOT NULL,
	`create_date` INT(10)      NOT NULL,
	`created_by`  INT(11)      UNSIGNED NOT NULL,
	`bought_date` INT(10)      NOT NULL,
	`bought_by`   INT(11)      UNSIGNED NOT NULL,

	PRIMARY KEY (`id`),
	KEY `fk_created_by` (`created_by`),
	KEY `fk_bought_by` (`bought_by`),

	CONSTRAINT `ibfk_items_1`
	FOREIGN KEY (`created_by`)
	REFERENCES `groceries`.`users` (`id`)
	ON DELETE CASCADE,

	CONSTRAINT `ibfk_items_2`
	FOREIGN KEY (`bought_by`)
	REFERENCES `groceries`.`users` (`id`)
	ON DELETE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8;

# INSERT USER
# -----------

INSERT INTO `groceries`.`users` (
		`username`,
		`password`
	)
VALUES
	('admin', 'admin');
