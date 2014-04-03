"use strict";

angular.module("k2pControllers")
  .controller("FooterCtrl", function ($scope) {
    $scope.stats = {
      users: {
        count: 12345,
        online: 4321
      }
    };
  });
