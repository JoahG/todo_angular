//= require jquery
//= require_tree .

var TodoApp = angular.module('TodoApp', ['restangular']);

TodoApp.config(function(RestangularProvider){
	RestangularProvider.setBaseUrl('/api/v1');
	RestangularProvider.setDefaultRequestParams({ 'user_email': document.getElementById('user_email').innerHTML, 'auth_token':document.getElementById('user_auth_token').innerHTML});
});

TodoApp.controller('NewItem', ['$scope', 'Restangular', function ($scope, Restangular) {
	$scope.items = Restangular.all('todo_items');

	$scope.create = function(todo_item){
		$scope.items.post(todo_item);
		document.getElementById('new_item').reset();
		$("#refresh").click();
	}
}]);

TodoApp.controller('ListItems', ['$scope', 'Restangular', function ($scope, Restangular) {
	$scope.items = Restangular.all('todo_items');
	$scope.sorted_column = 'priority'
	$scope.sorted_direction = 'desc'
	$scope.show_completed = false

	$scope.refreshItems = function(){
		Restangular.all('todo_items').getList({'sort': $scope.sorted_column, 'direction': $scope.sorted_direction, 'show_completed': $scope.show_completed}).then(function(todo_items) {
			$scope.todo_items = todo_items;
		})
		if (!$scope.show_completed) {
			Restangular.all('completed_todo_items').getList().then(function(completed_todo_items) {
				$scope.completed_todo_items = completed_todo_items;
			})
		} else {
			$scope.completed_todo_items = []
		}
	}

	$scope.sortBy = function(col){
		if ($scope.sorted_column == col) {
			$scope.sorted_direction = $scope.sorted_direction == 'desc' ? 'asc' : 'desc'
		} else {
			$scope.sorted_column = col;
		}
		$scope.refreshItems();
	}

	$scope.toggleShowCompleted = function(b){
		$scope.show_completed = !b
		$scope.refreshItems();
	}

	$("#refresh").click(function(){$scope.refreshItems();})

	$scope.refreshItems();
}]);

TodoApp.controller('EditItem', ['$scope', 'Restangular', function ($scope, Restangular) {
	t = new Date($scope.item.due_date)
	$scope.overdue = t < new Date();
	$scope.item.due_date = t.getFullYear() + '-' + ((t.getMonth()+1).toString(10).length > 1 ? t.getMonth()+1 : '0'+(t.getMonth()+1).toString(10)) + '-' + ((t.getDate()+1).toString(10).length > 1 ? t.getDate()+1 : '0'+(t.getDate()+1).toString(10));
	$scope.save = function($event, b) {
		if ($event.keyCode > 0 && $event.keyCode == 13 || $event.keyCode == 0) {
			$scope.item.completed = b ? !$scope.item.completed : $scope.item.completed;
			$scope.item.put();
			$("#refresh").click();
		} 
	}

	$scope.delete = function() {
		$scope.item.remove();
		$("#refresh").click();
	}
}])

$(document).ready(function(){
	$(document).on("click", "li:not(.completed) form.edit_todo_item div > div", function(){
		if ($('.focus').length == 0) {
			$(this).hide().prev("input[disabled]").prop("disabled", false).addClass("focus").focus();
		} else {
			$("#refresh").click();
			$('.focus').prop("disabled", true).next("div").show();
			$('.focus').removeClass("focus");
		}
	})
	$(document).on('click', '.ngApp a', function(e){
		e.preventDefault();
	})
})