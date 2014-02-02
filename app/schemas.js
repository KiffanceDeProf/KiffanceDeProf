/**
 * Mongoose database schemas
 * @file app/schemas.js
 */

"use strict";

module.exports = function(mongoose) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

  var Attribute = new Schema({
    name: String,
    description: String,
    type: Number,
    map: Object,
    data: Schema.Types.Mixed
  });

  var Student = new Schema({
    name: {
      first: {
        type: String,
        required: true
      },
      last: {
        type: String,
        required: true
      }
    },
    course: {
      type: ObjectId,
      default: null,
      ref: "Course"
    },
    description: {
      type: String,
      default: null
    },
    attributes: [{
      type: ObjectId,
      ref: Attribute
    }]
  });

  Student.virtual("name.full").get(function() {
    return this.name.first + " " + this.name.last;
  }).set(function (name) {
    if(name) {
      var split = name.split(" ");
      this.name.first = split[0];
      this.name.last = split[1];
    }
  });

  // Student.path("course").validate(function(value, cb) {
  //   if(value) {
  //     mongoose.models.Course.find({_id: value}, function(err, result) {
  //       if(err || !result || result.length === 0) {
  //         cb(false);
  //       }
  //       else {
  //         cb(true);
  //       }
  //     }, "Course does not exists!");
  //   }
  //   else {
  //     cb(true);
  //   }
  // });

  var Course = new Schema({
    name: {
      type: String,
      required: true
    },
    description: String,
    type: {
      type: Number,
      min: 4,
      max: 6,
      required: true
    }
  });

  var Game = new Schema({
    user: ObjectId,
    course: ObjectId,
    studentsMap: [ObjectId]
  });

  var schemas = {
    Student: mongoose.model("Student", Student),
    Attribute: mongoose.model("Attribute", Attribute),
    Course: mongoose.model("Course", Course),
    Game: mongoose.model("Game", Game)
  };

  console.log("✔ Schemas loaded:", Object.keys(schemas));

  return schemas;
};