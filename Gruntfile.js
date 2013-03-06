module.exports = function(grunt) {

    // Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        coffee: {
            coffee: {
                files: {
                    'build/app.js': 'build/app.coffee'
                }
            }
        },
        concat: {
            coffee: {
                src: [
                    'coffee/core.coffee',
                    'coffee/router.coffee',
                    'coffee/models.coffee',
                    'coffee/collections.coffee',
                    'coffee/views.coffee'
                ],
                dest: 'build/app.coffee'
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
            coffee: {
                files: {
                    'application/static/js/app.min.js': ['<banner>', 'build/app.js']
                }
            }
        },
        watch: {
            coffee: {
                files: ['coffee/*.coffee'],
                tasks: ['concat:coffee', 'coffee:coffee', 'uglify:coffee']
            },
            less: {
                files: ['less/*.less'],
                tasks: ['concat:less', 'less:less', 'cssmin:less']
            }
        }
    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default Task
    grunt.registerTask('default', ['concat', 'coffee', 'uglify', 'less', 'cssmin']);

};
