/**
 * Main app
 * @file app.js
 */

"use strict";

var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    schemas = require("./lib/schemas")(mongoose),
    routes = require("./lib/routes"),
    handlers = require("./lib/handlers");

mongoose.connect("mongodb://localhost/test");

var db = mongoose.connection;

db.on("error", function() {
  console.error("✖ Failed to connect to MongoDB");
});

db.on("open", function() {
  console.log("✔ Connected to MongoDB");
  // require("./lib/fillDatabase")(mongoose); // Uncomment on first run --> TODO
});

app.configure(function() {
  app.set("handlers", handlers);
  app.set("schemas", schemas);
  app.set("mongoose", mongoose);

  app.use(express.logger("tiny"));
  app.use(express.compress());
  app.use(express.cookieParser("wow. such encryption key.")); // On va avoir besoin de Cookies !
  app.use(app.router);
  app.use(express.static(__dirname + "/public")); // Pour le contenu static
});


routes.setup(app);
app.listen(1337 || process.env.PORT, function() {
  console.log("✔ Server running on port", 1337 || process.env.PORT);
});