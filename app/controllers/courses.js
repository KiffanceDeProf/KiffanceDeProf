/**
 * Course Resource API
 * @file app/contollers/courses.js
 */

"use strict";

var mongoose = require("mongoose"),
    Student = mongoose.models.Student,
    Course = mongoose.models.Course;

module.exports = {
  /**
   * List all courses
   */
  list: function(req, res, next) {
    Course.find().exec(function(err, result) {
      if(err) {
        next(err);
        return;
      }

      res.json(result);
    });
  },

  /**
   * Create a course
   */
  create: function(req, res) {
    var postData = req.body;
    var newCourse = new Course();

    newCourse.type = postData.type || null;
    newCourse.name = postData.name || null;
    newCourse.description = postData.description || null;
    newCourse.save(function(err) {
      if(err) {
        res.json(400, {
          error: "bad request"
        });
        return;
      }

      res.json(newCourse);
    });
  },

  /**
   * Get course's students
   */
  getStudents: function(req, res, next) {
    if(req.params.courseId) {
      Student.find({ course: req.params.courseId }, function(err, result) {
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
   * Get a student in the course
   */
  findStudent: function(req, res, next) {
    if(req.params.courseId) {
      Student.findOne({ course: req.params.courseId, _id: req.params.studentId }, function(err, result) {
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
   * Expel a student from the course
   */
  expelStudent: function(req, res, next) {
    if(req.params.courseId) {
      Student.findOne({ course: req.params.courseId, _id: req.params.studentId }, function(err, result) {
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
          result.course = null;
          result.save(function(err) {
            if(err) {
              next(err);
            }
            else {
              res.json(result);
            }
          });
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
   * Add student to the course
   */
  addStudent: function(req, res, next) {
    if(req.params.courseId && req.params.studentId) {
      Course.findOne({ _id: req.params.courseId }, function(err, course) {
        if(err) {
          next(err);
          return;
        }
        else if(!course) {
          res.json(404, {
            error: "not found"
          });
        }
        else {
          Student.findOne({ _id: req.params.studentId }, function(err2, student) {
            if(err2) {
              next(err2);
              return;
            }
            else if(!student) {
              res.json(404, {
                error: "not found"
              });
            }
            else {
              student.course = course._id;
              student.save(function(err) {
                if(err) {
                  next(err);
                }
                else {
                  res.json(student);
                }
              });
            }
          });
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
   * Get one course
   */
  find: function(req, res, next) {
    if(req.params.courseId) {
      Course.findOne({ _id: req.params.courseId }, function(err, result) {
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
   * Update (PUT) one course
   */
  update: function(req, res, next) {
    var postData = req.body;
    if(req.params.courseId) {
      Course.findOne({ _id: req.params.courseId }, function(err, result) {
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
          if("type" in postData) { result.type = postData.type; }
          if("name" in postData) { result.name = postData.name; }
          if("description" in postData) { result.description = postData.description; }

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
   * Delete one course
   */
  delete: function(req, res) {
    if(req.params.courseId) {
      Course.remove({ _id: req.params.courseId }, function(err) {
        if(err) {
          res.json(404, {
            message: "not found"
          });
          return;
        }

        Student.update({ course: req.params.courseId }, { $set: { course: null } }, { multi: true }, function(err) {
          if(err) {
            res.json(500, {
              message: "internal error"
            });
          }
          else {
            res.json({
              status: "ok"
            });
          }
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