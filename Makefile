all: clean check

check:
	flake8 application

clean:
	find . -type f -name \*.pyc -delete

httpd:
	python run-httpd.py

setup:
	pip install -r requirements.txt
