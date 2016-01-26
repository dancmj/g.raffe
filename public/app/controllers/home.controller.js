(function() {
  'use strict';

  angular
    .module('homeCtrl', [])
    .controller('HomeController', HomeController);

  HomeController.$inject = [];

  function HomeController() {
    var vm = this;
    vm.newVertex  = newVertex;
    vm.newEdge    = newEdge;
    vm.inputName1 = "";
    vm.inputName2 = "";
    vm.reset      = null;
    vm.graph      = graffe.new();

    function newVertex() {
      vm.graph.addVertex(vm.inputName1);
      vm.reset();
    }

    function newEdge() {
      vm.graph.addEdge(vm.inputName1, vm.inputName2);
      vm.reset();
    }
  }
})();
