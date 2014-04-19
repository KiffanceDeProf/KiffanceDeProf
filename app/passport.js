/**
 * Setup passport
 * @file app/passport.js
 */

"use strict";

var LocalStrategy = require("passport-local").Strategy,
    BearerStrategy = require("passport-http-bearer").Strategy,
    CookieStrategy = require("./lib/CookieStrategy").Strategy,
    FacebookStrategy = require("passport-facebook").Strategy,
    TwitterStrategy = require("passport-twitter").Strategy,
    GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
    PassportConfig = require("./passport-config.json");

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
    User.findOne({ bearerToken: token }, function(err, user) {
      if (err) {
        return done(err);
      }
      else if(!user) {
        return done(null, false);
      }
      else {
        return done(null, user);
      }
    });
  }));

  /**
   * Cookie Strategy for API auth
   */
  passport.use(new CookieStrategy(function(token, done) {
    User.findOne({ linkCookie: token }, function(err, user) {
      if (err) {
        return done(err);
      }
      else if(!user) {
        return done(null, false);
      }
      else {
        user.linkCookie = null; // On le consomme, pour aps le réutiliser
        user.save(); // osef de l'async #yolo
        return done(null, user);
      }
    });
  }));

  /**
   * Facebook Strategy
   */
  passport.use("facebook", new FacebookStrategy({
    clientID: PassportConfig.facebook.clientId,
    clientSecret: PassportConfig.facebook.clientSecret,
    callbackURL: "http://sandhose.fr:1337/api/auth/facebook/callback",
    passReqToCallback: true,
    display: "popup",
    profileFields: ["id", "displayName", "photos", "profileUrl"]
  }, function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({ "auth.facebook.id": profile.id }, function(err, user) {
        if (err) {
          return done(err);
        }
        else if(req.user) {
          req.user.auth.facebook = {
            id: profile.id,
            token: accessToken,
            name: profile.displayName,
            url: profile.profileUrl,
            profilePicture: profile.photos[0].value || null
          };

          req.user.save(function(err) {
            if(err) {
              throw err;
            }
            else {
              return done(null, req.user);
            }
          });
        }
        else if (user) {
          user.auth.facebook.name = profile.displayName;
          user.save();
          return done(null, user);
        }
        else { // Crée l"utilisateur
          var newUser = new User();
          newUser.screenName = profile.username || "Anonymous";
          newUser.auth.facebook = {
            id: profile.id,
            token: accessToken,
            name: profile.displayName,
            url: profile.profileUrl,
            profilePicture: profile.photos[0] || null
          };
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
  }));

  /**
   * Twitter Strategy
   */
  passport.use("twitter", new TwitterStrategy({
    consumerKey: PassportConfig.twitter.consumerKey,
    consumerSecret: PassportConfig.twitter.consumerSecret,
    callbackURL: "http://sandhose.fr:1337/api/auth/twitter/callback",
    passReqToCallback: true,
    profileFields: ["id", "displayName", "photos", "profileUrl"]
  }, function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({ "auth.twitter.id": profile.id }, function(err, user) {
        if (err) {
          return done(err);
        }
        else if(req.user) {
          req.user.auth.twitter = {
            id: profile.id,
            token: accessToken,
            displayName: profile.displayName,
            username: profile.username,
            profilePicture: profile.photos[0].value || null
          };

          req.user.save(function(err) {
            if(err) {
              throw err;
            }
            else {
              return done(null, req.user);
            }
          });
        }
        else if (user) {
          user.auth.twitter.displayName = profile.displayName;
          user.auth.twitter.username = profile.username;
          user.save();
          return done(null, user);
        }
        else { // Crée l'utilisateur
          var newUser = new User();
          newUser.screenName = profile.username || "Anonymous";
          newUser.auth.twitter = {
            id: profile.id,
            token: accessToken,
            displayName: profile.displayName,
            username: profile.username,
            profilePicture: profile.photos[0].value || null
          };
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            else {
              return done(null, newUser);
            }
          });
        }

      });
    });
  }));

  /**
   * Google Strategy
   */
  passport.use("google", new GoogleStrategy({
    clientID: PassportConfig.google.clientId,
    clientSecret: PassportConfig.google.clientSecret,
    callbackURL: "http://sandhose.fr:1337/api/auth/google/callback",
    passReqToCallback: true
  }, function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      console.log(profile);
      User.findOne({ "auth.google.id": profile.id }, function(err, user) {
        if (err) {
          return done(err);
        }
        else if(req.user) {
          req.user.auth.google = {
            id: profile.id,
            token: accessToken,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile._json.picture,
            url: profile._json.link
          };

          req.user.save(function(err) {
            if(err) {
              throw err;
            }
            else {
              return done(null, req.user);
            }
          });
        }
        else if (user) {
          user.auth.google.displayName = profile.displayName;
          user.auth.google.email = profile.emails[0].value;
          user.auth.google.profilePicture = profile._json.picture;
          user.auth.google.url = profile._json.link;
          user.save();
          return done(null, user);
        }
        else { // Crée l'utilisateur
          var newUser = new User();
          newUser.screenName = profile.username || "Anonymous";
          req.user.auth.google = {
            id: profile.id,
            token: accessToken,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile._json.picture,
            url: profile._json.link
          };
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            else {
              return done(null, newUser);
            }
          });
        }

      });
    });
  }));

  /**
   * Local Strategy
   * --> User/Pass
   */

  // Register
  passport.use("local-register", new LocalStrategy({ // @TODO: Local link
      usernameField : "email",
      passwordField : "password",
      passReqToCallback: true // Pour pouvoir set le pseudo
    },
    function(req, email, password, done) {
      process.nextTick(function() { // Sinon ca marche pas...
        User.findOne({ "auth.local.email" :  email }, function(err, user) { // Verifie si l"utilisateur existe
          if (err) {
            return done(err);
          }
          else if (user) {
            return done(null, false);
          }
          else { // Crée l"utilisateur
            var newUser = new User();
            newUser.screenName = req.body.screenName || "Anonymous";
            newUser.auth.local.email = email;
            newUser.auth.local.password = newUser.generateHash(password);
            newUser.save(function(err) {
              if (err) { // Quelque chose s"est mal passé... :(
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