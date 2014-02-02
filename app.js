/**
 * Main app
 * @file app.js
 */

"use strict";

var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    schemas = require("./app/schemas")(mongoose),
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
  app.set("schemas", schemas);
  app.set("mongoose", mongoose);
  app.set("api path", "/api");

  app.use(express.logger("tiny"));
  app.use(express.compress());
  app.use(express.cookieParser("wow. such encryption key.")); // On va avoir besoin de Cookies !
  app.use(express.bodyParser());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(app.router);
  app.use(express.static(__dirname + "/public")); // Pour le contenu static
});


routes.setup(app);
app.listen(1337 || process.env.PORT, function() {
  console.log("✔ Server running on port", 1337 || process.env.PORT);
});