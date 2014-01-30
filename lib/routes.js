"use strict";

exports.setup = function setup(app) {
  app.get("/api", function(req, res) {
    res.send({
      wow: "such api"
    });
  });
};