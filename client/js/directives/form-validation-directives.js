"use strict";

angular.module("k2pDirectives")
  .directive("passwordMatch", ["$parse", function($parse) {
    return {
      restrict: "A",
      require: "ngModel",
      link: function (scope, elem, attrs, control) {
        var checker = function () {
          var e1 = $parse(attrs.ngModel)(scope); 
          var e2 = $parse(attrs.passwordMatch)(scope);
          return e1 === e2;
        };
        scope.$watch(checker, function (n) {
          control.$setValidity("passMatch", n);
        });
      }
    };
  }]);