/**
 * Request Handlers
 * @file app/middlewares/auth.js
 */

"use strict";

var passport = require("passport");

module.exports = {
  init: function(req, res, next) { // Init auth infos
    // @TODO: Authentificate the user using
    var authHeader = req.headers.authorization || " ";
    if(authHeader.split(" ")[0] !== "Basic") {
      req.userAuth = {
        user: "anonymous",
        logged: false,
        admin: false
      };
      next();
      return;
    }
    
    var authInfo = (new Buffer(authHeader.split(" ")[1], "base64")).toString().split(":");
    
    if(authInfo[0] === "user" && authInfo[1] === "password") {
      req.userAuth = {
        user: authInfo[0],
        logged: true,
        admin: false
      };
    }
    else if(authInfo[0] === "root" && authInfo[1] === "alpine") {
      req.userAuth = {
        user: authInfo[0],
        logged: true,
        admin: true
      };
    }
    else {
      req.userAuth = {
        user: "anonymous",
        logged: false,
        admin: false
      };
    }

    next();
  },
  login: function(req, res, next) {
    if(req.user || (req.userAuth && req.userAuth.logged === true)) {
      next();
    }
    else {
      res.json(401, { error: "unaturhorized" });
    }
  },
  isAdmin: function(req, res, next) {
    if((req.user && req.user.rank === "admin") || (req.userAuth && req.userAuth.admin === true)) {
      next();
    }
    else {
      res.json(401, { error: "unaturhorized" });
    }
  },

  // Passport login handlers
  localRegister: passport.authenticate("local-register"),
  localLogin: passport.authenticate("local-login"),
  facebook: passport.authenticate("facebook"),
  facebookCallback: passport.authenticate("facebook"),
  bearerAuth: passport.authenticate("bearer"),
  cookieAuth: passport.authenticate("cookie")
};