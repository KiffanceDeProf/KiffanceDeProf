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

    newStudent.name.full = postData.fullName || null;
    newStudent.description = postData.description || null;
    newStudent.course = postData.course || null;
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
    if(req.params.studentId) {
      Student.findOne({ _id: req.params.studentId }, function(err, result) {
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
    if(req.params.studentId) {
      Student.findOne({ _id: req.params.studentId }, function(err, result) {
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
          if("fullName" in postData) { result.name.full = postData.fullName || null; }
          if("description" in postData) { result.description = postData.description || null; }
          if("course" in postData) { result.course = postData.course || null; }

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
   * Delete one student
   */
  delete: function(req, res) {
    if(req.params.studentId) {
      Student.remove({ _id: req.params.studentId }, function(err) {
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