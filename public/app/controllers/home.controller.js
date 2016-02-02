(function() {
  'use strict';

  angular
    .module('homeCtrl', [])
    .controller('HomeController', HomeController);

  HomeController.$inject = [];

  function HomeController() {
    var vm = this;
    var _algorithmList = [
      {'name': 'Breadth First Search', method: 'bfs'},
      {'name': 'Depth First Search', method: 'dfs'},
      {'name': "Prim's", method: 'prim'},
      {'name': "Kruskal's", method: 'kruskal'},
      {'name': "Dijkstra's", method: 'dijkstra'}
    ];
    vm.addVertex  = addVertex;
    vm.addEdge    = addEdge;
    vm.runAlgorithm = runAlgorithm;
    vm.vertexL    = '';
    vm.vertexR    = '';
    vm.reset      = null;
    vm.graph      = graffe.new();
    vm.algorithms = {
      options: _algorithmList,
      selected: _algorithmList[0]
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

    function runAlgorithm() {
      vm.graph[vm.algorithms.selected.method](vm.vertexL);
    }
  }
})();
