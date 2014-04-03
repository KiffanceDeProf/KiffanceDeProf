"use strict";

angular.module("kiffanceDeProfApp")
  .controller("FooterCtrl", function ($scope) {
    $scope.stats = {
      users: {
        count: 12345,
        online: 4321
      }
    };
  });
