all: setup-db check build test

build:
	find . -type f -name \*.pyc -delete
	grunt concat
	grunt uglify
	grunt cssmin

check:
	flake8 application
	flake8 tests
	grunt jshint

httpd:
	python run-httpd.py

setup: setup-req setup-db

setup-req:
	pip install -r requirements.txt
	npm install

setup-db:
	cat db/setup.sql | sqlite3 db/groceries.db

test:
	python run-tests.py
	grunt karma:continuous
