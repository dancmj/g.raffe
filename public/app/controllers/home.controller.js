(function() {
  'use strict';

  angular
    .module('homeCtrl', [])
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$rootScope', '$location'];

  function HomeController($rootScope, $location) {
    var vm = this;

    vm.graph = graffe.new();
  }
})();
