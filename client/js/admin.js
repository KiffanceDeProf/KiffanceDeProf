"use strict";

var Mustache = window.Mustache,
    crossroads = window.crossroads,
    hasher = window.hasher;

var authHeader = "Basic cm9vdDphbHBpbmU=";

var Admin = function() {};

Admin.prototype = {
  /** 
   * Init the admin interface
   */
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

  /**
   * Util function for AJAX requests
   */
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
    if(["POST", "PUT"].indexOf(method) !== -1) {
      request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    return request;
  },

  /**
   * Defines routes for crossroads.js
   */
  loadRoutes: function loadRoutes() {
    var self = this;
    crossroads.addRoute("/courses/{course_id}", function(courseId) {
      self.selectStudent();
      self.selectCourse(courseId);
      self.updateView();
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

  /**
   * Init Hasher
   */
  initHasher: function initHasher() {
    hasher.initialized.add(this.parseHash);
    hasher.changed.add(this.parseHash);

    hasher.init();

    if(!hasher.getHash()){
      hasher.setHash("");
    }
  },

  /**
   * Handle Hash changes
   */
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

  /**
   * Select a Student
   */
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
      this.selectCourse(this.activeStudent.course || "none");
    }

    return this.activeStudent;
  },

  /**
   * Select a course
   */
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

  /**
   * Update the view
   */
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

  /**
   * Shows Courses table
   */
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

  /**
   * Shows Students table
   */
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

  /**
   * Shows Students editor
   */
  showStudentEditor: function showStudentEditor(student) {
    var self = this;
    this.nodes.studentEditor.innerHTML = Mustache.to_html(this.templates.studentForm, {
      student: student,
      courses: this.courses,
      courseSelected: function() {
        return (student && this._id === student.course) ? "selected" : null;
      },
      fullName: function() {
        return this.student ? this.student.name.first + " " + this.student.name.last : "";
      }
    }, {
      coursesSelect: this.templates.coursesSelect
    });

    var createBtn = document.getElementById("studentCreate");
    var updateBtn = document.getElementById("studentUpdate");
    var deleteBtn = document.getElementById("studentDelete");

    if(createBtn) {
      createBtn.addEventListener("click", function(e) {
        e.preventDefault();
        var data = self.getStudentForm();
        self.createStudent(data);
      });
    }

    if(updateBtn) {
      updateBtn.addEventListener("click", function(e) {
        e.preventDefault();
        var data = self.getStudentForm();
        self.updateStudent(student._id, data);
      });
    }

    if(deleteBtn) {
      deleteBtn.addEventListener("click", function(e) {
        e.preventDefault();
        self.deleteStudent(student._id);
      });
    }
  },

  /**
   * Shows Course editor
   */
  showCourseEditor: function showStudentEditor(course) {
    var self = this;
    this.nodes.courseEditor.innerHTML = Mustache.to_html(this.templates.courseForm, {
      course: (course === "none") ? null : course,
      coursesTypes: [6, 5, 4, 3],
      courseSelected: function() {
        return (course && this === course.type) ? "selected" : "";
      }
    });

    var createBtn = document.getElementById("courseCreate");
    var updateBtn = document.getElementById("courseUpdate");
    var deleteBtn = document.getElementById("courseDelete");

    if(createBtn) {
      createBtn.addEventListener("click", function(e) {
        e.preventDefault();
        var data = self.getCourseForm();
        self.createCourse(data);
      });
    }

    if(updateBtn) {
      updateBtn.addEventListener("click", function(e) {
        e.preventDefault();
        var data = self.getCourseForm();
        self.updateCourse(course._id, data);
      });
    }

    if(deleteBtn) {
      deleteBtn.addEventListener("click", function(e) {
        e.preventDefault();
        self.deleteCourse(course._id);
      });
    }
  },

  /**
   * Util to convert object to query string
   */
  _toQueryString: function(data) {
    var result = "";
    for(var key in data) {
      result += key + "=" + encodeURIComponent(data[key]) + "&";
    }
    result = result.slice(0, result.length - 1);
    return result;
  },

  /**
   * Create Student
   */
  createStudent: function(studentData) {
    var self = this;
    this.ajax("POST", "/api/students", function(err, response) {
      if(err) {
        throw err;
      }

      var newStudent = JSON.parse(response);
      console.log("Student created", newStudent);
      self.students.push(newStudent);
      self.selectStudent(newStudent._id);
      self.updateView();
    }).send(this._toQueryString(studentData));
  },

  /**
   * Create Course
   */
  createCourse: function(courseData) {
    var self = this;
    this.ajax("POST", "/api/courses", function(err, response) {
      if(err) {
        throw err;
      }

      var newCourse = JSON.parse(response);
      console.log("Course created", newCourse);
      self.courses.push(newCourse);
      self.selectCourse(newCourse._id);
      self.updateView();
    }).send(this._toQueryString(courseData));
  },

  /**
   * Update Student
   */
  updateStudent: function(id, studentData) {
    var self = this;
    this.ajax("PUT", "/api/students/" + id, function(err, response) {
      if(err) {
        throw err;
      }

      var updatedStudent = JSON.parse(response);
      console.log("Student updated", updatedStudent);
      for(var i in self.students) {
        if(self.students[i]._id === id) {
          self.students[i] = updatedStudent;
          break;
        }
      }
      self.selectStudent(id);
      self.updateView();
    }).send(this._toQueryString(studentData));
  },

  /**
   * Update Course
   */
  updateCourse: function(id, courseData) {
    var self = this;
    this.ajax("PUT", "/api/courses/" + id, function(err, response) {
      if(err) {
        throw err;
      }

      var updatedCourse = JSON.parse(response);
      console.log("Course updated", updatedCourse);
      for(var i in self.courses) {
        if(self.courses[i]._id === id) {
          self.courses[i] = updatedCourse;
          break;
        }
      }
      self.selectCourse(id);
      self.updateView();
    }).send(this._toQueryString(courseData));
  },

  /**
   * Delete Student
   */
  deleteStudent: function(id) {
    var self = this;
    this.ajax("DELETE", "/api/students/" + id, function(err, response) {
      if(err) {
        throw err;
      }

      console.log("Student deleted", JSON.parse(response));
      for(var i in self.students) {
        if(self.students[i]._id === id) {
          self.students.splice(i, 1);
          break;
        }
      }
      self.selectStudent(null);
      self.updateView();
    }).send();
  },

  /**
   * Delete Course
   */
  deleteCourse: function(id) {
    var self = this;
    this.ajax("DELETE", "/api/courses/" + id, function(err, response) {
      if(err) {
        throw err;
      }

      console.log("Course deleted", JSON.parse(response));
      for(var i in self.courses) {
        if(self.courses[i]._id === id) {
          self.courses.splice(i, 1);
          break;
        }
      }

      for(var j in self.students) {
        if(self.students[j].course === id) {
          self.students[j].course = null;
        }
      }

      self.selectCourse(null);
      self.updateView();
    }).send();
  },

  /** 
   * Loads courses from API
   */
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

  /**
   * Loads students from API
   */
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

  /**
   * Loads all the Mustache templates
   */
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

  /**
   * Save some DOM nodes in a var
   */
  loadDOM: function loadDOM() {
    this.nodes = {
      coursesList: document.getElementById("listCourses"),
      studentsList: document.getElementById("listStudents"),
      studentEditor: document.getElementById("studentEditor"),
      courseEditor: document.getElementById("courseEditor")
    };
  },

  /**
   * Get form datas
   */
  getStudentForm: function getStudentForm() {
    return {
      fullName: document.getElementById("studentName").value,
      description: document.getElementById("studentDescription").value,
      course: document.getElementById("studentCourse").value
    };
  },

  getCourseForm: function getCourseForm() {
    return {
      name: document.getElementById("courseName").value,
      description: document.getElementById("courseDescription").value,
      type: document.getElementById("courseType").value
    };
  }
};

var admin = new Admin();

document.addEventListener("DOMContentLoaded", function() {
  admin.setup();
});
