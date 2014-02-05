/**
 * Setup passport
 * @file app/passport.js
 */

"use strict";

var LocalStrategy = require("passport-local").Strategy,
    BearerStrategy = require("passport-http-bearer").Strategy;
    // FacebookStrategy = require("passport-facebook").Strategy,
    // TwitterStrategy = require("passport-twitter").Strategy,
    // GoogleStrategy = require("passport-google").Strategy;

module.exports.setup = function(passport, mongoose) {
  var User = mongoose.models.User;

  passport.serializeUser(function(user, done) {
    done (null, user);
  });

  passport.deserializeUser(function(user, done) {
    User.findById(user._id, function(err, user) {
      done(err, user);
    });
  });


  /**
   * Bearer Strategy for API auth
   */
  passport.use(new BearerStrategy(function(token, done) {
    console.log(token);
    User.findOne({ bearerToken: token }, function(err, user) {
      if (err) {
        return done(err);
      }
      else if(!user) {
        return done(null, {});
      }
      else {
        return done(null, user);
      }
    });
  }));

  /**
   * Local Strategy
   * --> User/Pass
   */

  // Register
  passport.use("local-register", new LocalStrategy({
      usernameField : "email",
      passwordField : "password"
    },
    function(email, password, done) {
      process.nextTick(function() { // Sinon ca marche pas...
        User.findOne({ "auth.local.email" :  email }, function(err, user) { // Verifie si l'utilisateur existe
          if (err) {
            return done(err);
          }
          else if (user) {
            return done(null, false);
          }
          else { // Crée l'utilisateur
            var newUser = new User();
            newUser.auth.local.email = email;
            newUser.auth.local.password = newUser.generateHash(password);
            newUser.save(function(err) {
              if (err) { // Quelque chose s'est mal passé... :(
                throw err;
              }
              else {
                return done(null, newUser);
              }
            });
          }

        });
      });
    })
  );

  // Login
  passport.use("local-login", new LocalStrategy({
      usernameField : "email",
      passwordField : "password"
    },
    function(email, password, done) {
      User.findOne({ "auth.local.email": email }, function(err, user) {
        if (err) {
          return done(err);
        }
        else if(!user || !user.validatePassword(password)) {
          return done(null, false);
        }
        else {
          return done(null, user);
        }
      });
    })
  );
};