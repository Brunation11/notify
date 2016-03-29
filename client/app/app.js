var app = angular.module('notify', ['ui.router', 'ngMessages']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {


  $stateProvider
    .state('app', {
      url: '/',
      authenticate: true,
      views: {
        header: {
          templateUrl: '../navBar/template.html',
          controller: 'navController'
        },
        menu: {
          templateUrl: '../notebooks/template.html',
          controller: 'notebooksController'
        },
        content: {
        }
      },
      resolve: {
        notebooksPromise: ['notebooksService', function(notebooksService) {
          return notebooksService.get();
        }]
      }
    })

    .state('app.notebook', {
      url: 'notebooks/:notebook_id/notes',
      authenticate: true,
      views: {
        'menu@': {
          templateUrl: '../notes/template.html',
          controller: 'notesController'
        }
      },
      resolve: {
        notebook: ['$stateParams', 'notebooksService', function($stateParams, notebooksService) {
          return notebooksService.getOne($stateParams.notebook_id);
        }],
        note: function() {
          return {};
        }
      }
    })

    .state('app.notebook.newNote', {
      url: '/new',
      authenticate: true,
      views: {
        'content@': {
          templateUrl: '../notes/formTemplate.html',
          controller: 'notesController'
        }
      },
      resolve: {
        note: function() {
          return {};
        }
      }
    })

    .state('app.notebook.note', {
      url: '/:note_id',
      authenticate: true,
      views: {
        'content@': {
          templateUrl: '../notes/formTemplate.html',
          controller: 'notesController'
        }
      },
      resolve: {
        note: ['$stateParams', 'notesService', function($stateParams, notesService) {
          return notesService.getOne($stateParams.notebook_id, $stateParams.note_id);
        }]
      }
    })

    .state('login', {
      url: '/login',
      templateUrl: '../auth/template.html',
      controller: 'authController',
      authenticate: false,
    });

  $urlRouterProvider.otherwise('/');

}]);

app.run(function($rootScope, $state, authService) {
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    if (toState.authenticate && !authService.loggedIn()) {
      event.preventDefault();
      $state.transitionTo('login');
    } else if (toState.name === 'login' && authService.loggedIn()) {
      event.preventDefault();
      $state.transitionTo('app');
    }
  });
});