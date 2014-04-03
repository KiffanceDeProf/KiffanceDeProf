"use strict";

angular
  .module("kiffanceDeProfApp", [
    "ngCookies",
    "ngResource",
    "ngRoute"
  ])
  .config(function($routeProvider) {
    $routeProvider
      .when("/classroom", {
        templateUrl: "views/classroom.html",
        controller: "ClassroomCtrl"
      });
  });
