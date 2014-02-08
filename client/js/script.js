"use strict";

var Mustache = window.Mustache;

var authHeader = "Basic cm9vdDphbHBpbmU=";

var Admin = function() {};

Admin.prototype = {
  setup: function() {
    this.loadTemplates({
      students: "admin/students",
      courses: "admin/courses"
    });
    this.loadCourses();
    this.loadStudents();
    this.loadDOM();
  },

  ajax: function ajax(method, url, callback) {
    var request = new XMLHttpRequest();
    request.open(method, url, true);
    request.addEventListener("load", function() {
      if(this.status === 200) {
        callback.call(this, null, this.responseText);
      }
      else {
        callback.call(this, new Error("XHR Failed"), this.responseText);
      }
    });

    request.addEventListener("error", function() {
      callback.call(this, new Error("XHR Error"), null);
    });

    request.setRequestHeader("Authorization", authHeader);
    return request;
  },

  _update: function _update() {
    if(this.templates && this.courses && this.students) {
      this.showView();
    }
  },

  showView: function showView() {
    this.nodes.coursesList.innerHTML = Mustache.to_html(this.templates.courses, { courses: this.courses });
    this.nodes.studentsList.innerHTML = Mustache.to_html(this.templates.students, { students: this.students });
  },

  loadCourses: function loadCourses() {
    var self = this;
    this.ajax("GET", "/api/courses/", function(err, res) {
      if(err) {
        throw err;
      }

      self.courses = JSON.parse(res);
      self._update();
    }).send();
  },

  loadStudents: function loadStudents() {
    var self = this;
    this.ajax("GET", "/api/students/", function(err, res) {
      if(err) {
        throw err;
      }

      self.students = JSON.parse(res);
      self._update();
    }).send();
  },

  loadTemplates: function loadTemplates(templates) {
    var loadedTemplates = {};
    var callback = function(templateName, err, templateContent) {
      if(err) {
        throw err;
      }

      loadedTemplates[templateName] = templateContent;

      if(Object.keys(loadedTemplates).length === Object.keys(templates).length) {
        this.templates = loadedTemplates;
        this._update();
      }
    };

    for(var i in templates) {
      this.ajax("GET", "/templates/" + templates[i] + ".hgn", callback.bind(this, i)).send();
    }
  },

  loadDOM: function loadDOM() {
    this.nodes = {
      coursesList: document.getElementById("listCourses"),
      studentsList: document.getElementById("listStudents")
    };
  }
};

var admin = new Admin();

document.addEventListener("DOMContentLoaded", function() {
  admin.setup();
});
