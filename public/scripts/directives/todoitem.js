'use strict';

angular.module('TodoApp').directive('todoItem', function (Restangular) {
  return {
    template: "<div class='item'><form class='{{ item.completed ? "+'"completed"'+" : overdue ? "+'"overdue"'+" : "+'""'+"}}'> \
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
    link: function (scope, elem, attrs, $filter) {
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
        })
      }

      scope.delete = function(item) {
        if (confirm("Are you sure you want to delete this Todo Item?")) {
          item.remove().then(function(){
            console.log(scope.item)
            scope.$parent.todoItems = _.without(scope.$parent.todoItems, scope.item);
            scope.$parent.refresh(scope.$parent.todoItems);
          })
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
      })

      var t = new Date(scope.item.due_date);
      scope.item.due_date = t.getFullYear() + '-' + ((t.getMonth()+1).toString(10).length > 1 ? t.getMonth()+1 : '0'+(t.getMonth()+1).toString(10)) + '-' + ((t.getDate()+1).toString(10).length > 1 ? t.getDate()+1 : '0'+(t.getDate()+1).toString(10));
      scope.overdue  = (new Date(scope.item.due_date).getTime() < new Date().getTime())
    }
  };
});