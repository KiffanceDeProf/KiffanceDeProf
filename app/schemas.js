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
      first: String,
      last: String
    },
    course: ObjectId,
    description: String,
    attributes: [ObjectId]
  });

  var Course = new Schema({
    name: String,
    description: String,
    type: Number
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