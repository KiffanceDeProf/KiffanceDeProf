/**
 * General API
 * @file app/controllers/general.js
 */

"use strict";

module.exports = {
  apiInfo: function(req, res) {
    res.json({
      wow: "such api"
    });
  }
};