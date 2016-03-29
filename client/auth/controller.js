var app = angular.module('notify');

app.controller('authController', ['$scope', '$state', 'authService', function($scope, $state, authService) {

  $scope.user = {};


  var errorReset = function() {
    delete authService.error;
  };

  $scope.register = function() {
    errorReset();
    authService.register($scope.user)
      .then(function() {
        $scope.error = authService.error;
        if (!$scope.error) {
          $state.go('home');
        }

      });
  };

  $scope.login = function() {
    errorReset();
    authService.login($scope.user)
      .then(function() {
        $scope.error = authService.error;
        if (!$scope.error) {
          $state.go('app');
        }
      });
  };

}]);