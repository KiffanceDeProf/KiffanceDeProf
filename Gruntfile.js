"use strict";

module.exports = function(grunt) {
  // charge tous les plugins grunt
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    project: { // Variables du projet
      clientSrc: "client/",
      clientDist: "public/"
    },
    uglify: { // Minimification JS
      dist: {
        files: [{
          expand: true,
          cwd: "client/js",
          src: "**/*.js",
          dest: "public/js"
        }]
      }
    },
    jshint: { // Vérification JS
      options: {
        jshintrc: ".jshintrc",
        reporter: require("jshint-stylish")
      },
      all: [
        "Gruntfile.js",
        "app.js",
        "lib/*.js",
        "<%= project.clientSrc %>/js/{*,*/}.js"
      ],
      client: "<%= project.clientSrc %>/js/{*,*/}.js"
    },
    clean: { // Clean
      dist: ["<%= project.clientDist %>/*"]
    },
    htmlmin: { // Minimification HTML
      options: {
        removeCommentsFromCDATA: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: "<%= project.clientSrc %>",
          src: "*.html",
          dest: "<%= project.clientDist %>"
        }]
      }
    },
    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: "<%= project.clientSrc %>/css",
          src: "*.css",
          dest: "<%= project.clientDist %>/css"
        }]
      }
    },
    copy: { // Copie pendant le developpement
      dev: { // Copie brute sans compilation
        files: [{
          expand: true,
          cwd: "<%= project.clientSrc %>",
          src: "*",
          dest: "<%= project.clientDist %>"
        }]
      },
      styles: { // Copie du CSS sans compilation
        files: [{
          expand: true,
          cwd: "<%= project.clientSrc %>/css",
          src: "**/*.css",
          dest: "<%= project.clientDist %>/css"
        }]
      },
      dist: { // A définir, pour les ressources n'ayant besoin d'aucunes compilation
        files: [{
          expand: true,
          cwd: "<%= project.clientSrc %>",
          src: "**/*.js",
          dest: "<%= project.clientDist %>"
        }]
      },
      scripts: { // Copie les scripts sans minimification
        files: [{
          expand: true,
          cwd: "<%= project.clientSrc %>/js",
          src: "**/*.js",
          dest: "<%= project.clientDist %>/js"
        }]
      }
    },
    concurrent: { // Pour lancer plusieurs tasks à la fois
      dev: [
        "copy:styles",
        "htmlmin:dist",
        "copy:scripts"
      ],
      dist: [
        "cssmin:dist",
        "htmlmin:dist",
        "uglify:dist"
      ],
      server: [ // Start server & watch files change
        "watch",
        "server:dev"
      ]
    },
    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: "<%= project.clientSrc %>/js/{*,*/}.js",
        tasks: ["jshint:client", "copy:scripts"]
      },
      styles: {
        files: "<%= project.clientSrc %>/css/{*,*/}.css",
        tasks: ["copy:styles"]
      },
      html: {
        files: "<%= project.clientSrc %>/*.html",
        tasks: ["htmlmin:dist"]
      },
      other: {
        files: ["<%= project.clientSrc %>/images/*"]
      }
    }
  });
  
  // Build all the stuff!
  grunt.registerTask("build", [
    "clean:dist",
    "jshint:all",
    "concurrent:dist",
    "copy:dist"
  ]);

  grunt.registerTask("server", function() {
    require("./app");
  });

  grunt.registerTask("dev", [
    "clean:dist",
    "jshint:all",
    "concurrent:dev",
    "server",
    "watch"
  ]);
};