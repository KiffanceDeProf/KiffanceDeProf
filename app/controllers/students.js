/**
 * Students Resource API
 * @file app/contollers/students.js
 */

"use strict";

var mongoose = require("mongoose"),
    Student = mongoose.models.Student;

module.exports = {
  list: function(req, res, next) {
    Student.find().exec(function(err, result) {
      if(err) {
        next(err);
        return;
      }

      res.json(result);
    });
  },
  create: function(req, res) {
    var postData = req.body;
    var newStudent = new Student();

    newStudent.fullName = postData.name.full || undefined;
    newStudent.description = postData.description || undefined;
    newStudent.save(function(err) {
      if(err) {
        res.json(400, {
          error: "bad request"
        });
        return;
      }

      res.json(newStudent);
    });
  },

  /**
   * Get one Student
   */
  find: function(req, res, next) {
    if(req.params.id) {
      Student.findOne({ _id: req.params.id }, function(err, result) {
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
   * Update (PUT) one student
   */
  update: function(req, res, next) {
    var postData = req.body;
    if(req.params.id) {
      Student.findOne({ _id: req.params.id }, function(err, result) {
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
          result.name.full = postData.fullName || result.name.full;
          result.description = postData.description || result.description;

          result.save(function(err) {
            if(err) {
              res.json(400, {
                error: "bad request"
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
   * Delete one student
   */
  delete: function(req, res) {
    if(req.params.id) {
      Student.remove({ _id: req.params.id }, function(err) {
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