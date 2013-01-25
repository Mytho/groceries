# CREATE DB
# ---------

CREATE DATABASE IF NOT EXISTS `groceries`;

# CREATE DATABASE_MODIFICATIONS
# -----------------------------

CREATE TABLE IF NOT EXISTS `groceries`.`database_modifications` (
	`id`          VARCHAR(255) NOT NULL,
	`applied_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`script_name` VARCHAR(255) NOT NULL,
	`comments`    VARCHAR(255) DEFAULT '',

	PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8;

# CREATE USERS
# ------------

CREATE TABLE IF NOT EXISTS `groceries`.`users` (
	`id`       INT(11)     UNSIGNED NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(64) NOT NULL,
	`password` VARCHAR(64) NOT NULL,

	PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8;

# CREATE ITEMS
# ------------

CREATE TABLE IF NOT EXISTS `groceries`.`items` (
	`id`         INT(11)      UNSIGNED NOT NULL AUTO_INCREMENT,
	`name`       VARCHAR(255) NOT NULL,
	`created`    INT(10)      NOT NULL,
	`created_by` INT(11)      UNSIGNED NOT NULL,
	`bought`     INT(10)      NOT NULL,
	`bought_by`  INT(11)      UNSIGNED NOT NULL,

	PRIMARY KEY (`id`),
	KEY `fk_created_by` (`created_by`),
	KEY `fk_bought_by` (`bought_by`),

	CONSTRAINT `ibfk_item_1`
	FOREIGN KEY (`created_by`)
	REFERENCES `groceries`.`users` (`id`)
	ON DELETE CASCADE,

	CONSTRAINT `ibfk_item_2`
	FOREIGN KEY (`bought_by`)
	REFERENCES `groceries`.`users` (`id`)
	ON DELETE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8;
