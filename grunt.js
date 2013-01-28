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
                ' * <%= pkg.name %>\n' +
                ' * - - -\n' +
                ' * Author: <%= pkg.author.name %> (<%= pkg.author.email %>)\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                ' * <%= pkg.lisence.type %> lisenced, <%= pkg.lisence.url %>\n' +
                ' */'
        },
        min: {
            app: {
                src: ['<banner>', 'build/app.js'],
                dest: 'application/static/js/app.min.js'
            }
        },
        pkg: {
            'name': 'GROCERIES',
            'author': {
                'name': 'T. Zengerink',
                'email': 't.zengerink@gmail.com'
            },
            'lisence': {
                'type': 'MIT',
                'url': 'https://raw.github.com/Mytho/groceries/master/LISENCE.md'
            }
        },
        watch: {
            app: {
                files: ['coffee/*.coffee'],
                tasks: 'concat:app coffee:app'
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
