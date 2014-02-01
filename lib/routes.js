"use strict";

exports.setup = function setup(app) {
  var handlers = app.get("handlers");
  app.get("/api", handlers.auth(1),
      function(req, res, next) {
    res.responseBody = {
      wow: "such api"
    };
    res.apiStatus = 200;
    next();
  }, handlers.apiResponse);
};