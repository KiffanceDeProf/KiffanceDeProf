/**
 * Main app
 * @file app.js
 */

"use strict";

var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    compress = require("compression")(),
    session = require("express-session"),
    serveStatic = require("serve-static"),
    morgan = require("morgan"),
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

app.set("models", models);
app.set("mongoose", mongoose);
app.set("api path", "/api");
app.set("passport", passport);

app.use(morgan("short"));
app.use(compress);
app.use(cookieParser("yolo"));
app.use(session());
app.use(passport.initialize());
app.use(bodyParser());

require("./app/passport").setup(passport, mongoose);
routes.setup(app);

app.use(serveStatic(__dirname + "/public")); // Pour le contenu static

app.listen(1337 || process.env.PORT, function() {
  console.log("✔ Server running on port", 1337 || process.env.PORT);
});