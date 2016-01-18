(function() {
  'use strict';

  angular
    .module('appRoutes', ['ngRoute'])
    .config(config);

  config.$inject = ['$routeProvider', '$locationProvider'];

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/pages/home.html',
        controller: 'HomeController',
        controllerAs: 'home'
      }).otherwise('/');

    $locationProvider.html5Mode(true);
  }
})();
