var app = angular.module('notify');

app.controller('navController', ['$scope', 'authService', '$state', function($scope, authService, $state) {

  $scope.loggedIn = authService.loggedIn;
  $scope.logout = function() {
    authService.logout;
    $state.go('app');
  }

}]);