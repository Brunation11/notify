var app = angular.module('notify', ['ui.router', 'ngMessages', 'hc.marked', 'textAngular']);

app.config(['$stateProvider', '$urlRouterProvider', 'markedProvider', '$provide', function($stateProvider, $urlRouterProvider, markedProvider, $provide) {

  markedProvider.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    highglight: function(code, lang) {
      if (lang) {
        return hljs.highlight(lang, code, true).value;
      } else {
        return hljs.highlightAuto(code).value;
      }
    }
  });


 $provide.decorator('taOptions', ['$delegate', function(taOptions){
    // $delegate is the taOptions we are decorating
    // here we override the default toolbars and classes specified in taOptions.
    taOptions.forceTextAngularSanitize = true; // set false to allow the textAngular-sanitize provider to be replaced
    taOptions.keyMappings = []; // allow customizable keyMappings for specialized key boards or languages
    taOptions.toolbar = [['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear', 'justifyLeft','justifyCenter','justifyRight', 'justifyFull', 'html', 'insertImage', 'insertLink', 'wordcount', 'charcount'
    ]];
    taOptions.classes = {
        focussed: 'focussed',
        toolbar: 'btn-toolbar',
        toolbarGroup: 'btn-group',
        toolbarButton: 'btn btn-default',
        toolbarButtonActive: 'active',
        disabled: 'disabled',
        textEditor: 'form-control',
        htmlEditor: 'form-control'
    };
    return taOptions; // whatever you return will be the taOptions
  }]);

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