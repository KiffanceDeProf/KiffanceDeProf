"use strict";

angular.module("k2pControllers")
  .controller("ClassroomCtrl", ["$scope", "$route", "Courses", function classroomCtrl($scope, $route, Courses) {
    $scope.classroom = [
      [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ],
      [ {heater: true}, {table: true}, {table: true}, {}, {table: true}, {table: true}, {}, {table: true}, {table: true}, {window: true} ],
      [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ],
      [ {}, {table: true}, {table: true}, {}, {table: true}, {table: true}, {}, {table: true}, {table: true}, {} ],
      [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ],
      [ {heater: true}, {table: true}, {table: true}, {}, {table: true}, {table: true}, {}, {table: true}, {table: true}, {window: true} ],
      [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ],
      [ {}, {table: true}, {table: true}, {}, {table: true}, {table: true}, {}, {table: true}, {table: true}, {} ],
      [ {door: true}, {}, {}, {}, {}, {}, {}, {}, {}, {} ],
      [ {}, {table: true}, {table: true}, {}, {table: true}, {table: true}, {}, {table: true}, {table: true}, {window: true} ],
      [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ],
      [ {}, {}, {teacherDesk: true}, {teacherDesk: true}, {}, {}, {}, {}, {}, {} ],
      [ {}, {}, {}, {}, {blackboard: true}, {blackboard: true}, {}, {}, {}, {} ]
    ];

    for(var i in $scope.students) {
      if($scope.students[i].coord) {
        var c = $scope.students[i].coord;
        $scope.classroom[c[0]][c[1]].student = i;
      }
    }

    $scope.selectItem = function selectItem(row, col) {
      $scope.selectedItem = $scope.classroom[row][col];
      $scope.selectedItem.coord = [row, col];
      $scope.selectStudent($scope.classroom[row][col].student);
    };

    $scope.selectStudent = function selectStudent(studentId) {
      $scope.selectedStudent = studentId;
    };

    $scope.formatStudentName = function formatStudentName(student) {
      if(typeof student === "number") { student = $scope.students[student]; }
      if(!student || !student.name || !student.name.first || !student.name.last) { return; }
      return student.name.first + " " + student.name.last.substring(0,1) + ".";
    };

    $scope.$on("dropEvent", function drop(evt, studentId, dropCoord) {
      $scope.$apply(function() {
        for(var i in $scope.classroom) {
          var r = $scope.classroom[i];
          for(var j in r) {
            if(r[j].student === studentId) {
              $scope.classroom[i][j].student = undefined;
            }
          }
        }

        if(dropCoord === null) {
          $scope.students[studentId].coord = undefined;
          return;
        }
        else if($scope.classroom[dropCoord[0]][dropCoord[1]].student !== undefined) {
          $scope.students[$scope.classroom[dropCoord[0]][dropCoord[1]].student].coord = undefined;
        }

        if($scope.classroom[dropCoord[0]][dropCoord[1]].table) {
          $scope.classroom[dropCoord[0]][dropCoord[1]].student = studentId;
          $scope.students[studentId].coord = dropCoord;
        }
        else {
          $scope.students[studentId].coord = undefined;
        }
      });
    });

    $scope.students = Courses.getStudents({ courseId: $route.current.params.courseId });
  }]);
