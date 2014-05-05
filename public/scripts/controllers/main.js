'use strict';

angular.module('TodoApp').controller('MainCtrl', function ($scope, Restangular, $filter) {
  $scope.sorted_column = 'priority';
  $scope.sorted_direction = '-';
  $scope.show_completed = false;
  $scope.css_class = function(){ return 'current '+($scope.sorted_direction=='+'?'asc':'desc'); }

  $scope.refresh = function(t){
    if (!t){ t = $scope.todoItems }
    $scope.todoItems = $filter('orderBy')(t, $scope.sorted_direction+$scope.sorted_column);
  }

  $scope.init = function(){
    Restangular.all('todo_items').getList().then(function(todo_items) {
      $scope.rTodoItems = todo_items;
      $scope.refresh($scope.rTodoItems);
    });
  }

  $scope.create = function(todo_item){
  	$scope.rTodoItems.post(todo_item).then(function(ti){
      $scope.todoItems.push(ti);
      $scope.refresh();
    });

    document.getElementById('new_item').reset();
    todo_item = {};
  }

  $scope.sortBy = function(col){
    if ($scope.sorted_column == col) {
      $scope.sorted_direction = $scope.sorted_direction == '+' ? '-' : '+';
    } else {
      $scope.sorted_column = col;
    }

    $scope.refresh();
  }

  $scope.toggleShowCompleted = function(b){
    $scope.show_completed = !b;
  }

  $scope.items = function(){
    if (!$scope.show_completed) {
      return $filter('isCompleted')($scope.todoItems, false);
    } else {
      return $scope.todoItems;
    }
  }

  $scope.completed = function(){
    if (!$scope.show_completed) {
      return $filter('isCompleted')($scope.todoItems, true);
    } else {
      return [];
    }
  }

  $scope.init();
});