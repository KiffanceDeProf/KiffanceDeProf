"use strict";

angular.module("k2pControllers")
  .controller("ProfileCtrl", ["$scope", "$location", "Auth", function ($scope, $location, Auth) {
    Auth.isLogged().catch(function() {
      $location.path("/auth");
    });

    Auth.getUserInfo().then(function(res) {
      $scope.user = res.data;
    }, function() {
      $scope.user = {};
      $location.path("/auth");
    });
  }]);
