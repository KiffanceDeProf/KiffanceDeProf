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
    [apiPath + "/students/:id", "students#find", "auth#init", "get"],
    [apiPath + "/students/:id", "students#update", "auth#init", "auth#isAdmin", "put"],
    [apiPath + "/students/:id", "students#delete", "auth#init", "auth#isAdmin", "delete"]
  ];

  expressPath(app, routes, { verbose: (app.settings.env === "development") });

  console.log("✔ Routes loaded");
};