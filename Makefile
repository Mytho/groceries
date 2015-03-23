# NOTE: For the (e2e-)tests to run properly a httpd and webdriver must be
#       running
all: clean check build-static test

build-static:
	grunt concat
	grunt uglify
	grunt cssmin

db:
	cat db/setup.sql | sqlite3 db/groceries.db

check: check-py check-js

check-js:
	grunt jshint

check-py:
	flake8 bin
	flake8 application
	flake8 tests

clean:
	find . -name '__pycache__' -delete -o -name '*.pyc' -delete

httpd:
	python ./bin/run-httpd.py

install:
	pip install -r requirements.txt
	pip install -r requirements-dev.txt

test: test-py test-js test-e2e

test-e2e:
	cat db/setup.sql | sqlite3 db/groceries.db
	grunt protractor:e2e

test-js:
	grunt karma:continuous

test-py:
	cat db/setup.sql | sqlite3 db/groceries.db
	python ./bin/run-tests.py

user:
	python ./bin/add-user.py

uninstall:
	- pip uninstall --yes -r requirements.txt
	- pip uninstall --yes -r requirements-dev.txt

webdriver:
	phantomjs --webdriver=8003
