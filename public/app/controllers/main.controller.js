(function() {
  'use strict';

  angular
    .module('mainCtrl', [])
    .controller('MainController', MainController);

  MainController.$inject = ['$rootScope', '$location', '$window'];

  function MainController($rootScope, $location, $window) {
    var vm = this;

    $rootScope.$watch(function(){
      console.log('asdfasdf')
    });
    angular.element($window).on('resize',function(){$rootScope.$apply()});
  }
})();
