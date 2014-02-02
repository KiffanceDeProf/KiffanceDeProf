/**
 * Users API
 * @file app/controllers/users.js
 */

"use strict";

module.exports = {
  me: function(req, res) {
    res.json({
      message: "hi, " + req.userAuth.user
    });
  },
  adminOnly: function(req, res) {
    res.json({
      wow: "such admin (" + req.userAuth.user + ")"
    });
  }
};