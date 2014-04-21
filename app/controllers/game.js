/**
 * Game Resource API
 * @file app/contollers/Games.js
 */

"use strict";

var mongoose = require("mongoose"),
    Game = mongoose.models.Game;

module.exports = {
  /**
   * List all Games
   */
  list: function(req, res, next) {
    Game.find({ user: req.user._id }).exec(function(err, result) {
      if(err) {
        next(err);
        return;
      }

      res.json(result);
    });
  },

  /**
   * Create a Game
   */
  create: function(req, res) {
    var postData = req.body;
    var newGame = new Game();

    newGame.user = req.user._id || postData.user || null;
    newGame.course = postData.course || null;
    newGame.save(function(err) {
      if(err) {
        res.json(400, {
          error: "bad request"
        });
        return;
      }

      res.json(newGame);
    });
  },

  /**
   * Get one Game
   */
  find: function(req, res, next) {
    if(req.params.gameId) {
      Game.findOne({ _id: req.params.gameId }, function(err, result) {
        if(err) {
          next(err);
          return;
        }
        else if(!result) {
          res.json(404, {
            error: "not found"
          });
        }
        else {
          res.json(result);
        }
      });
    }
    else {
      res.json(400, {
        message: "bad request"
      });
    }
  },

  /**
   * Update (PUT) one Game
   */
  update: function(req, res, next) {
    var postData = req.body;
    if(req.params.gameId) {
      Game.findOne({ _id: req.params.gameId }, function(err, result) {
        if(err) {
          next(err);
          return;
        }
        else if(!result) {
          res.json(404, {
            error: "not found"
          });
        }
        else if(result.user === req.user._id || req.user.rank === "admin") {
          if("type" in postData) { result.type = postData.type; }
          if("name" in postData) { result.name = postData.name; }
          if("description" in postData) { result.description = postData.description; }

          result.save(function(err) {
            if(err) {
              res.json(400, {
                error: "bad request"
              });
              return;
            }

            res.json(result);
          });
        }
        else {
          res.json(401, {
            error: "unauthorized"
          });
        }
      });
    }
  },

  /**
   * Delete one Game
   */
  delete: function(req, res, next) {
    if(req.params.gameId) {
      Game.findOne({ _id: req.params.gameId }, function(err, result) {
        if(err) {
          next(err);
          return;
        }
        else if(!result) {
          res.json(404, {
            error: "not found"
          });
        }
        else if(result.user === req.user._id || req.user.rank === "admin") {
          result.remove(function(err) {
            if(err) {
              next(err);
            }
            else {
              res.json(200, {
                status: "done"
              });
            }
          });
        }
        else {
          res.json(401, {
            error: "unauthorized"
          });
        }
      });
    }
    else {
      res.json(400, {
        message: "bad request"
      });
    }
  }
};