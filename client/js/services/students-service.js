/**
 * Students services
 */
"use strict";

angular.module("k2pServices", ["ngResource"])
  .factory("Students", ["$resource", function($resource) {
    return $resource("/api/students/:studentId");
  }]);