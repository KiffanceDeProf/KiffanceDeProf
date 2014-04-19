"use strict";

var passport = require("passport"),
    util = require("util");

function Strategy(options, verify) {
  if(typeof options === "function") {
    verify = options;
    options = {};
  }
  if (!verify) { throw new Error("cookie authentication strategy requires a verify function"); }
  
  this._key = options.key || "auth-token";
  
  passport.Strategy.call(this);
  this.name = "cookie";
  this._verify = verify;
}

util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function(req) {
  if(req.isAuthenticated()) { 
    return this.pass(); 
  }
  
  var token = req.cookies[this._key];
  
  if (!token) { return this.pass(); }
  
  var self = this;
  
  function verified(err, user, info) {
    if (err) { return self.error(err); }
    
    var res = req.res;
    
    if (!user) {
      res.clearCookie(self._key);
      return self.pass();
    }
    
    res.clearCookie(self._key);
    return self.success(user, info);
  }
  
  self._verify(token, verified);
};

module.exports.Strategy = Strategy;