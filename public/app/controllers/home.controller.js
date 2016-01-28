(function() {
  'use strict';

  angular
    .module('homeCtrl', [])
    .controller('HomeController', HomeController);

  HomeController.$inject = [];

  function HomeController() {
    var vm = this;
    vm.addVertex  = addVertex;
    vm.addEdge    = addEdge;
    vm.vertexL    = '';
    vm.vertexR    = '';
    vm.reset      = null;
    vm.graph      = graffe.new();
    vm.algorithms = {
      options: [
        'Breadth First Search',
        'Depth First Search',
        "Kruskal's",
        "Dijkstra's",
        "Prim's"
      ],
      selected: "Breadth First Search"
    };

    function addVertex() {
      vm.graph.addVertex(vm.vertexL);
      vm.reset()
    }

    function addEdge(direction) {
      if(direction === ">"){
        vm.graph.addEdge(vm.vertexL, vm.vertexR);
      }else if(direction === "<"){
        vm.graph.addEdge(vm.vertexR, vm.vertexL);
      }

      vm.reset();
    }
  }
})();
