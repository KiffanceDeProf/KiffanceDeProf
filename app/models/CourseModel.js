/**
 * Course Model
 * @file app/models/CourseModel.js
 */

"use strict";

module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var CourseSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    description: String,
    type: {
      type: Number,
      min: 3,
      max: 6,
      required: true
    }
  });

  var CourseModel = mongoose.model("Course", CourseSchema);

  return CourseModel;
};
