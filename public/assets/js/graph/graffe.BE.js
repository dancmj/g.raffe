var _ = require('lodash');
var binaryHeap = require('../utils/binaryHeap.js');

module.exports = function() {
  function Vertex(name) {
    this.name = name;
    this.adjacents = [];
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

  function Edge(source, sink, properties) {
    _.forEach(properties, function(val, key) {
      if (typeof val !== 'number') properties[key] = 0;
    })
    this.source = source;
    this.sink = sink;
    this.cost = properties.cost || 0;
    this.minFlow = !properties.minFlow || properties.minFlow < 0 ? 0 : properties.minFlow;
    this.maxFlow = !properties.maxFlow ? Infinity : properties.maxFlow < this.minFlow ? this.minFlow : properties.maxFlow;
    this.flow = !properties.flow || properties.flow < 0 ? 0 : properties.flow > this.maxFlow ? this.maxFlow : properties.flow;
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
      return (this.vertices.length != 0 && _.some(this.vertices, {
        'name': name
      }));
    },
    FindVertex: function(name) {
      return _.find(this.vertices, {
        'name': name
      });
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
      return _.last(this.vertices);
    },
    RemoveVertex: function(name){
      if(!this.ContainsVertex(name)) return false

      var eraseeVertex = this.FindVertex(name);

      /// ERASE EDGES

      return true;
    },
    FindEdge: function(source, sink){
      return _.find(this.edges, function(edge){
        return edge.sink.name == sink && edge.source.name == source;
      }) || false;
    },
    AddEdge: function(source, sink, properties) {
      if (!source || !sink || source == sink) {
        return false;
      }

      if(!properties){
        properties = {
          cost: 0,
          flow: 0,
          maxFlow: null,
          minFlow: 0
        }
      }

      source = this.AddVertex(source);
      sink = this.AddVertex(sink);

      var repeatedEdge = this.FindEdge(source.name, sink.name);
      if(repeatedEdge) return repeatedEdge;

      var edge = new Edge(source, sink, properties);
      var redge = new Edge(sink, source, {cost: Infinity, flow: 0, maxFlow: 0, minFlow: properties.minFlow});
      redge.fake = true;
      edge.redge = redge;
      redge.redge = edge;
      source.adjacents.push(edge);
      sink.adjacents.push(redge);
      this.edges.push(edge);

      return _.last(this.edges);
    },
    RemoveEdge: function(source, sink){
      source = this.FindVertex(source);
      sink = this.FindVertex(sink);

      if( !this.edges.length || !source || !sink || sink.name == source.name || !this.FindEdge(source.name, sink.name)){
          return false;
      }
      var self = this;

      source.adjacents.splice(_.findIndex(source.adjacents, function(edge){
        if(!edge.fake && edge.sink.name == sink.name) edge.redge = null;
        return !!edge.redge;
      }), 1);

      sink.adjacents.splice(_.findIndex(sink.adjacents, function(edge){
        if(edge.fake && edge.sink.name == sink.name) edge.redge = null;
        return !!edge.redge;
      }), 1);

      this.edges.splice(_.findIndex(sink.adjacents, function(edge){
        return edge.source.name == source.name && edge.sink.name == sink.name;
      }),1);

      return true;
    }
  };

  function newGraph() {
    return new Graph();
  }

  return {
    newGraph: newGraph
  }
}
