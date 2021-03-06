/**
 * Courses services
 */
"use strict";

angular.module("k2pServices")
  .factory("Courses", ["$resource", function($resource) {
    return $resource("/api/courses/:courseId/:sub", {}, {
      getStudents: {
        method: "GET",
        params: {
          sub: "students"
        },
        isArray: true
      }
    });
  }]);