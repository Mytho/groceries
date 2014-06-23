'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            appJs: {
                src: [
                    'application/static/js/groceries/groceries.js',
                    'application/static/js/groceries/models/*.js',
                    'application/static/js/groceries/services/*.js',
                    'application/static/js/groceries/controllers/*.js'
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
                    module: true
                }
            },
            before: ['Gruntfile.js', 'build/app.js']
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

    grunt.registerTask('default', ['concat', 'jshint', 'uglify', 'cssmin']);

};
