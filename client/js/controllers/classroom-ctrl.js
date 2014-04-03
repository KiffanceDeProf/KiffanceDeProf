"use strict";

angular.module("k2pControllers")
  .controller("ClassroomCtrl", function ($scope) {
    $scope.classroom = {
      content: [ //{table: true} = table; {} = vide
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
        [ {}, {}, {table: true}, {table: true}, {}, {}, {}, {}, {}, {} ],
        [ {}, {}, {}, {}, {blackboard: true}, {blackboard: true}, {}, {}, {}, {} ]
      ],
      selectedItem: null
    };

    $scope.students = [
      { name: "Student 1", coord: [3, 2] },
      { name: "Student 2", coord: [9, 4] },
      { name: "Student 3", coord: [9, 5] },
      { name: "Student 4", coord: [9, 1] },
      { name: "Student 5", coord: [1, 5] },
      { name: "Student 6" },
      { name: "Student 7" },
      { name: "Student 8" },
      { name: "Student 9" }
    ];

    for(var i in $scope.students) {
      if($scope.students[i].coord) {
        var c = $scope.students[i].coord;
        $scope.classroom.content[c[0]][c[1]].student = i;
      }
    }

    $scope.selectItem = function(row, col) {
      $scope.classroom.selectedItem = $scope.classroom.content[row][col];
      $scope.classroom.selectedItem.coord = [row, col];
    };

    $scope.$on("dropEvent", function(evt, studentId, dropCoord) {
      $scope.$apply(function() {
        for(var i in $scope.classroom.content) {
          var r = $scope.classroom.content[i];
          for(var j in r) {
            if(r[j].student === studentId) {
              $scope.classroom.content[i][j].student = undefined;
            }
          }
        }

        if(dropCoord === null) {
          $scope.students[studentId].coord = undefined;
          return;
        }
        else if($scope.classroom.content[dropCoord[0]][dropCoord[1]].student) {
          $scope.students[$scope.classroom.content[dropCoord[0]][dropCoord[1]].student].coord = undefined;
        }

        $scope.classroom.content[dropCoord[0]][dropCoord[1]].student = studentId;
        $scope.students[studentId].coord = dropCoord;
      });
    });
  });
