angular.module('graffeDirective', []).directive('graffe', function(){
  function link(scope, element, attr){
    element.text('Hello!!!!!');
  }
  return {
    link: link,
    restrict: 'E'
  }
});
