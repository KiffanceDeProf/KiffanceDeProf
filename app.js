/**
 * Main app
 * @file app.js
 */

"use strict";

var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    models = require("./app/models")(mongoose),
    routes = require("./app/routes");

mongoose.connect("mongodb://localhost/test");

var db = mongoose.connection;

db.on("error", function() {
  console.error("✖ Failed to connect to MongoDB");
});

db.on("open", function() {
  console.log("✔ Connected to MongoDB");
});

app.configure(function() {
  app.set("models", models);
  app.set("mongoose", mongoose);
  app.set("api path", "/api");
  app.set("passport", passport);

  app.use(express.logger("short"));
  app.use(express.compress());
  app.use(express.cookieParser("yolo"));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(express.bodyParser());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(app.router);
  app.use(express.static(__dirname + "/public")); // Pour le contenu static
});

require("./app/passport").setup(passport, mongoose);
routes.setup(app);

app.listen(1337 || process.env.PORT, function() {
  console.log("✔ Server running on port", 1337 || process.env.PORT);
});