var Graffe = require('../public/assets/js/graph/graffe.BE.js');

describe('#graffe.BE.js', function() {
  var graffe = new Graffe();
  var g;

  beforeEach(function() {
    g = graffe.newGraph();
  });

  context('#Vertex', function() {
    describe('#AddVertex', function() {
      it('should create a new vertex with default properties', function() {
        var vertex = g.AddVertex('A');
        expect(g.vertices).to.have.length(1);
        expect(vertex.name).to.equal('A');
        expect(vertex.adjacents).to.have.length(0);
        expect(vertex.distanceFromRoot).to.equal(0);
        expect(vertex.maxFlow).to.equal(null);
        expect(vertex.minFlow).to.equal(0);
        expect(vertex.discoveryLabel).to.equal(-1);
        expect(vertex.property).to.deep.equal({
          key: Infinity,
          parent: null,
          edge: null
        });
      });
      it('should limit and trim vertex names', function() {
        var vertex1 = g.AddVertex('ABCDEFGHIJKLMN');
        var vertex2 = g.AddVertex('     ABCD     ');
        expect(vertex1.name).to.have.length(10);
        expect(vertex2.name).to.have.length(4);
      });
      it('should not add repeated vertex names', function() {
        var vertex1 = g.AddVertex('test');
        var vertex2 = g.AddVertex('test');
        expect(vertex1).to.be.equal(vertex2);
      });
      it('should not add invalid name', function(){
        var vertex1 = g.AddVertex('');
        var vertex2 = g.AddVertex();

        expect(vertex1).to.be.false;
        expect(vertex2).to.be.false;
        expect(g.vertices).to.be.empty;
      });
    });
    describe('#FindVertex', function(){
      beforeEach(function(){
        g.AddVertex('A');
      });
      it('should find vertex', function(){
        var vertexAFound = g.FindVertex('A');
        expect(vertexAFound).to.be.ok;
      });
      it('should not find vertex', function(){
        var vertexBFound = g.FindVertex('B');
        expect(vertexBFound).to.be.false;
      });
    });
    describe('#RemoveVertex', function(){
      var vertex;
      beforeEach(function(){
        vertex = g.AddVertex('A');
      });
      it('should remove vertex from graph', function(){
        g.AddVertex('B');
        var vertexRemoved = g.RemoveVertex('B');
        var vertexAFound = g.FindVertex('A');
        var vertexBFound = g.FindVertex('B');

        expect(vertexRemoved).to.be.true;
        expect(vertexAFound).to.be.ok;
        expect(vertexBFound).to.be.false;
        expect(g.vertices).to.have.lengthOf(1);
      });
      it('should remove any edges connected to the vertex', function(){
        g.AddEdge('A', 'B');
        g.AddEdge('B', 'C');
        g.AddEdge('D', 'C');
        g.AddEdge('E', 'C');
        g.AddEdge('F', 'C');
        g.RemoveVertex('C');

        var edgeABFound = g.FindEdge('A', 'B');
        var edgeBCFound = g.FindEdge('B', 'C');
        var vertexCFound = g.FindVertex('C');

        expect(edgeABFound).to.be.ok;
        expect(edgeBCFound).to.be.false;
        expect(vertexCFound).to.be.false;
        expect(g.vertices).to.have.lengthOf(5);
        expect(g.edges).to.have.lengthOf(1);
      });
      it('should return false with invalid parameters', function(){
        var vertexRemoved1 = g.RemoveVertex();
        var vertexRemoved2 = g.RemoveVertex('B');

        expect(vertexRemoved1, 'no parameters').to.be.false;
        expect(vertexRemoved2, 'vertex doesn\'t exist').to.be.false;
      });
    });
  });

  context('#Edge', function() {
    describe('#AddEdge', function() {
      it('should return false with invalid parameters', function() {
        var edge1 = g.AddEdge();
        var edge2 = g.AddEdge('A', 'A');
        var edge3 = g.AddEdge('A');
        var edge4 = g.AddEdge('', null);
        expect(edge1).to.be.false;
        expect(edge2).to.be.false;
        expect(edge3).to.be.false;
        expect(edge4).to.be.false;
        expect(g.edges).to.have.lengthOf(0);
      });
      it('should create an edge with default properties', function() {
        var vertexA = g.AddVertex('A');
        var vertexB = g.AddVertex('B');
        var vertexC = g.AddVertex('C');
        var edge = g.AddEdge('A', 'B');

        g.AddEdge('A', 'C');

        expect(edge.source).to.equal(g.FindVertex('A'));
        expect(edge.sink).to.equal(g.FindVertex('B'));
        expect(edge.cost, 'cost').to.equal(0);
        expect(edge.maxFlow, 'max flow').to.equal(Infinity);
        expect(edge.minFlow, 'min flow').to.equal(0);
        expect(edge.flow, 'flow').to.equal(0);
        expect(edge.redge.source).to.equal(g.FindVertex('B'));
        expect(edge.redge.sink).to.equal(g.FindVertex('A'));
        expect(edge.fake).to.be.false;
        expect(edge.discoveryLabel).to.equal(-1);
        expect(vertexA.adjacents, 'A ->').to.have.lengthOf(2);
        expect(vertexB.adjacents, 'B ->').to.have.lengthOf(1);
        expect(vertexC.adjacents, 'C ->').to.have.lengthOf(1);
        expect(g.edges).to.have.lengthOf(2);
      });
      it('should create the vertices if they don\'t exist', function() {
        var edge = g.AddEdge('A', 'B');
        expect(g.vertices).to.have.lengthOf(2);
        expect(g.edges).to.have.lengthOf(1);
      })
      it('should create an edge with specified properties', function() {
        var properties = {
          cost: 10,
          maxFlow: 10,
          minFlow: 1,
          flow: 2
        };
        var edge = g.AddEdge('A', 'B', properties);
        expect(edge.cost, 'cost').to.equal(10);
        expect(edge.maxFlow, 'max flow').to.equal(10);
        expect(edge.minFlow, 'min flow').to.equal(1);
        expect(edge.flow, 'flow').to.equal(2);
        expect(g.edges).to.have.lengthOf(1);
      });
      it('should change property to default value if property is invalid', function() {
        var properties = {
          cost: "test",
          maxFlow: "test",
          minFlow: "test",
          flow: "test"
        };
        var edge = g.AddEdge('A', 'B', properties);
        expect(edge.cost, 'cost').to.equal(0);
        expect(edge.maxFlow, 'max flow').to.equal(Infinity);
        expect(edge.minFlow, 'min flow').to.equal(0);
        expect(edge.flow, 'flow').to.equal(0);
        expect(g.edges).to.have.lengthOf(1);
      });
      it('should not add repeated edges', function() {
        var edge1 = g.AddEdge('A', 'B');
        var edge2 = g.AddEdge('A', 'B');
        expect(edge1).to.equal(edge2);
        expect(g.edges).to.have.lengthOf(1);
      });
    });
    describe('#FindEdge', function(){
      beforeEach(function(){
        g.AddEdge('A', 'B');
      });
      it('should find edge', function(){
        var edgeABFound = g.FindEdge('A', 'B');
        expect(edgeABFound).to.be.ok;
      });
      it('should not find edge', function(){
        var edgeBAFound = g.FindEdge('B', 'A');
        expect(edgeBAFound).to.be.false;
      });
    });
    describe('#RemoveEdge', function(){
      var edge;
      beforeEach(function(){
        edge = g.AddEdge('A', 'B');
      });
      it('should remove edge from graph', function(){
        var edgeRemoved1 = g.RemoveEdge('A', 'B')
        var edgeRemoved2 = g.RemoveEdge('A', 'B')
        var edgeFound = g.FindEdge('A','B');
        var vertexA = g.FindVertex('A');
        var vertexB = g.FindVertex('B');

        g.AddEdge('C', 'D');

        expect(edgeRemoved1).to.be.true;
        expect(edgeRemoved2).to.be.false;
        expect(edgeFound, 'edge exists').to.be.false;
        expect(edge.redge, 'return edge').to.be.null;
        expect(vertexA.adjacents, 'source vertex adjacents').to.have.lengthOf(0);
        expect(vertexB.adjacents, 'sink vertex adjacents').to.have.lengthOf(0);
        expect(g.edges, 'edge list').to.have.lengthOf(1);
      });
      it('should return false with invalid parameters', function(){
        g.AddVertex('C');
        g.AddVertex('D');
        g.AddEdge('J', 'K');

        var edgeRemoved1 = g.RemoveEdge();
        var edgeRemoved2 = g.RemoveEdge('M');
        var edgeRemoved3 = g.RemoveEdge('C', 'D');
        var edgeRemoved4 = g.RemoveEdge('A', 'A');
        var edgeRemoved5 = g.RemoveEdge('K', 'J');

        expect(edgeRemoved1, 'no parameters').to.be.false;
        expect(edgeRemoved2, 'vertices don\'t exist').to.be.false;
        expect(edgeRemoved3, 'edge doesn\'t exist').to.be.false;
        expect(edgeRemoved4, 'sink equals source').to.be.false;
        expect(edgeRemoved5, 'edge doesn\'t exist').to.be.false;
      });
    });
  });

  context('#Graph', function() {

  });
});
