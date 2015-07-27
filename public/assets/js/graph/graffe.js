var _ = require('lodash');
var binaryHeap = require('../utils/binaryHeap.js');

module.exports = function() {
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
  };

  function Edge(source, sink, properties) {
    properties = properties || {};
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
    this.color = -1;
    this.setColor = function(newColor){
      this.color = this.redge.color = newColor;
    }
  };

  function Graph() {
    this.vertices = [];
    this.edges = [];
    this.directed = true;
    this.adjacencyMatrix = {};
  };

  Graph.prototype = {
    FindVertex: function(name) {
      name = typeof name === 'number' || typeof name === 'string' ? name = name + '' : name = null
      if(!name) return false;
      return _.find(this.vertices, {
        'name': name
      }) || false;
    },
    AddVertex: function(name) {
      name = typeof name === 'number' || typeof name === 'string' ? name = name + '' : name = null
      if(!name) return false;

      name = _.trunc(_.trim(name), {
        length: 10,
        omission: ''
      });

      var repeatedVertex = this.FindVertex(name);
      if (repeatedVertex) return repeatedVertex;

      this.vertices.push(new Vertex(name));
      return _.last(this.vertices);
    },
    RemoveVertex: function(name) {
      var eraseeVertex = this.FindVertex(name),
        self = this;
      if (!eraseeVertex) return false;

      _.forEachRight(eraseeVertex.adjacents, function(edge) {
        !edge.fake ? self.RemoveEdge(eraseeVertex.name, edge.sink.name) : self.RemoveEdge(edge.sink.name, eraseeVertex.name);
      });

      this.vertices.splice(_.findIndex(this.vertices, function(vertex) {
        return vertex.name === name;
      }), 1);

      return true;
    },
    FindEdge: function(source, sink) {
      return _.find(this.edges, function(edge) {
        return edge.sink.name == sink && edge.source.name == source;
      }) || false;
    },
    AddEdge: function(source, sink, properties) {
      if (!source || !sink || source == sink) {
        return false;
      }

      if (!properties) {
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
      if (repeatedEdge) return repeatedEdge;

      var edge = new Edge(source, sink, properties);
      var redge = new Edge(sink, source, {
        cost: Infinity,
        flow: 0,
        maxFlow: 0,
        minFlow: properties.minFlow
      });
      redge.fake = true;
      edge.redge = redge;
      redge.redge = edge;
      source.adjacents.push(edge);
      sink.adjacents.push(redge);
      this.edges.push(edge);

      return _.last(this.edges);
    },
    RemoveEdge: function(source, sink) {
      source = this.FindVertex(source);
      sink = this.FindVertex(sink);

      if (!this.edges.length || !source || !sink || sink.name == source.name || !this.FindEdge(source.name, sink.name)) {
        return false;
      }

      source.adjacents.splice(_.findIndex(source.adjacents, function(edge) {
        if (!edge.fake && edge.sink.name == sink.name) edge.redge = null;
        return !!edge.redge;
      }), 1);

      sink.adjacents.splice(_.findIndex(sink.adjacents, function(edge) {
        if (edge.fake && edge.source.name == sink.name) edge.redge = null;
        return !!edge.redge;
      }), 1);

      this.edges.splice(_.findIndex(this.edges, function(edge) {
        return edge.source.name == source.name && edge.sink.name == sink.name;
      }), 1);

      return true;
    },
    //////////////////////////////////////
    IsBipartite: function() {
      if (!this.vertices.length || !this.edges.length) return true;

      var startVertex = this.vertices[0];
      startVertex.color = 1;

      var queue = [],
        result = true;

      queue.push(startVertex);
      while (queue.length > 0 && result) {
        var v = queue.shift();
        _.forEach(v.adjacents, function(edge){
            if(edge.sink.color == -1){
                edge.sink.color = 1 - v.color;
                queue.push(edge.sink);
            }else if(edge.sink.color == v.color){
                result = false;
            }
        });
      }

      return result;
    },
    BFS: function(startVertex){
      startVertex = this.FindVertex(startVertex);
      if(!startVertex) return false;

      startVertex.color = 'gray';

      var queue = [], self = this;
      queue.push(startVertex);

      while(queue.length > 0){
        var v = queue.shift();

        _.forEach(v.adjacents, function(edge){
          if(edge.sink.color == -1 && !(edge.fake && self.directed)){
            edge.setColor('path');
            edge.sink.distanceFromRoot = v.distanceFromRoot + 1;
            edge.sink.color = 'gray';
            queue.push(edge.sink);
          }
        });
        v.color = 'black';
      };

      return true;
    },
    DFS: function(currentVertex){
      currentVertex = this.FindVertex(currentVertex), self = this;
      if(!currentVertex) return false;

      currentVertex.color = 'black';
      _.forEach(currentVertex.adjacents, function(edge){
        if(edge.sink.color == -1 && !(edge.fake && self.directed)){
          edge.setColor('path');
          edge.sink.distanceFromRoot = currentVertex.distanceFromRoot + 1;
          self.DFS(edge.sink.name);
        }
      });

      return true;
    },
    PRIM: function(startVertex){
      startVertex = this.FindVertex(startVertex);
      if(!startVertex) return false;
      this.directed = false;

      startVertex.tag.key = 0;

      var heap = binaryHeap.create(function(vertex){
            return vertex.tag.key
          });

      heap.push(startVertex);

      while(heap.content.length > 0){
        v = heap.pop();
        v.color = 'black';

        _.forEach(v.adjacents, function(edge){
          if(edge.sink.color == -1){
            if(edge.fake) edge.cost = edge.redge.cost;
            if(edge.sink.color != 'black' && edge.cost < edge.sink.tag.key){
              edge.sink.tag = {key: edge.cost, parent: v, edge: edge};
              heap.push(edge.sink);
            }
          }
        });
      }

      _.forEach(this.vertices, function(vertex){
        if(vertex.tag.edge != null){
          vertex.tag.edge.setColor('path');
        }
      });

      return true;
    },
    Kruskal: function(){
      if(!this.vertices.length || !this.edges.length) return false;

      this.directed = false;

      var counter = 0, colorHelper;
      var heap = binaryHeap.create(function(edge){
            return edge.cost;
          });

     _.forEach(this.edges, function(edge){
       heap.push(edge);
     });

     _.forEach(this.vertices, function(vertex, i){
       vertex.color = i;
     });

     while(heap.content.length > 0 && counter < this.vertices.length - 1){
       var e = heap.pop();

       if(e.source.color != e.sink.color){
         colorHelper = e.sink.color;
         e.color = 'path';

         _.forEach(this.vertices, function(vertex){
           if(vertex.color == colorHelper){
             vertex.color = e.source.color;
           }
         });
         counter++;
       }
     }

      return true;
    },
    Dijkstra: function(startVertex, goalVertex){
      startVertex = this.FindVertex(startVertex);
      goalVertex = this.FindVertex(goalVertex);

      if(!startVertex || !goalVertex){
        return false;
      }

      var self = this,
          heap = binaryHeap.create(function(vertex){
            return vertex.tag.key;
          }),
          path = [];

      startVertex.tag.key = 0;
      heap.push(startVertex);

      while(heap.content.length > 0){
        var v = heap.pop();
        v.color = 'black';

        _.forEach(v.adjacents, function(edge){
          if(edge.fake) edge.cost = edge.redge.cost;
          if(edge.sink.color != 'black' && edge.cost < edge.sink.tag.key && !(edge.fake && self.directed)){
            var sinkTag = edge.sink.tag;
            sinkTag.key = edge.cost + v.tag.key;
            sinkTag.parent = v;
            sinkTag.edge = edge;

            edge.sink.distanceFromRoot = v.distanceFromRoot + 1;

            heap.push(edge.sink);
          }
        });
      }

      var p = goalVertex;
      while(p){
        p.color = 'path';
        path.unshift(p);
        if(p.tag.edge) p.tag.edge.setColor('path');
        p = p.tag.parent;
      }

      if(startVertex.color !== 'path') return false;
      if(!self.directed) return goalVertex.tag.key; //Failsafe, Dijkstra negative CANNOT work with undirected graphs
      //Reset the color of the vertices in path
      _.forEach(path, function(vertex){
        vertex.color = 'black';
      });

      heap = binaryHeap.create(function(edge){ return edge.cost; }); //New heap with unused edges
      _.forEach(self.edges, function(edge){ //Iterate over non-path edges
        edge.color !== 'path' ? heap.push(edge) : edge.setColor(-1);
        // edge not in path? push it to heap : reset color for edge in path
      });

      while (heap.content.length > 0) {
        var e = heap.pop();

        if (e.cost + e.source.tag.key < e.sink.tag.key) { //IF the cost will be less than the sink's key
          if(e.sink.distanceFromRoot < e.source.distanceFromRoot){
            var distanceLimit = e.source.distanceFromRoot - e.sink.distanceFromRoot,
                temporalSource = e.source;
            for(var i = 0; i < distanceLimit; i++){
              if(temporalSource.tag.parent == e.sink){
                return false;
              }
              temporalSource = temporalSource.tag.parent;
            }
          }
          //No negcycles found, add the edge to the graph and change all the children.

          e.sink.tag.edge.setColor(-1); //Revert previous edge to parent color.
          e.sink.tag.key = e.cost + e.source.tag.key;
          e.sink.tag.parent = e.source;
          e.sink.tag.edge = e;

          var stack = [];
          stack.push(e.sink);

          while (stack.length > 0) { //Check children's tags
            var v = stack.pop();

            _.forEach(v.adjacents, function(edge) {
              if (edge.sink.tag.parent === v  && !(e.fake && self.directed)) {
                stack.push(edge.sink);
                edge.sink.distanceFromRoot = edge.source.distanceFromRoot + 1;
                edge.sink.tag.key = edge.cost + edge.source.tag.key;
                edge.sink.tag.parent = edge.source;
                edge.sink.tag.edge = edge;
              }
            });
          }
        }
      }

      p = goalVertex;
      while(p){
        p.color = 'path';
        path.unshift(p);
        if(p.tag.edge) p.tag.edge.setColor('path');
        p = p.tag.parent;
      }
      return goalVertex.tag.key;
    },
    Matrix: function(){
      var vertices = this.vertices,
          self = this;

      self.adjacencyMatrix = {};

      _.forEach(vertices, function(vertex_i, i){
        self.adjacencyMatrix[vertex_i.name] = {};
        _.forEach(vertices, function(vertex_j, j){
          self.adjacencyMatrix[vertex_i.name][vertex_j.name] = { cost: Infinity, parent: null };
          var current = self.adjacencyMatrix[vertex_i.name][vertex_j.name];
          if(i !== j){
            _.forEach(self.edges, function(edge){
            if(edge.source.name === vertex_i.name && edge.sink.name === vertex_j.name){
                current.cost = edge.cost;
                current.parent = edge.source.name;
              }
            });
          }else{
            current.cost = 0;
          }
        });
      });
      // console.log(self.adjacencyMatrix)

      return self.adjacencyMatrix;
    }
    //////////////////////////////////////
  }

  function newGraph() {
    return new Graph();
  }

  return {
    newGraph: newGraph
  }
}
