DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS items;

CREATE TABLE IF NOT EXISTS users (
	id       INTEGER     PRIMARY KEY AUTOINCREMENT,
	username VARCHAR(64) NOT NULL UNIQUE,
	password VARCHAR(64) NOT NULL,
	active   BIT(1)      DEFAULT 1
);

CREATE TABLE IF NOT EXISTS items (
	id          INTEGER      PRIMARY KEY AUTOINCREMENT,
	name        VARCHAR(255) NOT NULL,
	create_date INT(10)      NOT NULL,
	created_by  INT(11)      DEFAULT NULL,
	bought_date INT(10)      DEFAULT NULL,
	bought_by   INT(11)      DEFAULT NULL
);

INSERT INTO items (name, create_date, created_by)
VALUES
   ('Yoghurt',   1300000000, NULL),
   ('Bread',     1300000000, NULL),
   ('Eggs',      1300000000, NULL),
   ('Milk',      1300000000, NULL),
   ('Steak',     1300000000, NULL),
   ('Chocolate', 1300000000, NULL),
   ('Soda',      1300000000, NULL),
   ('Beer',      1300000000, NULL),
   ('Wine',      1300000000, NULL),
   ('Pizza',     1300000000, NULL);
