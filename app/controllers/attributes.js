/**
 * Attributes Resource API
 * @file app/contollers/attributes.js
 */

"use strict";

var mongoose = require("mongoose"),
    Attribute = mongoose.models.Attribute;

module.exports = {
  list: function(req, res, next) {
    Attribute.find().exec(function(err, result) {
      if(err) {
        next(err);
        return;
      }

      res.json(result);
    });
  },
  create: function(req, res) {
    var postData = req.body;
    var newAttribute = new Attribute();

    newAttribute.name = postData.name || null;
    newAttribute.description = postData.description || null;
    newAttribute.type = postData.type || null;
    newAttribute.map = postData.map || null;
    newAttribute.data = postData.data || null;
    newAttribute.save(function(err) {
      if(err) {
        res.json(400, {
          error: "bad request"
        });
        return;
      }

      res.json(newAttribute);
    });
  },

  /**
   * Get one Attribute
   */
  find: function(req, res, next) {
    if(req.params.AttributeId) {
      Attribute.findOne({ _id: req.params.AttributeId }, function(err, result) {
        if(err) {
          next(err);
          return;
        }
        else if(!result) {
          res.json(404, {
            error: "not found"
          });
        }
        else {
          res.json(result);
        }
      });
    }
    else {
      res.json(400, {
        message: "bad request"
      });
    }
  },

  /**
   * Update (PUT) one Attribute
   */
  update: function(req, res, next) {
    var postData = req.body;
    if(req.params.AttributeId) {
      Attribute.findOne({ _id: req.params.AttributeId }, function(err, result) {
        if(err) {
          next(err);
          return;
        }
        else if(!result) {
          res.json(404, {
            error: "not found"
          });
        }
        else {
          if("name" in postData) { result.name.full = postData.name || null; }
          if("description" in postData) { result.description = postData.description || null; }
          if("type" in postData) { result.type = postData.type || null; }
          if("map" in postData) { result.map = postData.map || null; }
          if("data" in postData) { result.data = postData.data || null; }

          result.save(function(err) {
            if(err) {
              res.json(400, {
                error: "bad request",
                details: err
              });
              return;
            }

            res.json(result);
          });
        }
      });
    }
  },

  /**
   * Delete one Attribute
   */
  delete: function(req, res) {
    if(req.params.AttributeId) {
      Attribute.remove({ _id: req.params.AttributeId }, function(err) {
        if(err) {
          res.json(404, {
            message: "not found"
          });
          return;
        }

        res.json({
          status: "ok"
        });
      });
    }
    else {
      res.json(400, {
        message: "bad request"
      });
    }
  }
};