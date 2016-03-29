var app = angular.module('notify');

app.factory('notebooksService', ['$http', 'authService', function($http, authService) {

  $http.defaults.headers.common.Authorization = authService.getToken();

  var notebooks = {
    notebooks: []
  };

  notebooks.get = function() {
    return $http.get('/notebooks')
      .then(function(res) {
        authService.currentUser();
        angular.copy(res.data, notebooks.notebooks);
      }, function(err) {
        notebooks.error = err.data.error;
      });
  };

  notebooks.getOne = function(id) {
    return $http.get('/notebooks/' + id)
    .then(function(res) {
      return res.data;
    }, function(err) {
      notebooks.error = err.data.error;
    });
  };

  notebooks.post = function(notebook) {
    return $http.post('/notebooks', notebook)
      .then(function(res) {
        notebooks.notebooks.push(res.data);
      }, function(err) {
        notebooks.error = err.data.error;
      });
  };

  notebooks.put = function(notebook, update) {
    return $http.put('/notebooks/' + notebook._id, update)
      .then(function(res) {
        var idx = notebooks.notebooks.indexOf(notebook);
        notebooks.notebooks.splice(idx, 1);
        notebooks.notebooks.push(res.data);
      }, function(err) {
        notebooks.error = err.data.error;
      });
  };

  notebooks.delete = function(notebook) {
    return $http.delete('/notebooks/' + notebook._id)
      .then(function() {
        var idx = notebooks.notebooks.indexOf(notebook);
        notebooks.notebooks.splice(idx, 1);
      }, function(err) {
        notebooks.error = err.data.error;
      });
  };

  return notebooks;

}]);