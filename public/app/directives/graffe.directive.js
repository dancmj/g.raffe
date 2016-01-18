(function(){
  'use strict';

  angular
    .module('graffeDirective', [])
    .controller('GraffeDirective', GraffeDirective);

  GraffeDirective.$inject = [];

  function GraffeDirective() {
    var vm = this;

    function link(scope, el, attr){

    }
    return {
      link: link,
      restrict: 'E',
      graph: '='
    }
  }
})();
