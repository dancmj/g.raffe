var _ = require('lodash');
var binaryHeap = require('../utils/binaryHeap.js');

module.exports = function() {
  function Vertex(n) {
    this.name = _.trunc(_.trim(n), {
      length: 10,
      omission: ''
    });
    this.adjacentVertices = [];
    this.distanceFromRoot = 0;
    this.maxFlow = null;
    this.minFlow = 0;
    this.discoveryLabel = -1;
    this.property = {
      key: Infinity,
      parent: null,
      edge: null
    };
  };

  function Edge(source, sink, property) {
    _.forEach(property, function(val, key) {
      if (typeof val !== 'number') property[key] = 0;
    });
    this.source = source;
    this.sink = sink;
    this.cost = 0;
    this.minFlow = !property.minFlow || property.minFlow < 0 ? 0 : property.minFlow;
    this.maxFlow = !property.maxFlow ? Infinity : property.maxFlow < this.minFlow ? this.minFlow : property.maxFlow;
    this.flow = !property.flow || property.flow < 0 ? 0 : property.flow > this.maxFlow ? this.maxFlow : property.flow;
    this.redge = null;
    this.fake = false;
    this.discoveryLabel = -1;
  };

  function Graph() {
    this.vertices = [];
    this.edges = [];
    this.directed = true;
    this.adjacencyMatrix = [];
  };

  Graph.prototype = {
    ContainsVertex: function(name) {
      return (this.vertices.length != 0 && this.vertices.any(function(node) {
        return node.name == name;
      }));
    },
    FindVertex: function(name) {
      return (this.vertices.whereFirst(function(node) {
        if (node.name == name) {
          return node;
        }
      }));
    },
    AddVertex: function(name) {
      if (this.ContainsVertex(name)) {
        return this.FindVertex(name);
      }
      this.vertices.push(new Vertex(name));
      return this.vertices[this.vertices.length - 1];
    }
  };

  function newGraph() {
    return new Graph();
  }

  return {
    newGraph: newGraph
  }
}
