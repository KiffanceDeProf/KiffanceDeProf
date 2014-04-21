/** 
 * Routes definition & loading
 * @file app/routes.js
 */

"use strict";

var expressPath = require("express-path");

exports.setup = function setup(app) {
  var apiPath = app.get("api path");
  var routes = [
    [apiPath + "/", "general#apiInfo", "auth#init", "get"],
    [apiPath + "/user/me", "users#me", "auth#init", "auth#bearerAuth", "get"],
    [apiPath + "/user/me/cookie", "users#me", "auth#init", "auth#cookieAuth", "get"],
    [apiPath + "/admin-only", "users#adminOnly", "auth#init", "auth#isAdmin", "get"],

    [apiPath + "/auth/local/login", "users#generateBearer", "auth#init", "auth#localLogin", "post"],
    [apiPath + "/auth/local/register", "users#generateBearer", "auth#init", "auth#localRegister", "post"],

    [apiPath + "/auth/facebook", "users#generateBearer", "auth#init", "auth#facebook", "get"],
    [apiPath + "/auth/facebook/callback", "users#oauthPopup", "auth#init", "auth#cookieAuth", "auth#facebookCallback", "get"],
    [apiPath + "/auth/facebook", "users#unlinkFacebook", "auth#init", "auth#bearerAuth", "delete"],

    [apiPath + "/auth/twitter", "users#generateBearer", "auth#init", "auth#twitter", "get"],
    [apiPath + "/auth/twitter/callback", "users#oauthPopup", "auth#init", "auth#cookieAuth", "auth#twitterCallback", "get"],
    [apiPath + "/auth/twitter", "users#unlinkTwitter", "auth#init", "auth#bearerAuth", "delete"],

    [apiPath + "/auth/google", "users#generateBearer", "auth#init", "auth#google", "get"],
    [apiPath + "/auth/google/callback", "users#oauthPopup", "auth#init", "auth#cookieAuth", "auth#googleCallback", "get"],
    [apiPath + "/auth/google", "users#unlinkGoogle", "auth#init", "auth#bearerAuth", "delete"],

    [apiPath + "/auth/token/validate", "users#validate", "auth#init", "auth#bearerAuth", "get"],
    [apiPath + "/auth/cookie", "users#generateLinkCookie", "auth#init", "auth#bearerAuth", "get"],

    [apiPath + "/students", "students#list", "auth#init", "get"],
    [apiPath + "/students", "students#create", "auth#init", "auth#isAdmin", "post"],
    [apiPath + "/students/:studentId", "students#find", "auth#init", "get"],
    [apiPath + "/students/:studentId", "students#update", "auth#init", "auth#isAdmin", "put"],
    [apiPath + "/students/:studentId", "students#delete", "auth#init", "auth#isAdmin", "delete"],

    [apiPath + "/courses", "courses#list", "auth#init", "get"],
    [apiPath + "/courses", "courses#create", "auth#init", "auth#isAdmin", "post"],
    [apiPath + "/courses/:courseId", "courses#find", "auth#init", "get"],
    [apiPath + "/courses/:courseId", "courses#update", "auth#init", "auth#isAdmin", "put"],
    [apiPath + "/courses/:courseId", "courses#delete", "auth#init", "auth#isAdmin", "delete"],

    [apiPath + "/courses/:courseId/students", "courses#getStudents", "auth#init", "get"],
    [apiPath + "/courses/:courseId/students/:studentId", "courses#findStudent", "auth#init", "get"],
    [apiPath + "/courses/:courseId/students/:studentId", "courses#expelStudent", "auth#init", "auth#isAdmin", "delete"],
    [apiPath + "/courses/:courseId/students/:studentId", "courses#addStudent", "auth#init", "auth#isAdmin", "post"],

    [apiPath + "/attributes", "attributes#list", "auth#init", "get"],
    [apiPath + "/attributes", "attributes#create", "auth#init", "auth#isAdmin", "post"],
    [apiPath + "/attributes/:attributeId", "attributes#find", "auth#init", "get"],
    [apiPath + "/attributes/:attributeId", "attributes#update", "auth#init", "auth#isAdmin", "put"],
    [apiPath + "/attributes/:attributeId", "attributes#delete", "auth#init", "auth#isAdmin", "delete"],

    
    [apiPath + "/games", "game#list", "auth#init", "auth#bearerAuth", "get"],
    [apiPath + "/games", "game#create", "auth#init", "auth#bearerAuth", "post"],
    [apiPath + "/games/:gameId", "game#find", "auth#init", "auth#bearerAuth", "get"],
    [apiPath + "/games/:gameId", "game#update", "auth#init", "auth#bearerAuth", "put"],
    [apiPath + "/games/:gameId", "game#delete", "auth#init", "auth#bearerAuth", "delete"],
    // [apiPath + "/games/:gameId/trimester", "game#listTrimesters", "auth#init", "get"],
    // [apiPath + "/games/:gameId/trimester", "game#createTrimester", "auth#init", "post"],
    // [apiPath + "/games/:gameId/trimester/:trimesterId", "game#getTrimester", "auth#init", "get"],
    // [apiPath + "/games/:gameId/trimester/:trimesterId", "game#updateTrimester", "auth#init", "put"],
    // [apiPath + "/games/:gameId/trimester/:trimesterId/students", "game#getStudents", "auth#init", "get"],
    // [apiPath + "/games/:gameId/trimester/:trimesterId/students", "game#updateStudents", "auth#init", "put"],
    // [apiPath + "/games/:gameId/trimester/:trimesterId/students/:id", "game#getStudent", "auth#init", "get"],
    // [apiPath + "/games/:gameId/trimester/:trimesterId/students/:id", "game#updateStudent", "auth#init", "put"]
    
  ];

  expressPath(app, routes, { verbose: (app.settings.env !== "development") });

  console.log("✔ Routes loaded");
};