/**
 * Auth services
 */
"use strict";

angular.module("k2pServices")
  .factory("Auth", ["$http", "$q", "$localStorage", "$rootScope", function($http, $q, $localStorage, $rootScope) {
    var auth = {
      loggedIn: false,
      tokenChecked: false,
      isLogged: function() {
        if(auth.loggedIn) {
          return $q.when();
        }
        else if(auth.tokenChecked) {
          return $q.reject();
        }
        else {
          return auth.validateToken();
        }
      },
      login: function(provider, options) {
        var deferred;
        if(provider === "local") {
          if(options.email && options.password) {
            deferred = $q.defer();
            $http.post("/api/auth/local/login", options)
              .success(function(data, status) {
                if(status >= 200 && status < 400) {
                  if(data.token) {
                    $localStorage.token = data.token;
                  }
                  deferred.resolve(data);
                  auth.loggedIn = true;
                  $rootScope.$broadcast("login");
                }
                else {
                  auth.loggedIn = false;
                  deferred.reject("Status code invalid: " + status);
                }
              })
              .error(function(data) {
                auth.loggedIn = false;
                deferred.reject(data);
              });
            return deferred.promise;
          }
          else {
            return $q.reject("invalid input");
          }
        }
        else if(provider === "facebook" || provider === "twitter") {
          var width = 900,
              height = 800,
              xOffset = (screen.width - width) / 2,
              yOffset = (screen.height - height) / 2;
          var popup = window.open("/api/auth/" + provider, "passport-auth", "toolbar=no,status=no,location=no,menubar=no,titlebar=no,height=" + height + ",width=" + width + ",top=" + yOffset + ",left=" + xOffset);
          deferred = $q.defer();
          if(window.focus) { popup.focus(); }
          window.doneLogin = function(token) {
            auth.loggedIn = true;
            auth.setToken(token).then(function() {
              popup.close();
              $rootScope.$broadcast("login");
              deferred.resolve();
            }, function() {
              auth.loggedIn = false;
              deferred.reject();
            });
          };
          window.thePopup = popup;
          return deferred.promise;
        }

        return $q.reject("invalid provider or not implemented");
      },
      logout: function() {
        delete $localStorage.token;
        auth.loggedIn = false;
        auth.tokenChecked = false;
        return auth;
      },
      register: function(provider, options) {
        if(provider === "local") {
          if(options.email && options.password && options.screenName) {
            var deferred = $q.defer();
            $http.post("/api/auth/local/register", options)
              .success(function(data, status) {
                if(status >= 200 && status < 400) {
                  if(data.token) {
                    $localStorage.token = data.token;
                  }
                  deferred.resolve(data);
                  auth.loggedIn = true;
                  $rootScope.$broadcast("login");
                }
                else {
                  auth.loggedIn = false;
                  deferred.reject("Status code invalid: " + status);
                }
              })
              .error(function(data) {
                auth.loggedIn = false;
                deferred.reject(data);
              });
            return deferred.promise;
          }
          else {
            return $q.reject("invalid input");
          }
        }

        return $q.reject("invalid provider or not implemented");
      },
      getUserInfo: function() {
        var token = $localStorage.token;
        return auth.isLogged().then(function() { 
          return $http({
            method: "get",
            url: "/api/user/me",
            headers: {"Authorization": "Bearer " + token }
          });
        });
      },
      getLinkCookie: function() {
        var token = $localStorage.token;
        return auth.isLogged().then(function() { 
          return $http({
            method: "get",
            url: "/api/auth/cookie",
            headers: {"Authorization": "Bearer " + token }
          });
        });
      },
      setToken: function(token) {
        $localStorage.token = token;
        return auth.validateToken();
      },
      unlink: function(provider) {
        if($localStorage.token) {
          var deferred = $q.defer();
          $http({ 
            method: "delete",
            url: "/api/auth/" + provider,
            headers: {"Authorization": "Bearer " + $localStorage.token }
          }).then(function(response) {
              if(response.data.status === "done") {
                deferred.resolve("done");                
              }
              else {
                deferred.reject("invalid");
              }
            }, function() {
              deferred.reject("server error");
            });
          return deferred.promise;
        }
        else {
          return $q.reject("no token");
        }
      },
      validateToken: function() {
        if($localStorage.token) {
          var deferred = $q.defer();
          $http({ 
            method: "get",
            url: "/api/auth/token/validate",
            headers: {"Authorization": "Bearer " + $localStorage.token }
          }).then(function(response) {
              if(response.data.valid) {
                auth.tokenChecked = true;
                auth.loggedIn = true;
                deferred.resolve("valid");                
              }
              else {
                auth.tokenChecked = true;
                auth.loggedIn = true;
                deferred.reject("invalid");
              }
            }, function() {
              deferred.reject("server error");
            });
          return deferred.promise;
        }
        else {
          return $q.reject("no token");
        }
      }
    };

    return auth;
  }]);