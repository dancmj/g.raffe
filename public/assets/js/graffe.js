var graffe = (function() {
  function EventHandler() {
    this.eventList = [];
  }

  function Vertex(name) {
    this.name = name + '';
    this.adjacents = [];
  }

  function Edge(source, target) {
    this.source = source;
    this.target = target;
    this.fake = false;
    this.redge = null;
  }

  function Graph() {
    this.vertices = [];
    this.edges = [];
  }

  Graph.prototype = {
    findVertex: function findVertex(name) {
      name = typeof name === 'number' || typeof name === 'string' ? name + '' : null;

      if (!name) return false;
      return _.find(this.vertices, {
        'name': name
      }) || false;
    },

    addVertex: function addVertex(newVertex) {
      var name = newVertex instanceof Vertex ? newVertex.name : newVertex;

      if (!name || !/^ *([a-z0-9][a-z0-9 ]*)+$/i.exec(name)) return false;       //regexp => https://regex101.com/r/tL0qW6/3

      name = _.truncate(_.trim(name), {
        length: 10,
        omission: ''
      }).replace(/ /g, '_');

      var repeatedVertex = this.findVertex(name);
      if (repeatedVertex) return repeatedVertex;

      this.vertices.push(new Vertex(name));
      return _.last(this.vertices);
    },

    removeVertex: function removeVertex(name) {
      var eraseeVertex = this.findVertex(name);

      if (!eraseeVertex) return false;

      var _this = this;

      _.forEachRight(eraseeVertex.adjacents, function(edge) {
        !edge.fake ? _this.removeEdge(eraseeVertex.name, edge.target.name) : _this.removeEdge(edge.target.name, eraseeVertex.name);
      });

      this.vertices.splice(_.findIndex(this.vertices, function(vertex) {
        return vertex.name === name;
      }), 1);

      return true;
    },

    findEdge: function findEdge(source, target) {
      return _.find(this.edges, function(edge) {
        return edge.target.name == target && edge.source.name == source;
      }) || false;
    },

    addEdge: function addEdge(source, target) {
      if (!source || !target || source == target) return false;

      source = this.addVertex(source);
      target = this.addVertex(target);

      var repeatedEdge = this.findEdge(source.name, target.name);
      if (repeatedEdge) return repeatedEdge;

      var edge = new Edge(source, target);
      var redge = new Edge(target, source);

      redge.fake = true;
      edge.redge = redge;
      redge.redge = edge;
      source.adjacents.push(edge);
      target.adjacents.push(redge);
      this.edges.push(edge);

      return _.last(this.edges);
    },

    removeEdge: function removeEdge(source, target) {
      source = this.findVertex(source);
      target = this.findVertex(target);

      if (!this.edges.length || !source || !target || target.name == source.name || !this.findEdge(source.name, target.name)) {
        return false;
      }

      source.adjacents.splice(_.findIndex(source.adjacents, function(edge) {
        if (!edge.fake && edge.target.name == target.name) edge.redge = null;
        return !!edge.redge;
      }), 1);

      target.adjacents.splice(_.findIndex(target.adjacents, function(edge) {
        if (edge.fake && edge.source.name == target.name) edge.redge = null;
        return !!edge.redge;
      }), 1);

      this.edges.splice(_.findIndex(this.edges, function(edge) {
        return edge.source.name == source.name && edge.target.name == target.name;
      }), 1);

      return true;
    }
  };

  function newGraph() {
    return new Graph();
  }

  function newAttributes(graph) {
    return new GraphAttributes(graph);
  }

  return {
    newGraph: newGraph,
    newAttributes: newAttributes
  }
})();
