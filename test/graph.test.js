var Graffe = require('../public/assets/js/graph/graffe.BE.js');

describe('#graph.js', function() {
  var graffe = new Graffe();
  var g;

  beforeEach(function() {
    g = graffe.newGraph();
  });

  context('#Vertex', function() {
    describe('construction', function() {
      it('should create a new vertex with default values', function() {
        var vertex = g.AddVertex();
        expect(g.vertices).to.have.length(1);
        expect(vertex.name).to.equal('');
        expect(vertex.adjacentVertices).to.have.length(0);
        expect(vertex.distanceFromRoot).to.equal(0);
        expect(vertex.maxFlow).to.equal(null);
        expect(vertex.minFlow).to.equal(0);
        expect(vertex.discoveryLabel).to.equal(-1);
        expect(vertex.property).to.deep.equal({ key: Infinity, parent: null, edge: null });
      });

      it('should limit and trim vertex names', function(){
        var vertex1 = g.AddVertex('ABCDEFGHIJKLMN');
        var vertex2 = g.AddVertex('     ABCD     ');
        expect(vertex1.name).to.have.length(10);
        expect(vertex2.name).to.have.length(4);
      });

      it('should not add repeated vertex names', function(){
        var vertex1 = g.AddVertex('test');
        var vertex2 = g.AddVertex('test');
        expect(vertex1).to.be.equal(vertex2);
      });
    })
  });

  context('#Edge', function() {

  });

  context('#Graph', function() {

  });
});
