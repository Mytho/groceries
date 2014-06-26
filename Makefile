all: clean setup-db check build-js test

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

test: test-py test-js

test-py: setup-db
	python run-tests.py

test-js:
	grunt karma:continuous

test-e2e: setup-db
	protractor e2e/conf.js

user:
	python add-user.py

webdriver:
	phantomjs --webdriver=4444
