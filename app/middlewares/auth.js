/**
 * Request Handlers
 * @file app/middlewares/auth.js
 */

"use strict";

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
    if(req.userAuth.logged) {
      next();
    }
    else {
      res.json(401, { error: "unaturhorized" });
    }
  },
  isAdmin: function(req, res, next) {
    if(req.userAuth.admin) {
      next();
    }
    else {
      res.json(401, { error: "unaturhorized" });
    }
  }
};