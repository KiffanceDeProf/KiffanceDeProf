"use strict";

angular.module("k2pControllers")
  .controller("HeaderCtrl", ["$scope", "$location", "$rootScope", "Auth", function ($scope, $location, $rootScope, Auth) {
    $scope.auth = {
      logged: false,
      logout: function() {
        Auth.logout();
        $scope.auth.logged = false;
        $location.path("/auth");
      }
    };

    Auth.isLogged().then(function() {
      $scope.auth.logged = true;
    }, function() {
      $scope.auth.logged = false;
    });

    $rootScope.$on("login", function() {
      Auth.isLogged().then(function() {
        $scope.auth.logged = true;
      }, function() {
        $scope.auth.logged = false;
      });
    });
  }]);
