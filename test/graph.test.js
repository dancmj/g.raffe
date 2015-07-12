var Graffe = require('../public/assets/js/graph/graffe.BE.js');

describe('#graph.js', function() {
  var graffe = new Graffe();
  var testGraph;

  beforeEach(function() {
    testGraph = graffe.newGraph();
  });

  context('#Vertex', function() {
    describe('construction', function() {
      it('should create a new vertex with default values', function() {
        expect(true).to.be.true;
      });
    })
  });

  context('#Edge', function() {

  });

  context('#Graph', function() {

  });
});
