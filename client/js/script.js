"use strict";

var Mustache = window.Mustache;

var templates = {
  students: document.getElementById("templateStudents").innerHTML,
  courses: document.getElementById("templateCourses").innerHTML
};

var authHeader = "Basic cm9vdDphbHBpbmU=";

function getCourses() {
  var request = new XMLHttpRequest();
  request.open("GET", "/api/courses/", true);

  request.onload = function() {
    if (this.status === 200){
      // Success!        
      var ret = JSON.parse(this.responseText);
      var list = document.getElementById("listCourses");
      list.innerHTML = Mustache.to_html(templates.courses, { courses: ret });
    } else {
      // Error :(
    }
  };

  request.setRequestHeader("Authorization", authHeader);
  request.send();
  request = null;
}

function getStudents() {
  var request = new XMLHttpRequest();
  request.open("GET", "/api/students/", true);

  request.onload = function() {
    if (this.status === 200){
      // Success!
      var ret = JSON.parse(this.responseText);
      var list = document.getElementById("listStudents");
      list.innerHTML = Mustache.to_html(templates.students, { students: ret });
    } else {
      // Error :(
    }
  };

  request.setRequestHeader("Authorization", authHeader);
  request.send();
  request = null;
}


(function() {
	getCourses();
	getStudents();
})();

