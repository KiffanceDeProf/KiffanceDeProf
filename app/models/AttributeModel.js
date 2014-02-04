/**
 * Attribute Model
 * @file app/models/AttributeModel.js
 */

"use strict";

module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var AttributeSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: null
    },
    type: {
      type: String,
      required: true,
      enum: ["bonus", "malus", "immune"]
    },
    map: [],
    data: Schema.Types.Mixed
  });

  AttributeSchema.path("map").validate(function(value) {
    console.log(value);
    return true;
  });

  var AttributeModel = mongoose.model("Attribute", AttributeSchema);

  return AttributeModel;
};