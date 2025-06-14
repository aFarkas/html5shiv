module.exports = function (grunt) {
  const srcFiles = 'src/**/*.js';
  const distDir = 'dist/';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: grunt.file.readJSON('bower.json'),

    copy: {
      demo: {
        files: [
          { expand: true, cwd: 'src/', src: ['*'], dest: distDir, flatten: true }
        ]
      }
    },

    uglify: {
      options: {
        beautify: { ascii_only: true },
        preserveComments: 'some'
      },
      html5shiv: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.js'],
          dest: distDir,
          ext: '.min.js'
        }]
      }
    },

    watch: {
      js: {
        files: [srcFiles],
        tasks: ['copy', 'uglify', 'bytesize']
      }
    },

    bytesize: {
      all: {
        src: [`${distDir}*.min.js`]
      }
    }
  });

  [
    'grunt-contrib-copy',
    'grunt-contrib-uglify',
    'grunt-contrib-watch',
    'grunt-bytesize'
  ].forEach(task => grunt.loadNpmTasks(task));

  grunt.registerTask('default', ['copy', 'uglify', 'bytesize']);
  grunt.registerTask('dev', ['default', 'watch']);
};
