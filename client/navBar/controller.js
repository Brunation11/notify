var app = angular.module('notify');

app.controller('navController', ['$scope', 'authService', function($scope, authService) {

  $scope.loggedIn = authService.loggedIn;
  $scope.logout = authService.logout;

}]);