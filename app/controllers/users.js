/**
 * Users API
 * @file app/controllers/users.js
 */

"use strict";

var crypto = require("crypto");

var Users = {
  _randToken: function(id) {
    var randomHash = crypto.randomBytes(256),
        token = crypto.createHmac("sha1", new Buffer(id)).update(randomHash).digest("base64");
    return token;
  },
  generateBearer: function(req, res) {
    if(req.user && req.user._id) {
      req.user.bearerToken = Users._randToken(req.user._id);
      req.user.save(function(err) {
        if(err) {
          throw err;
        }
        else {
          res.json({
            token: req.user.bearerToken
          });
        }
      });
    }
    else {
      res.json(401, {
        error: "can't log in"
      });
    }
  },
  generateLinkCookie: function(req, res) {
    if(req.user && req.user._id) {
      req.user.linkCookie = Users._randToken(req.user._id);
      req.user.save(function(err) {
        if(err) {
          throw err;
        }
        else {
          res.cookie("auth-token", req.user.linkCookie);
          res.json({
            status: "success",
            message: "cookie set"
          });
        }
      });
    }
    else {
      res.json(401, {
        error: "can't log in"
      });
    }
  },
  me: function(req, res) {
    var resData = {
      screenName: req.user.screenName,
      auth: {
        facebook: req.user.auth.facebook.toObject() || false,
        twitter: req.user.auth.twitter.toObject() || false,
        google: req.user.auth.google.toObject() || false,
        local: req.user.auth.local.toObject() || false
      },
      rank: req.user.rank
    };

    for(var i in resData.auth) { // On vire toutes les info confidentielles
      if(resData.auth[i].token) {
        resData.auth[i].token = undefined;
      }

      if(resData.auth[i].password) {
        resData.auth[i].password = undefined;
      }

      if(Object.keys(resData.auth[i]).length === 0) {
        resData.auth[i] = false;
      }
    }

    res.json(resData);
  },
  oauthPopup: function(req, res) {
    if(req.user && req.user._id) {
      req.user.bearerToken = Users._randToken(req.user._id);
      req.user.save(function(err) {
        if(err) {
          throw err;
        }
        else {
          res.writeHead(200, {
            "Content-Type": "text/html"
          });

          res.end("<!DOCTYPE html><html><head><title>Redirecting</title><link rel=\"stylesheet\" href=\"/css/popup.css\" /></head><body><h1>Redirection en cours...</h1><script type=\"text/javascript\">window.opener.doneLogin('" + req.user.bearerToken + "')</script></body></html>"); // C'pas beau, je sais
        }
      });
    }
    else {
      res.json(401, {
        error: "can't log in"
      });
    }
  },
  adminOnly: function(req, res) {
    res.json({
      wow: "such admin (" + req.userAuth.user + ")"
    });
  },
  validate: function(req, res) {
    if(req.user && req.user._id) {
      res.json({
        valid: true
      });
    }
    else {
      res.json({
        valid: false
      });
    }
  },
  unlinkFacebook: function(req, res) {
    if(req.user && req.user._id) {
      Users._unlink(req.user, "facebook").save(function(err) {
        if(err) {
          throw err;
        }
        res.json({
          status: "done"
        });
      });
    }
  },
  _unlink: function(user, provider) {
    if(user.auth[provider]) {
     user.auth[provider] = undefined;
    }
    return user;
  }
};

module.exports = Users;