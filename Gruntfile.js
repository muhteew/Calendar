module.exports = function(grunt) {

    // configure the tasks
    grunt.initConfig({

        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            main: {
                files: {
                    'app/assets/css/app.min.css': ['src/css/app.css']
                }
            }
        },
        concat: {
            main: {
                src: [
                    'src/js/plugins.js',
                    'src/js/classList.js',
                    'src/js/eventFunctions.js',
                    'src/js/IEVariables.js',
                    'src/js/placeholderEmulator.js',
                    'src/js/monthTable.js',
                    'src/js/buttonAnimation.js',
                    'src/js/search.js',
                    'src/js/main.js'
                ],
                dest: 'app/assets/js/app.js'
            }
        },
        uglify: {
            main: {
                dest: 'app/assets/js/app.min.js',
                src: ['app/assets/js/app.js']
            }
        },
        watch: {
            css: {
                files: ['src/css/**'],
                tasks: ['cssmin']
            },
            js: {
                files: ['src/js/**'],
                tasks: ['concat', 'uglify']
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // define the tasks

    grunt.registerTask(
        'min',
        '',
        ['cssmin', 'uglify']
    );
    grunt.registerTask(
        'build',
        '',
        ['concat', 'min']
    );
    grunt.registerTask(
        'default',
        '',
        ['watch']
    );


};