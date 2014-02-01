/** 
 * Routes definition & loading
 * @file lib/routes.js
 */

"use strict";

function loadRoutes(routes, app) {
  var r = {};
  for(var i in routes) {
    try {
      r[routes[i]] = require("./routes/" + routes[i])(app);
    }
    catch(e) {
      console.error("✖ Can't load", routes[i], "routes", e);
    }
  }

  return r;
}

exports.setup = function setup(app) {
  var handlers = app.get("handlers"),
      routes = loadRoutes(["general"], app);
  app.get("/api", handlers.auth(0), routes.general.apiInfo);
  app.get("/api/test/:id", handlers.auth(0), routes.general.paramTest);
  app.get("/api/admin", handlers.auth(2), routes.general.paramTest);

  console.log("✔ Routes loaded");
};