angular.module('TodoApp').filter('isCompleted', function(){
	return function(items, b) {
		var _items = [];
		angular.forEach(items, function(item) {
			if (item.completed == b) {
				_items.push(item);
			}
		});
		return _items;
	}
});