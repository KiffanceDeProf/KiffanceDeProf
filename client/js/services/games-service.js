/**
 * Games services
 */
"use strict";

angular.module("k2pServices")
  .factory("Games", ["$resource", "Auth", function($resource, Auth) {
    return $resource("/api/games/:gameId", {}, {
      query: { method: "GET", isArray: true, headers: { Authorization: "Bearer " + Auth.getToken() }},
      save: { method: "POST", headers: { Authorization: "Bearer " + Auth.getToken() }},
      get: { method: "GET", headers: { Authorization: "Bearer " + Auth.getToken() }},
      remove: { method: "DELETE", headers: { Authorization: "Bearer " + Auth.getToken() }},
    });
  }]);