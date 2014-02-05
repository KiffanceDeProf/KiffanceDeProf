/**
 * Users Model
 * @file app/models/UserModel.js
 */

"use strict";

var bcrypt = require("bcrypt");

module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var UserSchema = new Schema({
    screenName: {
      type: String,
      default: null
    },
    auth: {
      local: {
        email: String,
        password: String,
      },
      facebook: {
        id: String,
        token: String,
        email: String,
        name: String
      },
      twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
      },
      google: {
        id: String,
        token: String,
        email: String,
        name: String
      }
    },
    bearerToken: {
      type: String,
      default: null
    },
    rank: {
      type: String,
      required: true,
      enum: ["user", "admin"], // Maybe more ? Moderators ?
      default: "user"
    }
  });

  UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 8);
  };

  UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.auth.local.password);
  };

  var UserModel = mongoose.model("User", UserSchema);

  return UserModel;
};