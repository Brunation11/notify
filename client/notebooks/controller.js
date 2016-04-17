var app = angular.module('notify');

app.controller('notebooksController', ['$scope', 'notebooksService', function($scope, notebooksService) {

  $scope.notebooks = notebooksService.notebooks;
  $scope.notebook = {};

  $scope.enableEdit = function(notebook){
    notebook.editable = true;
  };

  $scope.disableEdit = function(notebook){
    notebook.editable = false;
  };

  var errorReset = function() {
    delete notebooksService.error;
  };

  $scope.createNotebook = function() {
    errorReset();
    notebooksService.post($scope.notebook)
      .then(function() {
        $scope.error = notebooksService.error;
        if (!notebooksService.error) {
          $scope.notebook = {};
          $scope.notebookForm.$setPristine();
          $scope.notebookForm.$setUntouched();
        }
      });
  };

  $scope.deleteNotebook = function(notebook) {
    errorReset();
    notebooksService.delete(notebook)
      .then(function() {
        $scope.error = notebooksService.error;
      });
  };


}]);