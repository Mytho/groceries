'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            appJs: {
                src: [
                    'application/static/js/*/module.js',
                    'application/static/js/*/models/*.js',
                    'application/static/js/*/services/*.js',
                    'application/static/js/*/controllers/*.js'
                ],
                dest: 'build/app.js'
            },
            vendorJs: {
                src: [
                    'application/static/vendor/angular/1.2.18/angular.min.js',
                    'application/static/vendor/angular/1.2.18/angular-resource.min.js',
                    'application/static/vendor/angular/1.2.18/angular-route.min.js'
                ],
                dest: 'application/static/vendor.min.js'
            }
        },

        cssmin: {
            screenCss: {
                src: ["application/static/css/screen.css"],
                dest: "application/static/screen.min.css"
            }
        },

        jshint: {
            options: {
                globalstrict: true,
                globals: {
                    angular: true,
                    beforeEach: true,
                    describe: true,
                    expect: true,
                    inject: true,
                    it: true,
                    module: true
                }
            },
            before: ['Gruntfile.js', 'application/static/js/*/tests.js', 'build/app.js']
        },

        karma: {
            appJs: {
                options: {
                    frameworks: ['jasmine'],
                    files: [
                        'application/static/vendor/angular/1.2.18/angular.min.js',
                        'application/static/vendor/angular/1.2.18/angular-resource.min.js',
                        'application/static/vendor/angular/1.2.18/angular-route.min.js',
                        'application/static/vendor/angular/1.2.18/angular-mocks.js',
                        'application/static/js/*/module.js',
                        'application/static/js/*/models/*.js',
                        'application/static/js/*/services/*.js',
                        'application/static/js/*/controllers/*.js',
                        'application/static/js/*/tests.js'
                    ],
                    reporters: ['progress'],
                    port: 8002,
                    colors: true,
                    loglevel: 'INFO',
                    autoWatch: true,
                    singleRun: false,
                    plugins: ['karma-jasmine']
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
                    'application/static/app.min.js': ['<banner>', 'build/app.js']
                }
            }
        },

        watch: {
            appJs: {
                files: ['application/static/js/**/*.js'],
                tasks: ['concat:appJs', 'jshint', 'uglify:appJs']
            },
            screenCss: {
                files: ['application/static/js/**/*.css'],
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

    grunt.registerTask('default', ['karma', 'concat', 'jshint', 'uglify', 'cssmin']);
    grunt.registerTask('test', ['karma:appJs']);

};
