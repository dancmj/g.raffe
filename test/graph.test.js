var Graffe = require('../public/assets/js/graph/graffe.BE.js');

describe('#giraffe.js', function() {
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
        expect(vertex.color).to.equal(-1);
        expect(vertex.tag).to.deep.equal({
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
      it('should return true if vertex is found', function(){
        var vertexAFound = g.FindVertex('A');
        expect(vertexAFound).to.be.ok;
      });
      it('should return false if vertex isn\'t found', function(){
        var vertexBFound = g.FindVertex('B');
        expect(vertexBFound).to.be.false;
      });
      it('should return false if parameters are invalid', function(){
        var vertexFound = g.FindVertex();
        expect(vertexFound).to.be.false;
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
        expect(edge.color).to.equal(-1);
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
      it('should change tag to default value if tag is invalid', function() {
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
    describe('#IsBipartite()', function(){
      var isBipartite;
      it('should return true if graph is empty', function(){
        isBipartite = g.IsBipartite();
        expect(isBipartite).to.be.true;
      });
      it('should return true if graph is Bipartite', function(){
        g.AddVertex('A');
        g.AddEdge('B', 'A');
        g.AddEdge('C', 'A');
        g.AddEdge('C', 'D');
        g.AddEdge('D', 'B');
        isBipartite = g.IsBipartite();
        expect(isBipartite).to.be.true;
      });
      it('should return false if graph isn\'t Bipartite', function(){
        g.AddVertex('A');
        g.AddEdge('B', 'A');
        g.AddEdge('C', 'A');
        g.AddEdge('C', 'B');
        isBipartite = g.IsBipartite();
        expect(isBipartite).to.be.false;
      });
    });
    describe('#BreadthFirstSearch()', function(){
      it('should return false if start vertex is not found', function(){
        var successfulBFS = g.BFS('M');
        expect(successfulBFS, 'Breadth First Search success').to.be.false;
      });
      context('Undirected Graph', function(){
        it('should create a tree if BFS is completed successfully', function(){
          var edgeAB = g.AddEdge('A', 'B'),//
              edgeAE = g.AddEdge('A', 'E'),//    A - B   C - D
              edgeBF = g.AddEdge('B', 'F'),//    |   | / | / |   GRAPH
              edgeCD = g.AddEdge('C', 'D'),//    E   F - G - H
              edgeCG = g.AddEdge('C', 'G'),
              edgeCF = g.AddEdge('C', 'F'),
              edgeDH = g.AddEdge('D', 'H'),//    1 - 0   2 - 3
              edgeDG = g.AddEdge('D', 'G'),//    |   | / | / |  EXPECTED
              edgeFG = g.AddEdge('F', 'G'),//    2   1 - 2 - 3  DISTANCE
              edgeGH = g.AddEdge('G', 'H');
          g.directed = false;

          var successfulBFS = g.BFS('B');
          expect(successfulBFS).to.be.true;
          expect(g.FindVertex('A').distanceFromRoot, 'vertex A distance').to.equal(1);
          expect(g.FindVertex('B').distanceFromRoot, 'vertex B distance').to.equal(0);
          expect(g.FindVertex('C').distanceFromRoot, 'vertex C distance').to.equal(2);
          expect(g.FindVertex('D').distanceFromRoot, 'vertex D distance').to.equal(3);
          expect(g.FindVertex('E').distanceFromRoot, 'vertex E distance').to.equal(2);
          expect(g.FindVertex('F').distanceFromRoot, 'vertex F distance').to.equal(1);
          expect(g.FindVertex('G').distanceFromRoot, 'vertex G distance').to.equal(2);
          expect(g.FindVertex('H').distanceFromRoot, 'vertex H distance').to.equal(3);

          expect(g.FindVertex('A').color, 'vertex A color').to.equal('black');
          expect(g.FindVertex('B').color, 'vertex B color').to.equal('black');
          expect(g.FindVertex('C').color, 'vertex C color').to.equal('black');
          expect(g.FindVertex('D').color, 'vertex D color').to.equal('black');
          expect(g.FindVertex('E').color, 'vertex E color').to.equal('black');
          expect(g.FindVertex('F').color, 'vertex F color').to.equal('black');
          expect(g.FindVertex('G').color, 'vertex G color').to.equal('black');
          expect(g.FindVertex('H').color, 'vertex H color').to.equal('black');

          expect(edgeAB.color, 'edge A - B').to.equal('path');
          expect(edgeAE.color, 'edge A - E').to.equal('path');
          expect(edgeBF.color, 'edge B - F').to.equal('path');
          expect(edgeCD.color, 'edge C - D').to.equal('path');
          expect(edgeCG.color, 'edge C - G').to.equal(-1);
          expect(edgeCF.color, 'edge C - F').to.equal('path');
          expect(edgeDH.color, 'edge D - H').to.equal(-1);
          expect(edgeDG.color, 'edge D - G').to.equal(-1);
          expect(edgeFG.color, 'edge F - G').to.equal('path');
          expect(edgeGH.color, 'edge G - H').to.equal('path');
        });
      });
      context('Directed Graph', function(){
        it('should create a tree if BFS is completed successfully', function(){
          var edgeAB = g.AddEdge('A', 'B'),
              edgeAE = g.AddEdge('A', 'E'),//    A > B   C < D
              edgeBF = g.AddEdge('B', 'F'),//    v   v   v   ^   GRAPH
              edgeDC = g.AddEdge('D', 'C'),//    E   F > G > H
              edgeCG = g.AddEdge('C', 'G'),
              edgeHD = g.AddEdge('H', 'D'),//    0 - 0   5 - 4
              edgeGH = g.AddEdge('G', 'H'),//    |   |   |   |  EXPECTED
              edgeFG = g.AddEdge('F', 'G');//    0   1 - 2 - 3  DISTANCE
          g.directed = true;

          var successfulBFS = g.BFS('B');
          expect(successfulBFS).to.be.true;
          expect(g.FindVertex('A').distanceFromRoot,'vertex A distance').to.equal(0);
          expect(g.FindVertex('B').distanceFromRoot,'vertex B distance').to.equal(0);
          expect(g.FindVertex('C').distanceFromRoot,'vertex C distance').to.equal(5);
          expect(g.FindVertex('D').distanceFromRoot,'vertex D distance').to.equal(4);
          expect(g.FindVertex('E').distanceFromRoot,'vertex E distance').to.equal(0);
          expect(g.FindVertex('F').distanceFromRoot,'vertex F distance').to.equal(1);
          expect(g.FindVertex('G').distanceFromRoot,'vertex G distance').to.equal(2);
          expect(g.FindVertex('H').distanceFromRoot,'vertex H distance').to.equal(3);

          expect(g.FindVertex('A').color, 'vertex A color').to.equal(-1);
          expect(g.FindVertex('B').color, 'vertex B color').to.equal('black');
          expect(g.FindVertex('C').color, 'vertex C color').to.equal('black');
          expect(g.FindVertex('D').color, 'vertex D color').to.equal('black');
          expect(g.FindVertex('E').color, 'vertex E color').to.equal(-1);
          expect(g.FindVertex('F').color, 'vertex F color').to.equal('black');
          expect(g.FindVertex('G').color, 'vertex G color').to.equal('black');
          expect(g.FindVertex('H').color, 'vertex H color').to.equal('black');

          expect(edgeAB.color, 'edge A - B').to.equal(-1);
          expect(edgeAE.color, 'edge A - E').to.equal(-1);
          expect(edgeBF.color, 'edge B - F').to.equal('path');
          expect(edgeDC.color, 'edge D - C').to.equal('path');
          expect(edgeCG.color, 'edge C - G').to.equal(-1);
          expect(edgeHD.color, 'edge H - D').to.equal('path');
          expect(edgeGH.color, 'edge G - H').to.equal('path');
          expect(edgeFG.color, 'edge F - G').to.equal('path');
        });
      });
    });
    describe('#DepthFirstSearch()', function(){
      it('should return false if startNode is not found', function(){
        var successfulDFS = g.DFS('A');
        expect(successfulDFS, 'Depth First Search success').to.be.false;
      });
      context('Undirected Graph', function(){
        it('should create a tree if DFS is completed successfully', function(){
          var edgeAB = g.AddEdge('A', 'B'),//
              edgeAE = g.AddEdge('A', 'E'),//    A - B   C - D
              edgeBF = g.AddEdge('B', 'F'),//    |   | / | / |   GRAPH
              edgeCD = g.AddEdge('C', 'D'),//    E   F - G - H
              edgeCG = g.AddEdge('C', 'G'),
              edgeCF = g.AddEdge('C', 'F'),
              edgeDH = g.AddEdge('D', 'H'),//    0 - 1   3 - 4
              edgeDG = g.AddEdge('D', 'G'),//    |   | / | / |  EXPECTED
              edgeFG = g.AddEdge('F', 'G'),//    1   2 - 6 - 5  DISTANCE
              edgeGH = g.AddEdge('G', 'H');
          g.directed = false;

          var successfulDFS = g.DFS('A');
          expect(successfulDFS, 'Depth First Search success').to.be.true;
          expect(g.FindVertex('A').distanceFromRoot, 'vertex A distance').to.equal(0);
          expect(g.FindVertex('B').distanceFromRoot, 'vertex B distance').to.equal(1);
          expect(g.FindVertex('C').distanceFromRoot, 'vertex C distance').to.equal(3);
          expect(g.FindVertex('D').distanceFromRoot, 'vertex D distance').to.equal(4);
          expect(g.FindVertex('E').distanceFromRoot, 'vertex E distance').to.equal(1);
          expect(g.FindVertex('F').distanceFromRoot, 'vertex F distance').to.equal(2);
          expect(g.FindVertex('G').distanceFromRoot, 'vertex G distance').to.equal(6);
          expect(g.FindVertex('H').distanceFromRoot, 'vertex H distance').to.equal(5);

          expect(g.FindVertex('A').color, 'vertex A color').to.equal('black');
          expect(g.FindVertex('B').color, 'vertex B color').to.equal('black');
          expect(g.FindVertex('C').color, 'vertex C color').to.equal('black');
          expect(g.FindVertex('D').color, 'vertex D color').to.equal('black');
          expect(g.FindVertex('E').color, 'vertex E color').to.equal('black');
          expect(g.FindVertex('F').color, 'vertex F color').to.equal('black');
          expect(g.FindVertex('G').color, 'vertex G color').to.equal('black');
          expect(g.FindVertex('H').color, 'vertex H color').to.equal('black');

          expect(edgeAB.color, 'Edge A - B').to.equal('path');
          expect(edgeAE.color, 'Edge A - E').to.equal('path');
          expect(edgeBF.color, 'Edge B - F').to.equal('path');
          expect(edgeCD.color, 'Edge C - D').to.equal('path');
          expect(edgeCG.color, 'Edge C - G').to.equal(-1);
          expect(edgeCF.color, 'Edge C - F').to.equal('path');
          expect(edgeDH.color, 'Edge D - H').to.equal('path');
          expect(edgeDG.color, 'Edge D - G').to.equal(-1);
          expect(edgeFG.color, 'Edge F - G').to.equal(-1);
          expect(edgeGH.color, 'Edge G - H').to.equal('path');
        });
      });
      context('Directed Graph', function(){
        it('should create a tree if DFS is completed successfully', function(){
          var edgeAB = g.AddEdge('A', 'B'),//
              edgeAE = g.AddEdge('A', 'E'),//    A > B   C > D
              edgeBF = g.AddEdge('B', 'F'),//    v   v   v   v   GRAPH
              edgeCD = g.AddEdge('C', 'D'),//    E   F > G > H
              edgeCG = g.AddEdge('C', 'G'),
              edgeDH = g.AddEdge('D', 'H'),//    0 - 1   0 - 0
              edgeGH = g.AddEdge('G', 'H'),//    |   |   |   |  EXPECTED
              edgeFG = g.AddEdge('F', 'G');//    1   2 - 3 - 4  DISTANCE
          g.directed = true;

          var successfulDFS = g.DFS('A');
          expect(successfulDFS, 'Depth First Search success').to.be.true;
          expect(g.FindVertex('A').distanceFromRoot, 'vertex A distance').to.equal(0);
          expect(g.FindVertex('B').distanceFromRoot, 'vertex B distance').to.equal(1);
          expect(g.FindVertex('C').distanceFromRoot, 'vertex C distance').to.equal(0);
          expect(g.FindVertex('D').distanceFromRoot, 'vertex D distance').to.equal(0);
          expect(g.FindVertex('E').distanceFromRoot, 'vertex E distance').to.equal(1);
          expect(g.FindVertex('F').distanceFromRoot, 'vertex F distance').to.equal(2);
          expect(g.FindVertex('G').distanceFromRoot, 'vertex G distance').to.equal(3);
          expect(g.FindVertex('H').distanceFromRoot, 'vertex H distance').to.equal(4);

          expect(g.FindVertex('A').color, 'vertex A color').to.equal('black');
          expect(g.FindVertex('B').color, 'vertex B color').to.equal('black');
          expect(g.FindVertex('C').color, 'vertex C color').to.equal(-1);
          expect(g.FindVertex('D').color, 'vertex D color').to.equal(-1);
          expect(g.FindVertex('E').color, 'vertex E color').to.equal('black');
          expect(g.FindVertex('F').color, 'vertex F color').to.equal('black');
          expect(g.FindVertex('G').color, 'vertex G color').to.equal('black');
          expect(g.FindVertex('H').color, 'vertex H color').to.equal('black');

          expect(edgeAB.color, 'Edge A - B').to.equal('path');
          expect(edgeAE.color, 'Edge A - E').to.equal('path');
          expect(edgeBF.color, 'Edge B - F').to.equal('path');
          expect(edgeCD.color, 'Edge C - D').to.equal(-1);
          expect(edgeCG.color, 'Edge C - G').to.equal(-1);
          expect(edgeDH.color, 'Edge D - H').to.equal(-1);
          expect(edgeFG.color, 'Edge F - G').to.equal('path');
          expect(edgeGH.color, 'Edge G - H').to.equal('path');
        });
      });
    });
    describe('#Prim\'s()', function(){
      it('should return false if vertex is not found', function(){
        var successfulPRIM = g.PRIM('K');
        expect(successfulPRIM, 'Prim\'s success').to.be.false;
      });
      it('should create a tree if completed successfully', function(){
        var edgeAB = g.AddEdge('A', 'B', {cost: 2});//
        var edgeAD = g.AddEdge('A', 'D', {cost: 1});//  A - B        |    A - B
        var edgeBD = g.AddEdge('B', 'D', {cost: 2});//    \ | GRAPH  |      \   EXPECTED
        var edgeCD = g.AddEdge('C', 'D', {cost: 3});//  C - D        |    C - D

        var successfulPRIM = g.PRIM('A');
        expect(successfulPRIM, 'Prim\'s success').to.be.true;
        expect(edgeAB.color, 'Edge A - B').to.equal('path');
        expect(edgeAD.color, 'Edge A - D').to.equal('path');
        expect(edgeBD.color, 'Edge B - D').to.equal(-1);
        expect(edgeCD.color, 'Edge C - D').to.equal('path');
      });
    });
    describe('#Kruskal\'s()', function(){
      // ae cd ab be bc ec ed
      // 1  2  3  4  5  6  7
      it('should return false if no vertices or edges exist', function(){
        var successfulKruskal = g.Kruskal();
        expect(successfulKruskal).to.be.false;
      });

    });
  });
});
