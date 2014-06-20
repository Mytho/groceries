module.exports = function(grunt) {

    // Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            appJs: {
                src: ['application/static/js/core.js'],
                dest: 'build/app.js'
            },
            vendorJs: {
                src: [
                    'application/static/vendor/angular/1.2.18/angular.min.js',
                    'application/static/vendor/angular/1.2.18/angular-resource.min.js',
                    'application/static/vendor/angular/1.2.18/angular-route.min.js'
                ],
                dest: 'application/static/vendor.min.js'
            },
            less: {
                src: ['less/core.less'],
                dest: 'build/screen.less'
            }
        },
        cssmin: {
            less: {
                src: ["build/screen.css"],
                dest: "application/static/css/screen.min.css"
            }
        },
        less: {
            less: {
                files: {
                    "build/screen.css": "build/screen.less"
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
                tasks: ['concat:appJs', 'uglify:appJs']
            },
            less: {
                files: ['less/*.less'],
                tasks: ['concat:less', 'less:less', 'cssmin:less']
            }
        }
    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default Task
    grunt.registerTask('default', ['concat', 'uglify', 'less', 'cssmin']);

};
