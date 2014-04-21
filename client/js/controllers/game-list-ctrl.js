"use strict";

angular.module("k2pControllers")
  .controller("GameListCtrl", ["$scope", "$location", "Courses", "Games", function ($scope, $location, Courses, Games) {
    $scope.games = Games.query();
    $scope.courses = Courses.query(function() {
      $scope.coursesWithID = {};
      for(var i = 0; i < $scope.courses.length; i++) {
        $scope.coursesWithID[$scope.courses[i]._id] = $scope.courses[i];
      }
    });

    $scope.startNewGame = function(id) {
      var theCourse = $scope.coursesWithID[id];

      if(!theCourse) {
        console.warn("invalid game id", id);
      }
      else {
        console.log("starting new game", theCourse);
        var theGame = new Games({ course: theCourse._id });
        theGame.$save(function(game) {
          $location.path("/games/" + game._id);
        });
      }
    };
  }]);
