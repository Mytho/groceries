module.exports = function(grunt) {
    'use strict';

    // Configuration
    grunt.initConfig({
        pkg: {
            'name': 'APP',
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
                src: ['coffee/*.coffee'],
                dest: 'build/app.coffee'
            }
        },
        lint: {
            app: [
                'grunt.js',
                'build/app.js'
            ]
        },
        min: {
            app: {
                src: ['<banner>', 'build/app.js'],
                dest: 'application/static/js/app.min.js'
            }
        },
        jshint: {
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
                'strict'    : true,
                'trailing'  : true,
                'undef'     : true,
                'unused'    : true,
                'white'     : false,
                'predef'    : [
                    'APP',
                    'deepEqual',
                    'equal',
                    'expect',
                    'module',
                    'ok',
                    'test'
                ]
            }
        },
        watch: {
            app: {
                files: ['<config:coffee.app.coffee>'],
                tasks: 'concat:app coffee:app'
            }
        }
    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-coffee');

    // Default Task
    grunt.registerTask('default', 'concat coffee lint min');
};
