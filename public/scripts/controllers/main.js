'use strict';

angular.module('TodoApp').controller('MainCtrl', function ($scope, Restangular, $filter) {
  $scope.sorted_column = 'priority'
  $scope.sorted_direction = 'desc'
  $scope.show_completed = false

  $scope.refresh = function(){
    Restangular.all('todo_items').getList({'sort': $scope.sorted_column, 'direction': $scope.sorted_direction, 'show_completed': $scope.show_completed}).then(function(todo_items) {
      $scope.todoItems = todo_items;
    })
    if (!$scope.show_completed) {
      Restangular.all('completed_todo_items').getList().then(function(completed_todo_items) {
        $scope.completedTodoItems = completed_todo_items;
      })
    } else {
      $scope.completedTodoItems = []
    }
  }

  $scope.create = function(todo_item){
  	$scope.todoItems.post(todo_item).then(function(ti){
      $scope.todoItems.push(ti);
    });
    document.getElementById('new_item').reset();
  }

  $scope.sortBy = function(col){
    if ($scope.sorted_column == col) {
      $scope.sorted_direction = $scope.sorted_direction == 'desc' ? 'asc' : 'desc'
    } else {
      $scope.sorted_column = col;
    }
    $scope.refresh();
  }

  $scope.toggleShowCompleted = function(b){
    $scope.show_completed = !b
    $scope.refresh();
  }

  $scope.refresh();
});