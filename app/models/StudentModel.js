/**
 * Student Model
 * @file app/models/StudentModel.js
 */

"use strict";

module.exports = function(mongoose) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

  var StudentSchema = new Schema({
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
      strength: {
        type: Number,
        min: 0,
        max: 10,
        default: 10,
        required: true
      },
      attribute: {
        type: ObjectId,
        ref: "Attribute",
        required: true
      }
    }]
  });

  StudentSchema.virtual("name.full").get(function() {
    return this.name.first + " " + this.name.last;
  }).set(function (name) {
    if(name) {
      var split = name.split(" ");
      this.name.first = split[0];
      this.name.last = split[1];
    }
  });

  var StudentModel = mongoose.model("Student", StudentSchema);

  return StudentModel;
};