# CREATE DATABASE_MODIFICATION
# ----------------------------

CREATE TABLE IF NOT EXISTS `database_modifications` (
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

CREATE TABLE IF NOT EXISTS `users` (
	`id`       INT(11)     UNSIGNED NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(64) NOT NULL UNIQUE,
	`password` VARCHAR(64) NOT NULL,
  `active`   BIT(1)      DEFAULT 1,

	PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8;

# CREATE ITEM
# -----------

CREATE TABLE IF NOT EXISTS `items` (
	`id`          INT(11)      UNSIGNED NOT NULL AUTO_INCREMENT,
	`name`        VARCHAR(255) NOT NULL,
	`create_date` INT(10)      NOT NULL,
	`created_by`  INT(11)      UNSIGNED NOT NULL,
	`bought_date` INT(10)      DEFAULT NULL,
	`bought_by`   INT(11)      UNSIGNED DEFAULT NULL,

	PRIMARY KEY (`id`),
	KEY `fk_created_by` (`created_by`),
	KEY `fk_bought_by` (`bought_by`),

	CONSTRAINT `ibfk_items_1`
	FOREIGN KEY (`created_by`)
	REFERENCES `users` (`id`)
	ON DELETE CASCADE,

	CONSTRAINT `ibfk_items_2`
	FOREIGN KEY (`bought_by`)
	REFERENCES `users` (`id`)
	ON DELETE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8;

# INSERT USER
# -----------

INSERT INTO `users` (
		`username`,
		`password`
	)
VALUES
	('teun', 'sha1$lgkA6dTN$756ee8285201102a53d72875f6a628db1f9dfde6'),
	('britt', 'sha1$D3djKAfD$0bafbfc63ceb98602bf0b993235ddac81171db0f');

# INSERT ITEM
# -----------

INSERT INTO `items` (
    `name`,
    `create_date`,
    `created_by`
  )
VALUES
  ('Yoghurt', 1300000000, 1),
  ('Bread', 1300000000, 1),
  ('Eggs', 1300000000, 1),
  ('Milk', 1300000000, 1),
  ('Steak', 1300000000, 1),
  ('Chocolate', 1300000000, 1),
  ('Cola', 1300000000, 1),
  ('Beer', 1300000000, 1),
  ('Wine', 1300000000, 1),
  ('Water', 1300000000, 1);
