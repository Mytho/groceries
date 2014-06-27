# NOTE: For the (e2e-)tests to run properly a httpd and webdriver must be
#       running
all: clean check build-js test

build-js:
	grunt concat
	grunt uglify
	grunt cssmin

check: check-py check-js

check-js:
	grunt jshint

clean:
	find . -type f -name \*.pyc -delete

check-py:
	flake8 add-user.py
	flake8 run-httpd.py
	flake8 run-tests.py
	flake8 application
	flake8 tests

httpd:
	python run-httpd.py

setup: setup-req setup-db

setup-db:
	cat db/setup.sql | sqlite3 db/groceries.db

setup-req:
	pip install -r requirements.txt
	npm install

test: test-py test-js test-e2e

test-e2e:
	cat db/setup.sql | sqlite3 db/groceries.db
	grunt protractor:e2e

test-js:
	grunt karma:continuous

test-py:
	cat db/setup.sql | sqlite3 db/groceries.db
	python run-tests.py

user:
	python add-user.py

webdriver:
	phantomjs --webdriver=8003
