"use strict";

angular.module("k2pControllers", []);
angular.module("k2pDirectives", []);
angular.module("k2pServices", []);

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
      });
  });
