/**
 * Users API
 * @file app/controllers/users.js
 */

"use strict";

var crypto = require("crypto");

module.exports = {
  generateBearer: function(req, res) {
    if(req.user._id) {
      var randomHash = crypto.randomBytes(256),
          token = crypto.createHmac("sha1", new Buffer(req.user._id)).update(randomHash).digest("base64");
      req.user.bearerToken = token;
      req.user.save(function(err) {
        if(err) {
          throw err;
        }
        else {
          res.json({
            token: token
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
  }
};