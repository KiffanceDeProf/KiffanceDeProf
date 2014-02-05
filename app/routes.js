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

    [apiPath + "/auth/local/login", "users#generateBearer", "auth#init", "auth#localLogin", "post"],
    [apiPath + "/auth/local/register", "users#generateBearer", "auth#init", "auth#localRegister", "post"],

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
    [apiPath + "/courses/:courseId/students/:studentId", "courses#addStudent", "auth#init", "auth#isAdmin", "post"],

    [apiPath + "/attributes", "attributes#list", "auth#init", "get"],
    [apiPath + "/attributes", "attributes#create", "auth#init", "auth#isAdmin", "post"],
    [apiPath + "/attributes/:attributeId", "attributes#find", "auth#init", "get"],
    [apiPath + "/attributes/:attributeId", "attributes#update", "auth#init", "auth#isAdmin", "put"],
    [apiPath + "/attributes/:attributeId", "attributes#delete", "auth#init", "auth#isAdmin", "delete"]
  ];

  expressPath(app, routes, { verbose: (app.settings.env === "development") });

  console.log("✔ Routes loaded");
};