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
    [apiPath + "/admin-only", "users#adminOnly", "auth#init", "auth#isAdmin", "get"]
  ];

  expressPath(app, routes, { verbose: (app.settings.env === "development") });

  console.log("✔ Routes loaded");
};