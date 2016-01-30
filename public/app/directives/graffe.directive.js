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
        reset: '='
      }
    };
    return directive;

    function link(scope, el, attrs) {
      el           = el[0];
      scope.reset  = reset;

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
      var link     = svg.selectAll("path");
      var links    = graph.edges;
      var settings = {
        radius: 20,
        radiusHeld: 36
      };

      svg.style("opacity", 1e-6)
          .transition()
          .duration(1000)
          .style("opacity", 1);

      svg.append("defs").selectAll("marker")
          .data(["-1", "path", "black", "gray"])
          .enter().append("marker")
          .attr("id", function(d) { return d; })
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", settings.radius + 5)
          .attr("refY", -2.5)
          .attr("markerWidth", 12)
          .attr("markerHeight", 12)
          .attr("orient", "auto")
          .append("path")
          .attr("d", "M0,-5L10,0L0,5");

      scope.$watch(function(){
        width  = el.clientWidth;
        height = el.clientHeight;
        return width;
      }, resize);

      function resize() {
        svg.attr({
          width: width,
          height: height - 10
        });

        reset();
      }

      function reset() {
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

        start();
      }

      function start() {
        link = link.data(force.links(), function(d) { return d.source.name + "-" + d.target.name; });
        link.enter().append("path")
            .attr("class", function(d) { return "link " + d.color; })
            .attr("marker-end", function(d) { return "url(#" + d.color + ")";});
        link.exit().remove();

        node = node.data(force.nodes(), function(d) {return d.name;});
        var g = node.enter().append("g")
            .attr("class", function(d) { return "node " + d.name; })
            .call(force.drag)
            .style("fill", randomColor);

        g.append("circle")
            .attr("r", settings.radius)
            .on("dblclick", dblClick);

        g.append("text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d) {
              return d.name;
            });

        node.exit().remove();
        force.start();
      }

      function tick() {
        node.attr("transform", function(d) {
          d.x = Math.max(settings.radius, Math.min(width - settings.radius, d.x));
          d.y = Math.max(settings.radius, Math.min(height - settings.radius, d.y));
          return "translate(" + d.x + "," + d.y + ")";
        });
        link.attr("d", function(d) {
          var dx = d.target.x - d.source.x;
          var dy = d.target.y - d.source.y;
          var dr = Math.sqrt(dx * dx + dy * dy);
          return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });
      }

      function dragStart(d) {
        var node = d3.select(this).select("circle");

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
        var node = d3.select(this).select("circle");
        node.attr("class", "");
        node.transition()
            .ease("elastic")
            .duration(500)
            .attr("r", settings.radius);
      }

      function dblClick(d) {
        d3.select(this).select("circle")
          .attr("fixed", d.fixed = false);
        force.start();
      }

      function noZoom() {
        d3.event.preventDefault();
      }
    }
  }
})();
