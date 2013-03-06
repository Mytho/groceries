module.exports = function(grunt) {

    // Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        coffee: {
            compile: {
                files: {
                    'build/app.js': 'build/app.coffee'
                }
            }
        },
        concat: {
            app: {
                src: [
                    'coffee/core.coffee',
                    'coffee/router.coffee',
                    'coffee/models.coffee',
                    'coffee/collections.coffee',
                    'coffee/views.coffee'
                ],
                dest: 'build/app.coffee'
            }
        },
        cssmin: {
            less: {
                src: ["build/screen.css"],
                dest: "application/static/css/screen.min.css"
            }
        },
        jshint: {
            files: [
                'Gruntfile.js',
                'build/app.js'
            ],
            options: {
                'bitwise'   : true,
                'browser'   : true,
                'camelcase' : true,
                'curly'     : true,
                'eqeqeq'    : true,
                'forin'     : true,
                'immed'     : true,
                'indent'    : 4,
                'latedef'   : true,
                'maxerr'    : 50,
                'newcap'    : true,
                'noarg'     : true,
                'noempty'   : true,
                'nonew'     : true,
                'onevar'    : true,
                'plusplus'  : false,
                'quotmark'  : 'single',
                'regexp'    : true,
                'strict'    : false,
                'trailing'  : true,
                'undef'     : true,
                'unused'    : true,
                'white'     : false
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
            app: {
                files: {
                    'application/statis/js/app.min.js': ['<banner>', 'build/app.js']
                }
            }
        },
        watch: {
            app: {
                files: ['<config:coffee.app.src>'],
                tasks: 'concat:app coffee:app uglify:app'
            }
        }
    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default Task
    grunt.registerTask('default', ['concat', 'coffee', 'jshint', 'uglify'']);

};
