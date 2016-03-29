var app = angular.module('notify');

app.factory('authService', ['$http', '$window', function($http, $window) {

  var auth = {};

  auth.saveToken = function(token) {
    $window.localStorage['notify-token'] = token;
  };

  auth.getToken = function() {
    return $window.localStorage['notify-token'];
  };

  auth.loggedIn = function() {
    var token = auth.getToken();
    if(token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.exp > Date.now()/1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function() {
    if (auth.loggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.username;
    }
  };

  auth.register = function(user) {
    return $http.post('/auth/register', user)
      .then(function(res) {
        auth.saveToken(res.data.token);
      }, function(err) {
        auth.error = err.data.error;
      });
  };

  auth.login = function(user) {
    return $http.post('/auth/login', user)
      .then(function(res) {
        auth.saveToken(res.data.token);
      }, function(err) {
        auth.error = err.data.error;
      });
  };

  auth.logout = function() {
    $window.localStorage.removeItem('notify-token');
  };

  return auth;

}]);
