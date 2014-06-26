# NOTE: For the (e2e-)tests to run properly a httpd and webdriver must be
#       running
all: clean check build-js test

clean:
	find . -type f -name \*.pyc -delete

build-js:
	grunt concat
	grunt uglify
	grunt cssmin

check: check-py check-js

check-py:
	flake8 application
	flake8 tests

check-js:
	grunt jshint

httpd:
	python run-httpd.py

setup: setup-req setup-db

setup-req:
	pip install -r requirements.txt
	npm install

setup-db:
	cat db/setup.sql | sqlite3 db/groceries.db

test: test-py test-js test-e2e

test-py:
	cat db/setup.sql | sqlite3 db/groceries.db
	python run-tests.py

test-js:
	grunt karma:continuous

test-e2e:
	cat db/setup.sql | sqlite3 db/groceries.db
	grunt protractor:e2e

user:
	python add-user.py

watch:
	grunt watch

webdriver:
	phantomjs --webdriver=8003
