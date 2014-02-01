/**
 * Request Handlers
 * @file lib/handlers.js
 */

"use strict";

module.exports = {
  auth: function(authLevel) { // authLevel: 0=everyone; 1=logged only; 2=staff only
    if(authLevel === 0 || authLevel === undefined) {
      return function(req, res, next) {
        next();
      };
    }
    else {
      // @TODO: Do some auth magic
      return function(req, res) {
        res.json("401", {
          error: "unauthorized"
        });
      };
    }
  }
};