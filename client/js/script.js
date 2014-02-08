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
      courses: "admin/courses",
      studentForm: "admin/student_form",
      courseForm: "admin/course_form",
      coursesSelect: "admin/courses_select"
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
        self.selectStudent();
        self.selectCourse("none");
        self.updateView();
      }
      else {
        self.selectStudent();
        self.selectCourse(courseId);
        self.updateView();
      }
    });

    crossroads.addRoute("/students/{students_id}", function(studentId) {
      if(!self.selectStudent(studentId)) {
        hasher.setHash("");
      }
      self.updateView();
    });

    crossroads.addRoute("/", function() {
      self.selectStudent(null);
      self.selectCourse(null);
      self.updateView();
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
      this.showStudentEditor();
      this.initHasher();
    }
  },

  selectStudent: function selectStudent(id) {
    var student = null;
    for(var i in this.students) {
      if(this.students[i]._id === id) {
        student = this.students[i];
        break;
      }
    }

    this.activeStudent = student;

    if(this.activeStudent) {
      this.selectCourse(this.activeStudent.course);
    }

    return this.activeStudent;
  },

  selectCourse: function selectCourse(id) {
    var course = null;
    for(var i in this.courses) {
      if(this.courses[i]._id === id) {
        course = this.courses[i];
        break;
      }
    }

    if(id === "none") {
      course = "none";
    }

    this.activeCourse = course;
    return this.activeCourse;
  },

  updateView: function updateView() {
    var self = this;
    this.showCourseEditor(this.activeCourse);
    this.showStudentEditor(this.activeStudent);
    if(this.activeCourse) {
      this.showStudents({
        course: (this.activeCourse === "none") ? null : this.activeCourse._id
      }, {
        studentClass: function() {
          return (self.activeStudent && this._id === self.activeStudent._id) ? "active" : "";
        }
      });
      this.showCourses(null, {
        noCourse: this.activeCourse === "none",
        courseClass: function() {
          return (self.activeCourse !== "none" && this._id === self.activeCourse._id) ? "active" : "";
        }
      });
    }
    else {
      this.showStudents();
      this.showCourses();
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

  showStudentEditor: function showStudentEditor(student) {
    this.nodes.studentEditor.innerHTML = Mustache.to_html(this.templates.studentForm, {
      student: student,
      courses: this.courses,
      courseSelected: function() {
        return (student && this._id === student.course) ? "selected" : null;
      },
      fullName: function() {
        return this.name.first + " " + this.name.last;
      }
    }, {
      coursesSelect: this.templates.coursesSelect
    });
  },

  showCourseEditor: function showStudentEditor(course) {
    this.nodes.courseEditor.innerHTML = Mustache.to_html(this.templates.courseForm, {
      course: course,
      coursesTypes: [6, 5, 4, 3],
      courseSelected: function() {
        return (course && this === course.type) ? "selected" : "";
      }
    });
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
      studentsList: document.getElementById("listStudents"),
      studentEditor: document.getElementById("studentEditor"),
      courseEditor: document.getElementById("courseEditor")
    };
  }
};

var admin = new Admin();

document.addEventListener("DOMContentLoaded", function() {
  admin.setup();
});
