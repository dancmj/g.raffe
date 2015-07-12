var _ = require('lodash');
var binaryHeap = require('../utils/binaryHeap.js');

module.exports = function() {
  function Vertex(name) {
    this.name = name;
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
      return (this.vertices.length != 0 && _.some(this.vertices, { 'name': name }));
    },
    FindVertex: function(name) {
      return _.find(this.vertices, {'name': name});
    },
    AddVertex: function(name) {
      name = _.trunc(_.trim(name), {
        length: 10,
        omission: ''
      });
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
