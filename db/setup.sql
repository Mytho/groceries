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

INSERT INTO users (username, password)
VALUES
	('teun',  'sha1$lgkA6dTN$756ee8285201102a53d72875f6a628db1f9dfde6'),
	('britt', 'sha1$D3djKAfD$0bafbfc63ceb98602bf0b993235ddac81171db0f');

INSERT INTO items (name, create_date, created_by)
VALUES
   ('Yoghurt',   1300000000, 1),
   ('Bread',     1300000000, 1),
   ('Eggs',      1300000000, 1),
   ('Milk',      1300000000, 1),
   ('Steak',     1300000000, 1),
   ('Chocolate', 1300000000, 1),
   ('Soda',      1300000000, 1),
   ('Beer',      1300000000, 1),
   ('Wine',      1300000000, 1),
   ('Pizza',     1300000000, 1);
