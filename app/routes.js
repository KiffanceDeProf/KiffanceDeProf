/** 
 * Routes definition & loading
 * @file app/routes.js
 */

"use strict";

var expressPath = require("express-path");

exports.setup = function setup(app) {
  var apiPath = app.get("api path"),
      passport = app.get("passport");
  var routes = [
    [apiPath + "/", "general#apiInfo", "auth#bearerAuth", "get"],
    [apiPath + "/user/me", "users#me", "auth#bearerAuth", "get"],
    [apiPath + "/admin-only", "users#adminOnly", "auth#bearerAuth", "auth#isAdmin", "get"],

    [apiPath + "/auth/local/login", "users#generateBearer", "auth#bearerAuth", "auth#localLogin", "post"],
    [apiPath + "/auth/local/register", "users#generateBearer", "auth#bearerAuth", "auth#localRegister", "post"],

    [apiPath + "/students", "students#list", "auth#bearerAuth", "get"],
    [apiPath + "/students", "students#create", "auth#bearerAuth", "auth#isAdmin", "post"],
    [apiPath + "/students/:studentId", "students#find", "auth#bearerAuth", "get"],
    [apiPath + "/students/:studentId", "students#update", "auth#bearerAuth", "auth#isAdmin", "put"],
    [apiPath + "/students/:studentId", "students#delete", "auth#bearerAuth", "auth#isAdmin", "delete"],

    [apiPath + "/courses", "courses#list", "auth#bearerAuth", "get"],
    [apiPath + "/courses", "courses#create", "auth#bearerAuth", "auth#isAdmin", "post"],
    [apiPath + "/courses/:courseId", "courses#find", "auth#bearerAuth", "get"],
    [apiPath + "/courses/:courseId", "courses#update", "auth#bearerAuth", "auth#isAdmin", "put"],
    [apiPath + "/courses/:courseId", "courses#delete", "auth#bearerAuth", "auth#isAdmin", "delete"],

    [apiPath + "/courses/:courseId/students", "courses#getStudents", "auth#bearerAuth", "get"],
    [apiPath + "/courses/:courseId/students/:studentId", "courses#findStudent", "auth#bearerAuth", "get"],
    [apiPath + "/courses/:courseId/students/:studentId", "courses#expelStudent", "auth#bearerAuth", "auth#isAdmin", "delete"],
    [apiPath + "/courses/:courseId/students/:studentId", "courses#addStudent", "auth#bearerAuth", "auth#isAdmin", "post"],

    [apiPath + "/attributes", "attributes#list", "auth#bearerAuth", "get"],
    [apiPath + "/attributes", "attributes#create", "auth#bearerAuth", "auth#isAdmin", "post"],
    [apiPath + "/attributes/:attributeId", "attributes#find", "auth#bearerAuth", "get"],
    [apiPath + "/attributes/:attributeId", "attributes#update", "auth#bearerAuth", "auth#isAdmin", "put"],
    [apiPath + "/attributes/:attributeId", "attributes#delete", "auth#bearerAuth", "auth#isAdmin", "delete"]
  ];

  expressPath(app, routes, { verbose: (app.settings.env === "development") });

  // Passport routes
  app.post(apiPath + "/auth/local/register", passport.authenticate("local-register", {
    successRedirect: "/auth/local/register/success",
    failureRedirect: "/auth/local/register/failure"
  }));

  app.post(apiPath + "/auth/local/login", passport.authenticate("local-login", {
    successRedirect: "/auth/local/login/success",
    failureRedirect: "/auth/local/login/failure"
  }));

  console.log("✔ Routes loaded");
};