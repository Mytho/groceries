all: clean check setup-db test-py

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

test-py:
	python run-tests.py

test-js:
	grunt test

test: test-py test-js
