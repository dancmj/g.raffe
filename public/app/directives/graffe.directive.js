(function(){
  'use strict';

  angular
    .module('graffeDrctv', [])
    .directive('graffe', graffe);

  graffe.$inject = [];

  function graffe() {
    var directive = {
      link: link,
      restrict: 'E',
      scope: {
        graph: '='
      }
    };
    return directive;

    function link(scope, el, attrs) {
      el = el[0];
      var width;
      var height;
      var graph = scope.graph;
      var svg = d3.select(el).append("svg");
      var nodes = graph.vertices;
      var links = graph.edges;
      var force = d3.layout.force();
      var node = svg.selectAll(".node");
      var link = svg.selectAll(".link");

      scope.$watch(function(){
        start();
        width = el.clientWidth;
        height = el.clientHeight;
        return width;
      }, resize);

      function resize() {
        svg.attr({width: width, height: height - 5});
        force.nodes(nodes)
             .links(links)
             .size([width, height])
             .on("tick", tick);
      }

      function start() {
        link = link.data(force.links(), function(d) { return d.source.name + "-" + d.target.name; });
        link.enter().insert("line", ".node").attr("class", "link");
        console.log(link);
        link.exit().remove();

        node = node.data(force.nodes(), function(d) {return d.name;});
        node.enter().append("circle").attr("class", function(d) { return "node " + d.name; }).attr("r", 8);
        node.exit().remove();

        force.start();
      }

      function tick() {
        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
      }
    }
  }
})();
