all: clean check test

check:
	flake8 application
	flake8 tests

clean:
	find . -type f -name \*.pyc -delete

httpd:
	python run-httpd.py

setup:
	pip install -r requirements.txt

test:
	python run-tests.py
