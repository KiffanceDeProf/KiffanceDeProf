"use strict";

var Mustache = window.Mustache,
    crossroads = window.crossroads,
    hasher = window.hasher;

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
    this.loadRoutes();
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

  loadRoutes: function loadRoutes() {
    var self = this;
    crossroads.addRoute("/courses/{course_id}", function(courseId) {
      if(courseId === "none") {
        self.showStudents({ course: null });
        self.showCourses(null, {
          noCourse: true
        });
      }
      else {
        self.showStudents({ course: courseId });
        self.showCourses(null, {
          courseClass: function() {
            return (this._id === courseId) ? "active" : "";
          }
        });
      }
    });

    crossroads.addRoute("/", function() {
      self.showStudents();
      self.showCourses();
    });
  },

  initHasher: function initHasher() {
    hasher.initialized.add(this.parseHash);
    hasher.changed.add(this.parseHash);

    hasher.init();

    if(!hasher.getHash()){
      hasher.setHash("");
    }
  },

  parseHash: function parseHash(newHash, oldHash) {
    hasher.changed.active = false;
    hasher.replaceHash(newHash);
    hasher.changed.active = true;
    console.log("Hash [\"", oldHash, "\"] -> [\"", newHash, "\"]");

    crossroads.parse(newHash);
  },

  _update: function _update() {
    if(this.templates && this.courses && this.students) {
      this.showCourses();
      this.showStudents();
      this.initHasher();
    }
  },

  showCourses: function showCourses(filter, templateArgs) {
    filter = filter || {};
    templateArgs = templateArgs || {};
    templateArgs.courses = this.courses.filter(function(item) {
      for(var i in filter) {
        if(item.hasOwnProperty(i) && filter[i] === item[i]) {
          return false;
        }
      }

      return true;
    });

    this.nodes.coursesList.innerHTML = Mustache.to_html(this.templates.courses, templateArgs);
  },

  showStudents: function showStudents(filter, templateArgs) {
    filter = filter || {};
    templateArgs = templateArgs || {};
    templateArgs.students = this.students.filter(function(item) {
      for(var i in filter) {
        if(item.hasOwnProperty(i) && filter[i] !== item[i]) {
          return false;
        }
      }

      return true;
    });

    this.nodes.studentsList.innerHTML = Mustache.to_html(this.templates.students, templateArgs);
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
