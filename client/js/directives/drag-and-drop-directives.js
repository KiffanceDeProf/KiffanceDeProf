/**
 * Drag"n"drop directive
 */
"use strict";

// Allow access to dataTransfer attribute
jQuery.event.props.push("dataTransfer");

angular.module("k2pDirectives")
  .directive("kpDrag", ["$rootScope", "$parse", function($rootScope, $parse) {
  
  var dragStart = function(evt, element, dragStyle) {
    element.addClass(dragStyle);
    evt.dataTransfer.setData("id", evt.target.id);
    evt.dataTransfer.effectAllowed = "move";
  };

  var dragEnd = function(evt, element, dragStyle) {
    element.removeClass(dragStyle);
  };
  
  return {
    restrict: "A",
    link: function(scope, element, attrs)  {
      attrs.$set("draggable", "true");
      if(attrs.kpDragStyle) {
        scope.dragStyle = attrs.kpDragStyle;
      }
      element.bind("dragstart", function(evt) {
        $rootScope.draggedElement = $parse(attrs.kpDrag)(scope);
        dragStart(evt, element, scope.dragStyle);
      });
      element.bind("dragend", function(evt) {
        dragEnd(evt, element, scope.dragStyle);
      });
    }
  };
}]);


angular.module("k2pDirectives")
  .directive("kpDrop", ["$rootScope", "$parse", function($rootScope, $parse) {
  
  var dragEnter = function(evt, element, dropStyle) {
    evt.preventDefault();
    element.addClass(dropStyle);
  };
  var dragLeave = function(evt, element, dropStyle) {
    element.removeClass(dropStyle);
  };
  var dragOver = function(evt) {
    evt.preventDefault();
  };
  var drop = function(evt, element, dropStyle) {
    evt.preventDefault();
    element.removeClass(dropStyle);
  };
  
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      if(attrs.kpDropStyle) {
        scope.dropStyle = attrs.kpDropStyle;
      }
      element.bind("dragenter", function(evt) {
        dragEnter(evt, element, scope.dropStyle);
      });
      element.bind("dragleave", function(evt) {
        dragLeave(evt, element, scope.dropStyle);
      });
      element.bind("dragover", dragOver);
      element.bind("drop", function(evt) {
        drop(evt, element, scope.dropStyle);
        $rootScope.$broadcast("dropEvent", $rootScope.draggedElement, $parse(attrs.kpDrop)(scope));
      });
    }
  };
}]);