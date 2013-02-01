module.exports = function(grunt) {
    // Configuration
    grunt.initConfig({
        coffee: {
            app: {
                src: ['build/app.coffee'],
                dest: 'build/'
            }
        },
        concat: {
            app: {
                src: [
                    'coffee/core.coffee',
                    'coffee/models.coffee',
                    'coffee/collections.coffee',
                    'coffee/views.coffee'
                ],
                dest: 'build/app.coffee'
            },
            less: {
                src: [
                    "less/core.less"
                ],
                dest: "build/screen.less"
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
        meta: {
            banner: '/*!\n' +
                ' * <%= pkg.name %> v<%= pkg.version %>\n' +
                ' * - - -\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                ' * Released under <%= pkg.lisence.type %> lisenced\n' +
                ' * <%= pkg.lisence.url %>\n' +
                ' */'
        },
        min: {
            app: {
                src: ['<banner>', 'build/app.js'],
                dest: 'application/static/js/app.min.js'
            }
        },
        pkg: '<json:package.json>',
        watch: {
            app: {
                files: ['coffee/*.coffee'],
                tasks: 'concat:app coffee:app min:app'
            },
            less: {
                files: ['less/*.less'],
                tasks: 'concat:less less:less cssmin:less'
            }
        }
    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-coffee');
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-css");

    // Default Task
    grunt.registerTask('default', 'concat coffee less min cssmin');
};
