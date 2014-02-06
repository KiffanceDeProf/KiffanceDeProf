"use strict";

var Mustache = window.Mustache;

var templates = {
  students: "{{#students}}<tr data-id=\"{{_id}}\"> <td>{{_id}}</td> <td>{{name.last}}, {{name.first}}</td> <td>{{description}}</td> <td>{{course}}</td> </tr> {{/students}}",
  courses: "{{#courses}}<tr data-id=\"{{_id}}\"> <td>{{_id}}</td> <td>{{name}},</td> <td>{{description}}</td> <td>{{type}}ème</td> </tr> {{/courses}}"
};

function getCourses() {
  var request = new XMLHttpRequest();
  request.open("GET", "/api/courses/", true);

  request.onreadystatechange = function() {
    if (this.readyState === 4){
      if (this.status >= 200 && this.status < 400){
        // Success!        
        var ret = JSON.parse(this.responseText);
        var list = document.getElementById("listCourses");
        list.innerHTML = Mustache.to_html(templates.courses, { courses: ret });
      } else {
        // Error :(
      }
    }
  };

  var data = {"Authorization" : "Basic cm9vdDphbHBpbmU="};

  request.send(data);
  request = null;
}

function getStudents() {
  var request = new XMLHttpRequest();
  request.open("GET", "/api/students/", true);

  request.onreadystatechange = function() {
    if (this.readyState === 4){
      if (this.status >= 200 && this.status < 400){
        // Success!        
        var ret = JSON.parse(this.responseText);
        var list = document.getElementById("listStudents");
        list.innerHTML = Mustache.to_html(templates.students, { students: ret });
      } else {
        // Error :(
      }
    }
  };

  var data = {"Authorization" : "Basic cm9vdDphbHBpbmU="};

  request.send(data);
  request = null;
}


(function() {
	getCourses();
	getStudents();
})();

