var app = angular.module('notify');

app.factory('notesService', ['$http', 'authService', function($http, authService) {

  $http.defaults.headers.common.Authorization = authService.getToken();

  var notes = {};

  notes.getOne = function(notebookId, noteId) {
    return $http.get('/notebooks/' + notebookId + '/notes/' + noteId)
      .then(function(res) {
        return res.data;
      }, function(err) {
        notes.error = err.data.error;
      });
  };

  notes.post = function(notebook, note) {
    return $http.post('/notebooks/' + notebook._id + '/notes', note)
      .then(function(res) {
        notebook.notes.push(res.data);
      }, function(err) {
        notes.error = err.data.error;
      });
  };

  notes.put = function(notebook, note) {
    return $http.put('/notebooks/' + notebook._id + '/notes/' + note._id, note)
      .then(function(res) {
        var idx = notebook.notes.indexOf(note);
        notebook.notes.splice(idx, 1);
        notebook.notes.push(res.data);
      }, function(err) {
        notes.error = err.data.error;
      });
  };

  notes.delete = function(notebook, note) {
    return $http.delete('/notebooks/' + notebook._id + '/notes/' + note._id)
      .then(function() {
        var idx = notebook.notes.indexOf(note);
        notebook.notes.splice(idx, 1);
      }, function(err) {
        notes.error = err.data.error;
      });
  };

  return notes;

}]);
