/**
 * General API
 * @file lib/routes/general.js
 */

"use strict";

module.exports = function(/* app */) {
  return {
    apiInfo: function(req, res) {
      res.json({
        wow: "such api"
      });
    },
    paramTest: function(req, res) {
      res.json({
        id: req.params.id
      });
    },
    admin: function(req, res) {
      res.json({
        test: true
      });
    }
  };
};