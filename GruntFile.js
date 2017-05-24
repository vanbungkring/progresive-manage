module.exports = function(grunt) {
    grunt.initConfig({
        cssmin: {
            target: {
                files: {
                    'public/backend/css/app.min.css': [
                        'public/backend/css/app.css',
                        'public/backend/css/font.css',
                        'public/backend/css/animate.css/animate.css',
                        'public/backend/css/font-awesome/css/font-awesome.css',
                        'public/backend/css/custom/index.css',
                    ],
                    'public/front/css/app.front.min.css':[
                        'public/front/css/color.css',
                        'public/front/css/font-awesome.css',
                        'public/front/css/responsive.css',
                        'public/front/css/slick-theme.css',
                        'public/front/css/slick.css',
                        'public/front/css/style.css',
                    ]
                }
            },
            options: {
                livereload: true,
                keepSpecialComments: 0
            },
        },
        concat: {
            js: {
                src: [
                  'public/backend/js/base/common.function.js',
                  'public/backend/js/base/ui-load.js',
                    'public/backend/js/base/ui-jp.config.js',
                    'public/backend/js/base/ui-common.js',
                    'public/backend/js/base/ui-jp.js',
                    'public/backend/js/base/ui-nav.js',
                    'public/backend/js/base/ui-toggle.js',
                    'public/backend/js/base/ui-client.js',
                    'public/backend/js/base/ui-base.js',
                    'public/backend/js/base/ui-ajax.js',
                    'public/backend/js/base/dashboard.js',
                    'public/backend/js/custom/index.js',
                ],
                dest: 'public/backend/js/app.src.js'
            },
        },
        uglify: {
            bundle: {
                'public/js/app.src.min.js': ['public/js/app.src.js'],
            }
        },
        watch: {
            js: {
                files: [
                  'public/backend/js/base/**/*.js',
                  'public/backend/js/custom/**/*.js',
                ],
                tasks: ['concat:js'],
            },
            stylesheets: {
                files: ['public/front/css/*.css'],
                tasks: ['cssmin:target']
            }
        },
        imagemin:{
          dynamic: {
            files: [{
              expand: true,                  // Enable dynamic expansion
              cwd: 'public',             // Src matches are relative to this path
              src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
              dest: 'public'                  // Destination path prefix
            }]
          }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.registerTask('default',
    [
      'imagemin',
      'cssmin',
      'concat:js',
      'watch',
      'uglify',
    ]);
};
