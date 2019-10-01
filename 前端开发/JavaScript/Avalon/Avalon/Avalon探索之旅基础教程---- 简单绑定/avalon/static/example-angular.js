angular.module('todoApp',[])
.controller('todos',['$scope',function  ($scope) {
	$scope.todolist = [];
	$scope.add = function  () {
		$scope.todolist.push($scope.txt);
		$scope.txt = '';
	}
}]);