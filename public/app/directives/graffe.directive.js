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
        graph: '=',
        settings: '='
      }
    };
    return directive;

    function link(scope, el, attrs) {
      el = el[0];
      var width;
      var height;
      var graph    = scope.graph;
      var svg      = d3.select(el)
                       .on("touchstart", noZoom)
                       .on("touchmove", noZoom)
                       .append("svg");
      var force    = d3.layout.force();
      var node     = svg.selectAll(".node");
      var nodes    = graph.vertices;
      var link     = svg.selectAll(".link");
      var links    = graph.edges;
      var settings = {
        radius: 20,
        radiusHeld: 36
      };

      svg.style("opacity", 1e-6)
         .transition()
         .duration(1000)
         .style("opacity", 1);

      scope.$watch(function(){
        start();
        width  = el.clientWidth;
        height = el.clientHeight;
        return width;
      }, resize);

      function resize() {
        svg.attr({
          width: width,
          height: height - 5
        });

        force.nodes(nodes)
             .links(links)
             .size([width, height])
             .charge(-200)
             .linkDistance(100)
             .on("tick", tick);
        force.drag()
             .on("dragstart", dragStart)
             .on("drag", dragged)
             .on("dragend", dragEnded);
      }

      function start() {
        link = link.data(force.links(), function(d) { return d.source.name + "-" + d.target.name; });
        link.enter().insert("line", ".node").attr("class", "link");
        link.exit().remove();

        node = node.data(force.nodes(), function(d) {return d.name;});
        node.enter().append("circle")
            .attr("class", function(d) { return "node " + d.name; })
            .attr("r", settings.radius)
            .call(force.drag)
            .style("fill", randomColor())
            .on("dblclick", dblClick);
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

      function dragStart(d) {
        var node = d3.select(this);

        node.attr("class", "shadow");

        node.transition()
          .ease("elastic")
          .duration(500)
          .attr("r", settings.radiusHeld)
          .attr("fixed", d.fixed = true);
      }

      function dragged() {
      }

      function dragEnded() {
        var node = d3.select(this);
        node.attr("class", "");
        node.transition()
          .ease("elastic")
          .duration(500)
          .attr("r", settings.radius);
      }

      function dblClick(d) {
        d3.select(this).attr("fixed", d.fixed = false);
      }

      function noZoom() {
        d3.event.preventDefault();
      }
    }
  }
})();
