"use strict";

angular
  .module("k2pApp", [
    "ngCookies",
    "ngResource",
    "ngRoute",
    "k2pControllers",
    "k2pServices",
    "k2pDirectives"
  ])
  .config(function($routeProvider) {
    $routeProvider
      .when("/classroom/:courseId", {
        templateUrl: "views/classroom.html",
        controller: "ClassroomCtrl"
      })
      .when("/auth", {
        templateUrl: "views/auth.html",
        controller: "AuthCtrl"
      })
      .when("/profile", {
        templateUrl: "views/profile.html",
        controller: "ProfileCtrl"
      })
      .when("/games", {
        templateUrl: "views/gameList.html",
        controller: "GameListCtrl"
      })
      .when("/", {
        templateUrl: "views/home.html",
        controller: "HomeCtrl"
      });
  });


angular.module("k2pControllers", []);
angular.module("k2pDirectives", []);
angular.module("k2pServices", ["ngResource", "ngStorage"]);