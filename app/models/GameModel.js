/**
 * Game Model
 * @file app/models/GameModel.js
 */

"use strict";

module.exports = function(mongoose) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

  var GameSchema = new Schema({
    user: {
      type: ObjectId,
      ref: "User",
      required: true
    },
    course: {
      type: ObjectId,
      ref: "Course",
      required: true
    },
    trimester: [{
      min: 1,
      max: 3,
      required: true,
      overallScore: {
        type: Number,
        required: true
      },
      studentsMap: [{
        seat: {
          type: Number,
          required: true
        },
        student: {
          type: ObjectId,
          ref: "Student",
          required: true
        },
        mood: {
          default: 10,
          type: Number,
          required: true
        },
        note: {
          default: 10,
          type: Number,
          required: true
        }
      }]
    }]
  });

  var GameModel = mongoose.model("Game", GameSchema);

  return GameModel;
};
