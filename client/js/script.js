"use strict";

var Mustache = window.Mustache;

// var templates = {
//   students: document.getElementById("templateStudents").innerHTML,
//   courses: document.getElementById("templateCourses").innerHTML
// };

var authHeader = "Basic cm9vdDphbHBpbmU=";

function getCourses(coursesTemplate) {
  var request = new XMLHttpRequest();
  request.open("GET", "/api/courses/", true);

  request.onload = function() {
    if (this.status === 200){
      // Success!        
      var ret = JSON.parse(this.responseText);
      var list = document.getElementById("listCourses");
      list.innerHTML = Mustache.to_html(coursesTemplate, { courses: ret });
    } else {
      // Error :(
    }
  };

  request.setRequestHeader("Authorization", authHeader);
  request.send();
  request = null;
}

function getStudents(studentsTemplate) {
  var request = new XMLHttpRequest();
  request.open("GET", "/api/students/", true);

  request.onload = function() {
    if (this.status === 200){
      // Success!
      var ret = JSON.parse(this.responseText);
      var list = document.getElementById("listStudents");
      list.innerHTML = Mustache.to_html(studentsTemplate, { students: ret });
    } else {
      // Error :(
    }
  };

  request.setRequestHeader("Authorization", authHeader);
  request.send();
  request = null;
}

function loadTemplate(templatePath, callback) {
  var request = new XMLHttpRequest();
  request.open("GET", "/templates/" + templatePath + ".hgn", true);
  request.onload = function() {
    if(this.status === 200) {
      callback(null, this.responseText);
    }
    else {
      callback(new Error("XHR Error"), null);
    }
  };

  request.onerror = function() {
    callback(new Error("XHR Error"), null);
  };

  request.send();
}

function loadTemplates(templates, cb) {
  var loadedTemplates = {},
      loadCb = function(templateName, err, templateContent) {
      loadedTemplates[templateName] = templateContent;
      if(Object.keys(loadedTemplates).length === Object.keys(templates).length) {
        cb(loadedTemplates);
      }
    };
  for(var i in templates) {
    loadTemplate(templates[i], loadCb.bind(null, i));
  }
}

(function() {
  loadTemplates({
    students: "admin/students",
    courses: "admin/courses"
  }, function(templates) {
    console.log(templates);
    getCourses(templates.courses);
    getStudents(templates.students);
  });
})();

