/**
 * Loads mongoose database models
 * @file app/schemas.js
 */

"use strict";

module.exports = function(mongoose) {

  var modelsToLoad = ["Student", "Course", "Game", "Attribute", "User"];
  var models = {};

  for(var i = 0, len = modelsToLoad.length, modelName; i < len; i++) {
    modelName = modelsToLoad[i];
    try {
      models[modelName] = require("./models/" + modelName + "Model.js")(mongoose);
    }
    catch(e) {
      console.log("✖ Can't load model", modelName, e);
    }
  }

  console.log("✔ Models loaded:", Object.keys(models));

  return models;
};