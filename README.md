# Groceries

Manage your grocery list. Although the code is developed for mobile use, it works perfectly on your desktop and laptop as well.

## Installation

Only a few easy steps are needed to install the application:

1. Clone the repository by executing `git@github.com:Mytho/groceries.git`.
2. Copy the Flask configuration file and modify it to meet your needs: `cp application/example.config.py application/config.py`.
3. Create the initial database by executing `make setup-db`.
4. Add user accounts by running the `make user` command.

## Development

If you want to develop the application, it is advised to create a [virtualenv](http://docs.python-guide.org/en/latest/dev/virtualenvs/) for Python. As a virtual environment for node, you could use [nodeenv](http://ekalinin.github.io/nodeenv/). Once both environments are activated, install all dependencies by running `make setup-req`.

## Automated tests

The application is fully tested, server side as well as client site. A few remarks when you want to run the tests:

1. PhantomJS must be installed to run the JavaScript tests.
2. To run the End-to-End tests, a webserver (`make httpd`) and a webdriver (`make webdriver`) must be running.

To run all the tests execute `make test`.
