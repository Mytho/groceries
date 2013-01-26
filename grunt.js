module.exports = function(grunt) {
    // Configuration
    grunt.initConfig({
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
        meta: {
            banner: '/*!\n' +
                ' * <%= pkg.name %>\n' +
                ' * - - -\n' +
                ' * Author: <%= pkg.author.name %> (<%= pkg.author.email %>)\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                ' * <%= pkg.lisence.type %> lisenced, <%= pkg.lisence.url %>\n' +
                ' */'
        },
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
                    'coffee/views.coffee'
                ],
                dest: 'build/app.coffee'
            }
        },
        min: {
            app: {
                src: ['<banner>', 'build/app.js'],
                dest: 'application/static/js/app.min.js'
            }
        },
        watch: {
            app: {
                files: ['<config:coffee.app.src>'],
                tasks: 'concat:app coffee:app'
            }
        }
    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-coffee');

    // Default Task
    grunt.registerTask('default', 'concat coffee min');
};
