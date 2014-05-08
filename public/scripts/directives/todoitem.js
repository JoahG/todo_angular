'use strict';

angular.module('TodoApp').directive('todoItem', function (Restangular, $filter) {
  return {
    template: "<div class='item'><form ng-class='{ completed: item.completed, overdue: !item.completed && overdue }'> \
                  <input type='text' data-ng-model='item.title' required> \
                  <input type='text' data-ng-model='item.due_date' required> \
                  <input type='number' data-ng-model='item.priority' required> \
                  <input type='checkbox' data-ng-model='item.completed'> \
              </form><a class='delete' ng-click='delete(item)'>Delete</a></div>",
    replace: true,
    restrict: 'EA',
    scope: {
      item: '=todoItem'
    },
    link: function (scope, elem, attrs) {
      scope.refresh = function(todo_item) {
        if (!todo_item) {
          Restangular.one('todo_items', scope.item.id).get().then(function(item){
            scope.$parent.todoItems = _.without(scope.$parent.todoItems, scope.item);
            scope.$parent.todoItems.push(item);
            scope.$parent.refresh(scope.$parent.todoItems);
          });
        } else {
          scope.$parent.todoItems = _.without(scope.$parent.todoItems, scope.item);
          scope.$parent.todoItems.push(todo_item);
          scope.$parent.refresh(scope.$parent.todoItems);
        }
      }

      scope.update = function(){
        scope.item.put().then(function(item){
          scope.refresh(item);
        }, function(res) {
          alert("An error occured when updating the Todo Item. Please check all fields and try again.");
          scope.refresh(false);
        });
      }

      scope.delete = function(item) {
        if (confirm("Are you sure you want to delete this Todo Item?")) {
          item.remove().then(function(){
            scope.$parent.todoItems = _.without(scope.$parent.todoItems, scope.item);
            scope.$parent.refresh(scope.$parent.todoItems);
          }, function() {
            alert('Todo Item does not exist.')
            scope.$parent.todoItems = _.without(scope.$parent.todoItems, scope.item);
            scope.$parent.refresh(scope.$parent.todoItems);
          });
        }
      }

      elem.find('input[type="text"], input[type="number"]').bind({
        blur: function(){
          scope.update();
        },
        keypress: function(e){
          if (e.keyCode == 13) {
            scope.update();
          }
        }
      });

      $(elem).find('input[type="checkbox"]').bind('click', function(e){
        scope.update();
      });

      scope.item.due_date = $filter('date')(scope.item.due_date, 'yyyy-MM-dd')
      scope.overdue  = (new Date(scope.item.due_date).getTime() < new Date().getTime());
    }
  };
});