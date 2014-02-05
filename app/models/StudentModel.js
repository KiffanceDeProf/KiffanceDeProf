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
      //pour les noms composés type "Henry De La Turbidière"
      var idx = name.indexOf(" ");
      if(idx !== -1) {
        this.name.first = name.substr(0,idx); //avant l'espace
        this.name.last = name.substr(idx+1); //après l'espace
      } else { //pas de nom de famille (-1) ?
        this.name.first = name;
        this.name.last = "";
      }
    }
  });

  var StudentModel = mongoose.model("Student", StudentSchema);

  return StudentModel;
};
