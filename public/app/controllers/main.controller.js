(function() {
  'use strict';

  angular
    .module('mainCtrl', [])
    .controller('MainController', MainController);

  MainController.$inject = ['$rootScope', '$location'];

  function MainController($rootScope, $location) {
    var vm = this;
  }
})();
