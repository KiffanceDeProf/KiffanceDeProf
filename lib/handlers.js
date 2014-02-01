/**
 * Request Handlers
 * @file lib/handlers.js
 */

"use strict";

module.exports = {
  auth: function(authLevel) { // authLevel: 0=everyone; 1=logged only; 2=staff only
    if(authLevel === 0 || authLevel === undefined) {
      return function(req, res, next) {
        res.apiAuthorized = true;
        next();
      };
    }
    else {
      // @TODO: Do some auth magic
      return function(req, res, next) {
        res.apiAuthorized = false;
        next();
      };
    }
  },

  apiResponse: function(req, res) {
    res.set({
      "Content-Type": "application/json"
    });

    if(!res.apiAuthorized || res.apiStatus === 401) { // Unauthorized
      res.json(401, {
        error: "unauthorized"
      });
    }
    else if(res.apiStatus === 200 && res.responseBody) { //
      res.json(res.apiStatus, res.responseBody);
    }
    else if(res.responseBody === undefined || res.apiStatus === 404) { // Not found
      res.json(404, {
        error: "not found"
      });
    }
    else {
      res.json(500, { // I don't know what happened :(
        error: "internal server error"
      });
    }
  }
};