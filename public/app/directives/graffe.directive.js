angular.module('graffeDirective', []).directive('graffe', function(){
  var vm = this;

  function link(scope, el, attr){

  }
  return {
    link: link,
    restrict: 'E',
    graph: '='
  }
});
