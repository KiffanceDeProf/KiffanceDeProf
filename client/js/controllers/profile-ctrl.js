"use strict";

angular.module("k2pControllers")
  .controller("ProfileCtrl", ["$scope", "$location", "Auth", function ($scope, $location, Auth) {
    Auth.isLogged().catch(function() {
      $location.path("/auth");
    });

    var load = function() {
      Auth.getUserInfo().then(function(res) {
        $scope.user = res.data;
      }, function() {
        $scope.user = {};
        $location.path("/auth");
      });
    };

    load();

    $scope.login = function(provider) {
      $scope.startLink(provider);
      Auth.login(provider).then(function() {
        load();
      });
    };

    $scope.startLink = function(provider) {
      console.log("Start linking with", provider);
      Auth.getLinkCookie().catch(function(err) {
        console.warn(err);
      });
    };

    $scope.unlink = function(provider) {
      console.log("Unlinking", provider);
      Auth.unlink(provider).then(function() {
        load();
      }, function(err) {
        console.error("Failed to unlink", provider, err);
      });
    };
  }]);
