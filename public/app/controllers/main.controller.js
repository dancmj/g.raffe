(function() {
  'use strict';

  angular
    .module('mainCtrl', [])
    .controller('MainController', MainController);

  MainController.$inject = ['$rootScope', '$window'];

  function MainController($rootScope, $window) {
    var vm = this;

    angular.element($window).on('resize', function(){ $rootScope.$apply() })
  }
})();
