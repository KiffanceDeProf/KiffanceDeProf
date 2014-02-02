/** 
 * Routes definition & loading
 * @file app/routes.js
 */

"use strict";

var expressPath = require("express-path");

exports.setup = function setup(app) {
  var apiPath = app.get("api path");
  var routes = [
    [apiPath + "/", "general#apiInfo", "auth#init", "get"],
    [apiPath + "/user/me", "users#me", "auth#init", "auth#login", "get"],
    [apiPath + "/admin-only", "users#adminOnly", "auth#init", "auth#isAdmin", "get"],

    [apiPath + "/students", "students#list", "auth#init", "get"],
    [apiPath + "/students", "students#create", "auth#init", "auth#isAdmin", "post"],
    [apiPath + "/students/:studentId", "students#find", "auth#init", "get"],
    [apiPath + "/students/:studentId", "students#update", "auth#init", "auth#isAdmin", "put"],
    [apiPath + "/students/:studentId", "students#delete", "auth#init", "auth#isAdmin", "delete"],

    [apiPath + "/courses", "courses#list", "auth#init", "get"],
    [apiPath + "/courses", "courses#create", "auth#init", "auth#isAdmin", "post"],
    [apiPath + "/courses/:courseId", "courses#find", "auth#init", "get"],
    [apiPath + "/courses/:courseId", "courses#update", "auth#init", "auth#isAdmin", "put"],
    [apiPath + "/courses/:courseId", "courses#delete", "auth#init", "auth#isAdmin", "delete"],

    [apiPath + "/courses/:courseId/students", "courses#getStudents", "auth#init", "get"],
    [apiPath + "/courses/:courseId/students/:studentId", "courses#findStudent", "auth#init", "get"],
    [apiPath + "/courses/:courseId/students/:studentId", "courses#expelStudent", "auth#init", "auth#isAdmin", "delete"],
    [apiPath + "/courses/:courseId/students/:studentId", "courses#addStudent", "auth#init", "auth#isAdmin", "post"]
  ];

  expressPath(app, routes, { verbose: (app.settings.env === "development") });

  console.log("✔ Routes loaded");
};