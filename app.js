"use strict";

var express = require("express"),
    app = express(),
    routes = require("./routes");


app.configure(function() {
  app.use(express.logger());
  app.use(express.compress());
  app.use(express.cookieParser("wow. such encryption key.")); // On va avoir besoin de Cookies !
  app.use(app.router);
  app.use(express.static(__dirname + "/public")); // Pour le contenu static
});


routes.setup(app);
app.listen(1337 || process.env.PORT);