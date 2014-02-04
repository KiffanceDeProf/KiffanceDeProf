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
    studentsMap: [{
      seat: {
        type: Number,
        required: true
      },
      student: {
        type: ObjectId,
        ref: "Student",
        required: true
      }
    }]
  });

  var GameModel = mongoose.model("Game", GameSchema);

  return GameModel;
};