'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ''
            },
            appJs: {
                src: [
                    'static/js/*/core.js',
                    'static/js/*/directives/*.js',
                    'static/js/*/models/*.js',
                    'static/js/*/services/*.js',
                    'static/js/*/controllers/*.js'
                ],
                dest: 'build/app.js'
            },
            vendorJs: {
                src: [
                    'static/vendor/angular/1.2.18/angular.min.js',
                    'static/vendor/angular/1.2.18/angular-resource.min.js',
                    'static/vendor/angular/1.2.18/angular-touch.min.js'
                ],
                dest: 'static/vendor.min.js'
            }
        },

        cssmin: {
            screenCss: {
                src: ['static/css/**/*.css'],
                dest: 'static/screen.min.css'
            }
        },

        jshint: {
            options: {
                globalstrict: true,
                globals: {
                    angular: true,
                    beforeEach: true,
                    browser: true,
                    by: true,
                    describe: true,
                    element: true,
                    expect: true,
                    inject: true,
                    it: true,
                    module: true,
                    protractor: true
                }
            },
            before: ['Gruntfile.js', 'static/js/*/tests/*.js', 'build/app.js']
        },

        karma: {
            options: {
                autoWatch: false,
                browsers: ['PhantomJS'],
                colors: true,
                files: [
                    'static/vendor/angular/1.2.18/angular.min.js',
                    'static/vendor/angular/1.2.18/angular-resource.min.js',
                    'static/vendor/angular/1.2.18/angular-touch.min.js',
                    'static/vendor/angular/1.2.18/angular-mocks.js',
                    'static/js/*/core.js',
                    'static/js/*/directives/*.js',
                    'static/js/*/models/*.js',
                    'static/js/*/services/*.js',
                    'static/js/*/controllers/*.js',
                    'static/js/*/tests/unit.js'
                ],
                frameworks: ['jasmine'],
                logLevel: 'ERROR',
                plugins: ['karma-jasmine', 'karma-phantomjs-launcher'],
                port: 8002,
                reporters: ['progress'],
                singleRun: true
            },
            continuous: { },
            unit: {
                autoWatch: true,
                singleRun: false
            }
        },

        protractor: {
            e2e: {
                options: {
                    args: {
                        seleniumAddress: 'http://0.0.0.0:8003/wd/hub',
                        capabilities: {
                            browserName: 'phantomjs'
                        },
                        baseUrl: 'http://127.0.0.1:8001',
                        specs: ['static/js/*/tests/e2e.js'],
                        jasmineNodeOpts: {
                            showColors: true,
                            defaultTimeoutInterval: 30000
                        }
                    }
                }
            }
        },

        uglify: {
            options: {
                banner: '/*!\n' +
                    ' * <%= pkg.name %> v<%= pkg.version %>\n' +
                    ' * - - -\n' +
                    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                    ' * Released under <%= pkg.lisence.type %> lisenced\n' +
                    ' * <%= pkg.lisence.url %>\n' +
                    ' */\n'
            },
            appJs: {
                files: {
                    'static/app.min.js': ['<banner>', 'build/app.js']
                }
            }
        },

        watch: {
            js: {
                files: ['Gruntfile.js', 'static/js/**/*.js'],
                tasks: ['concat:appJs', 'jshint', 'uglify:appJs']
            },
            css: {
                files: ['static/css/**/*.css'],
                tasks: ['cssmin:screenCss']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-protractor-runner');

};
