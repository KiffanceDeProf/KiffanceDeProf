"use strict";

angular.module("k2pControllers")
  .controller("AuthCtrl", ["$scope", "$location", "Auth", function ($scope, $location, Auth) {
    Auth.isLogged().then(function() {
      $location.path("/profile");
    });

    $scope.auth = {
      local: {
        login: function(input) {
          Auth.login("local", {
            email: input.email,
            password: input.password
          }).then(function() {
            $scope.localLoginForm.$setValidity("login", true);
            $location.path("/");
          }, function() {
            $scope.localLoginForm.$setValidity("login", false);
          });
        },
        register: function(input) {
          if(!$scope.localRegisterForm.$valid) {
            return;
          }
          Auth.register("local", {
            email: input.email,
            password: input.password,
            screenName: input.screenName
          }).then(function() {
            $scope.localLoginForm.$setValidity("register", true);
            $location.path("/");
          }, function() {
            $scope.localLoginForm.$setValidity("register", false);
          });
        }
      },
      facebook: function() {
        Auth.login("facebook").then(function() {
          $location.path("/");
        });
      },
      twitter: function() {
        Auth.login("twitter").then(function() {
          $location.path("/");
        });
      }
    };
  }]);
