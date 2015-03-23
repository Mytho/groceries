.PHONY: build

all: help

build:
	grunt concat
	grunt uglify
	grunt cssmin

check:
	grunt jshint
	flake8 application
	flake8 tests

clean:
	find build -type f -delete
	find . -name '__pycache__' -delete -o -name '*.pyc' -delete

help:
	@echo 'build     -- build the static files'
	@echo 'check     -- check the code syntax'
	@echo 'clean     -- cleanup the environment'
	@echo 'db        -- setup a clean database'
	@echo 'help      -- display this information'
	@echo 'httpd     -- run a development server'
	@echo 'install   -- install all dependencies'
	@echo 'test      -- test the entire codebase'
	@echo 'uninstall -- uninstall all dependencies'

httpd:
	python ./bin/run-httpd.py

install:
	pip install -r requirements.txt
	pip install -r requirements-dev.txt

test: clean check test-py test-js test-e2e

test-e2e:
	cat db/setup.sql | sqlite3 db/groceries.db
	python ./bin/run-httpd.py &>/dev/null &
	./node_modules/.bin/phantomjs --webdriver=8003 &>/dev/null &
	grunt protractor:e2e
	pkill phantomjs
	pkill -f python\ ./bin/run-httpd.py

test-js:
	cat db/setup.sql | sqlite3 db/groceries.db
	PHANTOMJS_BIN=./node_modules/.bin/phantomjs grunt karma:continuous

test-py:
	cat db/setup.sql | sqlite3 db/groceries.db
	python ./bin/run-tests.py

uninstall:
	- pip uninstall --yes -r requirements.txt
	- pip uninstall --yes -r requirements-dev.txt
