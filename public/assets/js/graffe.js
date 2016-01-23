var graffe = (function() {
  function Vertex(name) {
    this.name = name;
    this.adjacents = [];
    this.distanceFromRoot = 0;
    this.maxFlow = null;
    this.minFlow = 0;
    this.color = -1; // -1 -> unexplored ; path -> treePath ; black -> explored ; gray -> on queue ;
    this.tag = {
      key: Infinity,
      parent: null,
      edge: null
    };
  }

  function Edge(source, target, properties) {
    properties = properties || {};
    _.forEach(properties, function(val, key) {
      if (typeof val !== 'number') properties[key] = 0;
    });
    this.source = source;
    this.target = target;
    this.cost = properties.cost || 0;
    this.minFlow = !properties.minFlow || properties.minFlow < 0 ? 0 : properties.minFlow;
    this.maxFlow = !properties.maxFlow ? Infinity : properties.maxFlow < this.minFlow ? this.minFlow : properties.maxFlow;
    this.flow = !properties.flow || properties.flow < 0 ? 0 : properties.flow > this.maxFlow ? this.maxFlow : properties.flow;
    this.redge = null;
    this.fake = false;
    this.color = -1;
    this.setColor = function(newColor) {
      this.color = this.redge.color = newColor;
    }
  }

  function Graph() {
    this.vertices = [];
    this.edges = [];
    this.directed = true;
    this.adjacencyMatrix = {};
  }

  Graph.prototype = {
    findVertex: function(name) {
      name = typeof name === 'number' || typeof name === 'string' ? name + '' : null;
      if (!name) return false;
      return _.find(this.vertices, {
        'name': name
      }) || false;
    },

    addVertex: function(newVertex) {
      var name = newVertex instanceof Vertex ? newVertex.name + '' : newVertex;

      //     regexp => https://regex101.com/r/tL0qW6/3
      if (!name || !/^ *([a-z0-9][a-z0-9 ]*)+$/i.exec(name)) return false;
      name = _.truncate(_.trim(name), {
        length: 10,
        omission: ''
      }).replace(/ /g, '_');

      var repeatedVertex = this.findVertex(name);
      if (repeatedVertex) return repeatedVertex;

      this.vertices.push(new Vertex(name));
      return _.last(this.vertices);
    },

    removeVertex: function(name) {
      var _this = this;
      var eraseeVertex = this.findVertex(name);

      if (!eraseeVertex) return false;

      _.forEachRight(eraseeVertex.adjacents, function(edge) {
        !edge.fake ? _this.removeEdge(eraseeVertex.name, edge.target.name) : _this.removeEdge(edge.target.name, eraseeVertex.name);
      });

      this.vertices.splice(_.findIndex(this.vertices, function(vertex) {
        return vertex.name === name;
      }), 1);

      return true;
    },

    findEdge: function(source, target) {
      return _.find(this.edges, function(edge) {
        return edge.target.name == target && edge.source.name == source;
      }) || false;
    },

    addEdge: function(source, target, properties) {
      if (!source || !target || source == target) return false;

      if (!properties) {
        properties = {
          cost: 0,
          flow: 0,
          maxFlow: null,
          minFlow: 0
        }
      }

      source = this.addVertex(source);
      target = this.addVertex(target);

      var repeatedEdge = this.findEdge(source.name, target.name);

      if (repeatedEdge) return repeatedEdge;

      var edge = new Edge(source, target, properties);
      var redge = new Edge(target, source, {
        cost: Infinity,
        flow: 0,
        maxFlow: 0,
        minFlow: properties.minFlow
      });

      redge.fake = true;
      edge.redge = redge;
      redge.redge = edge;
      source.adjacents.push(edge);
      target.adjacents.push(redge);
      this.edges.push(edge);

      return _.last(this.edges);
    },

    removeEdge: function(source, target) {
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
    },

    //////////////////////////////////////
    isBipartite: function() {
      if (!this.vertices.length || !this.edges.length) return true;

      var queue = [];
      var result = true;
      var startVertex = this.vertices[0];
      startVertex.color = 1;

      queue.push(startVertex);
      while (queue.length > 0 && result) {
        var v = queue.shift();
        _.forEach(v.adjacents, function(edge) {
          if (edge.target.color == -1) {
            edge.target.color = 1 - v.color;
            queue.push(edge.target);
          } else if (edge.target.color == v.color) {
            result = false;
          }
        });
      }

      return result;
    },

    bfs: function(startVertex) {
      startVertex = this.findVertex(startVertex);
      if (!startVertex) return false;

      startVertex.color = 'gray';

      var queue = [];
      var _this = this;

      queue.push(startVertex);

      while (queue.length > 0) {
        var v = queue.shift();

        _.forEach(v.adjacents, function(edge) {
          if (edge.target.color == -1 && !(edge.fake && _this.directed)) {
            edge.setColor('path');
            edge.target.distanceFromRoot = v.distanceFromRoot + 1;
            edge.target.color = 'gray';
            queue.push(edge.target);
          }
        });
        v.color = 'black';
      }

      return true;
    },

    dfs: function(currentVertex) {
      currentVertex = this.findVertex(currentVertex)

      if (!currentVertex) return false;

      var _this = this;

      currentVertex.color = 'black';
      _.forEach(currentVertex.adjacents, function(edge) {
        if (edge.target.color == -1 && !(edge.fake && _this.directed)) {
          edge.setColor('path');
          edge.target.distanceFromRoot = currentVertex.distanceFromRoot + 1;
          _this.dfs(edge.target.name);
        }
      });

      return true;
    },

    prim: function(startVertex) {
      startVertex = this.findVertex(startVertex);
      if (!startVertex) return false;
      this.directed = false;

      startVertex.tag.key = 0;

      var heap = BinaryHeap.create(function(vertex) {
        return vertex.tag.key
      });

      heap.push(startVertex);

      while (heap.content.length > 0) {
        var v = heap.pop();
        v.color = 'black';

        _.forEach(v.adjacents, function(edge) {
          if (edge.target.color == -1) {
            if (edge.fake) edge.cost = edge.redge.cost;
            if (edge.target.color != 'black' && edge.cost < edge.target.tag.key) {
              edge.target.tag = {
                key: edge.cost,
                parent: v,
                edge: edge
              };
              heap.push(edge.target);
            }
          }
        });
      }

      _.forEach(this.vertices, function(vertex) {
        if (vertex.tag.edge != null) vertex.tag.edge.setColor('path');
      });

      return true;
    },

    kruskal: function() {
      if (!this.vertices.length || !this.edges.length) return false;

      this.directed = false;

      var counter = 0;
      var colorHelper;
      var heap = BinaryHeap.create(function(edge) {
        return edge.cost;
      });

      _.forEach(this.edges, function(edge) {
        heap.push(edge);
      });

      _.forEach(this.vertices, function(vertex, i) {
        vertex.color = i;
      });

      while (heap.content.length > 0 && counter < this.vertices.length - 1) {
        var e = heap.pop();

        if (e.source.color != e.target.color) {
          colorHelper = e.target.color;
          e.color = 'path';

          _.forEach(this.vertices, function(vertex) {
            if (vertex.color == colorHelper) vertex.color = e.source.color;
          });
          counter++;
        }
      }

      return true;
    },

    dijkstra: function(startVertex, goalVertex) {
      startVertex = this.findVertex(startVertex);
      goalVertex = this.findVertex(goalVertex);

      if (!startVertex || !goalVertex) {
        return false;
      }

      var _this = this,
        heap = BinaryHeap.create(function(vertex) {
          return vertex.tag.key;
        }),
        path = [];

      startVertex.tag.key = 0;
      heap.push(startVertex);

      while (heap.content.length > 0) {
        var v = heap.pop();
        v.color = 'black';

        _.forEach(v.adjacents, function(edge) {
          if (edge.fake) edge.cost = edge.redge.cost;
          if (edge.target.color != 'black' && edge.cost < edge.target.tag.key && !(edge.fake && _this.directed)) {
            var targetTag = edge.target.tag;
            targetTag.key = edge.cost + v.tag.key;
            targetTag.parent = v;
            targetTag.edge = edge;

            edge.target.distanceFromRoot = v.distanceFromRoot + 1;

            heap.push(edge.target);
          }
        });
      }

      var p = goalVertex;
      while (p) {
        p.color = 'path';
        path.unshift(p);
        if (p.tag.edge) p.tag.edge.setColor('path');
        p = p.tag.parent;
      }

      if (startVertex.color !== 'path') return false;
      if (!_this.directed) return goalVertex.tag.key; //Failsafe, dijkstra negative CANNOT work with undirected graphs
      //Reset the color of the vertices in path
      _.forEach(path, function(vertex) {
        vertex.color = 'black';
      });

      heap = BinaryHeap.create(function(edge) {
        return edge.cost;
      }); //New heap with unused edges
      _.forEach(_this.edges, function(edge) { //Iterate over non-path edges
        edge.color !== 'path' ? heap.push(edge) : edge.setColor(-1);
        // edge not in path? push it to heap : reset color for edge in path
      });

      while (heap.content.length > 0) {
        var e = heap.pop();

        if (e.cost + e.source.tag.key < e.target.tag.key) { //IF the cost will be less than the target's key
          if (e.target.distanceFromRoot < e.source.distanceFromRoot) {
            var distanceLimit = e.source.distanceFromRoot - e.target.distanceFromRoot,
              temporalSource = e.source;
            for (var i = 0; i < distanceLimit; i++) {
              if (temporalSource.tag.parent == e.target) return false;
              temporalSource = temporalSource.tag.parent;
            }
          }
          //No negcycles found, add the edge to the graph and change all the children.

          e.target.tag.edge.setColor(-1); //Revert previous edge to parent color.
          e.target.tag.key = e.cost + e.source.tag.key;
          e.target.tag.parent = e.source;
          e.target.tag.edge = e;

          var stack = [];
          stack.push(e.target);

          while (stack.length > 0) { //Check children's tags
            var v = stack.pop();

            _.forEach(v.adjacents, function(edge) {
              if (edge.target.tag.parent === v && !(e.fake && _this.directed)) {
                stack.push(edge.target);
                edge.target.distanceFromRoot = edge.source.distanceFromRoot + 1;
                edge.target.tag.key = edge.cost + edge.source.tag.key;
                edge.target.tag.parent = edge.source;
                edge.target.tag.edge = edge;
              }
            });
          }
        }
      }

      p = goalVertex;
      while (p) {
        p.color = 'path';
        path.unshift(p);
        if (p.tag.edge) p.tag.edge.setColor('path');
        p = p.tag.parent;
      }
      return goalVertex.tag.key;
    },

    matrix: function() {
      var vertices = this.vertices,
        _this = this;

      _this.adjacencyMatrix = {};

      _.forEach(vertices, function(vertex_i, i) {
        _this.adjacencyMatrix[vertex_i.name] = {};
        _.forEach(vertices, function(vertex_j, j) {
          _this.adjacencyMatrix[vertex_i.name][vertex_j.name] = {
            cost: Infinity,
            parent: null
          };
          var current = _this.adjacencyMatrix[vertex_i.name][vertex_j.name];
          if (i !== j) {
            _.forEach(_this.edges, function(edge) {
              if (edge.source.name === vertex_i.name && edge.target.name === vertex_j.name) {
                current.cost = edge.cost;
                current.parent = edge.source.name;
              }
            });
          } else {
            current.cost = 0;
          }
        });
      });

      return _this.adjacencyMatrix;
    },

    floydWarshall: function() {

    }
    //////////////////////////////////////
  };

  function newGraph() {
    return new Graph();
  }

  return {
    new: newGraph
  }
})();
