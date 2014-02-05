"use strict";

function getCourses() {
  var request = new XMLHttpRequest();
  request.open("GET", "/api/courses/", true);

  request.onreadystatechange = function() {
    if (this.readyState === 4){
      if (this.status >= 200 && this.status < 400){
        // Success!        
        var ret = JSON.parse(this.responseText);
        var list = document.getElementById("listCourses");
        var content = "";
        for (var i = 0; i < ret.length; i++) {
          content += "<li data-id=\""+ ret[i]._id +"\" class=\"courses\">"+ ret[i].name + "</li>";
        }
        list.innerHTML = content;
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
        var content = "";
        for (var i = 0; i < ret.length; i++) {
          content += "<li data-id=\""+ ret[i]._id +"\" class=\"students\">" + ret[i].name.first + " " + ret[i].name.last + "</li>";
        }
        list.innerHTML = content;
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

