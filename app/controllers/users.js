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
    res.json(req.user);
  },
  adminOnly: function(req, res) {
    res.json({
      wow: "such admin (" + req.userAuth.user + ")"
    });
  }
};