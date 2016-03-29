var app = angular.module('notify');

app.controller('notesController', ['$state', '$scope', 'notebook', 'notesService', 'note', function($state, $scope, notebook, notesService, note) {

  $scope.notes = notebook.notes;
  $scope.note = note;

  var errorReset = function() {
    delete notesService.error;
  };

  $scope.submitNote = function() {
    errorReset();
    if ($scope.note._id) {
      notesService.put(notebook, $scope.note)
        .then(function() {
          $scope.error = notesService.error;
        });
    } else {
      notesService.post(notebook, $scope.note)
        .then(function() {
          $scope.error = notesService.error;
          $state.go('app.notebook.note');
        });
    }
  };

  $scope.deleteNote = function(note) {
    errorReset();
    notesService.delete(notebook, note)
      .then(function() {
        $scope.error = notesService.error;
      });
  };

}]);