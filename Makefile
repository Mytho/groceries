all: clean check setup-db test

check:
	flake8 application
	flake8 tests

clean:
	find . -type f -name \*.pyc -delete

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
	grunt test
