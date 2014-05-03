'use strict';

angular.module('TodoApp').directive('todoItem', function () {
  return {
    template: "<div><form class='{{ item.completed ? "+'"completed"'+" : overdue ? "+'"overdue"'+" : "+'""'+"}}'> \
                  <input type='text' data-ng-model='item.title'> \
                  <input type='text' data-ng-model='item.due_date'> \
                  <input type='number' data-ng-model='item.priority'> \
                  <input type='checkbox' data-ng-model='item.completed'> \
              </form><a href='#!' class='delete'>Delete</a></div>",
    replace: true,
    restrict: 'EA',
    scope: {
      item: '=todoItem'
    },
    link: function (scope, elem, attrs, $filter) {
      scope.update = function(){
        scope.item.put();
        scope.$parent.refresh();
      }

      $(elem).find('a').bind('click', function() {
        if (confirm("Are you sure you want to delete this Todo Item?")){
          scope.item.remove();
        }
      })

      $(elem).find('input[type=text], input[type=number]').bind({
        blur: function(){
          scope.update();
        },
        keypress: function(e){
          if (e.keyCode == 13) {
            scope.update();
          }
        }
      });

      $(elem).find('input[type=checkbox]').bind('click', function(e){
        scope.update();
      })



      var t = new Date(scope.item.due_date);
      scope.item.due_date = t.getFullYear() + '-' + ((t.getMonth()+1).toString(10).length > 1 ? t.getMonth()+1 : '0'+(t.getMonth()+1).toString(10)) + '-' + ((t.getDate()+1).toString(10).length > 1 ? t.getDate()+1 : '0'+(t.getDate()+1).toString(10));
      scope.overdue  = (new Date(scope.item.due_date).getTime() < new Date().getTime())
    }
  };
});