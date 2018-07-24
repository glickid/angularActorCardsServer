

var actorApp = angular.module("actorApp", ["ngRoute"]);

actorApp.config(function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl : 'home.html',
      controller : 'homeCtrl'
    })
    .when('/actresses', {
        templateUrl : 'App/Actor/actresses.html',
        controller : 'actorCtrl'
    })
    .when('/moviesgallery', {
        templateUrl : 'App/Movies/moviesGallery.html',
        controller : 'moviesCtrl'
    })
    .when('/movies/:movieID', {
        templateUrl : 'App/Movies/movieDetails.html',
        controller : 'movieDetailsCtrl'
    })
    .otherwise({redirectTo: '/'
    });
});