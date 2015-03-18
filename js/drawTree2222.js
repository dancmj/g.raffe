var graph = new Graph();
graph.directed=document.getElementById("chckDirected").checked;

//////////////////////////
var w = $("#CanvasSection").width(),
    h = 500;

var color = d3.scale.category10();

var vis = d3.select("#CanvasSection")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "svg")
        .attr("pointer-events", "all")
        .attr("viewBox", "0 0 " + w + " " + h)
//            .attr("perserveAspectRatio", "xMinYMid")
        .append('svg:g');

var force = d3.layout.force();

var nodes = force.nodes(),
        links = force.links();



var update =function(){

  var link = vis.selectAll("path")
          .data(links, function (d,i) {
              return d.source.id + "-" + d.target.id;
          });     

  link.enter().append("path")
          .attr("id", function (d,i) {
              return d.source.id + "-" + d.target.id;
          })
          .attr("stroke-width", function (d) {
              // return 0
              return 10;
          })
          .attr({//"class":"link",
          "class":function(d,i){
                  return d.color;  
          }
          ,"marker-end": function(d,i){
            return "url(#" + d.source.id + "-" + d.target.id +"end" + ")";
          }
  }) ;

  var arrow = vis.selectAll("marker")
    .data(links, function (d,i) {
              return d.source.id + "-" + d.target.id;
          });
  arrow.enter().append("svg:marker")    
    .attr("id", function(d,i){
            return  d.source.id + "-" + d.target.id +"end";
          })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 20)
    .attr("refY", -1.1)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");


  var linktext = vis
    .selectAll("g.linklabelholder")
    .data(links, function (d,i) {
              return d.source.id + "-" + d.target.id;
          });
    
  linktext.enter().append("svg:g")
      .attr("class", "linklabelholder")
    .append("text")
      .attr("class", "linkLabel")
      .style("font-size", "13px")
      .attr("x", "30")
      .attr("y", "-10")
      .attr("text-anchor", "start")
       .style("fill","#000")
    .append("textPath")
      .attr("xlink:href",function(d) { return "#"+d.source.id + "-" + d.target.id;})
      .text(function(d) { 
      return "$"+d.cost+ "["+d.min+","+d.flow+","+d.max+"]";  //+ "["+d.minFlow+","+d.flow+","d.maxFlow+"]";
    });

  linktext.exit().remove();
  link.exit().remove();


  var node = vis.selectAll("g.node")
          .data(nodes, function (d) {
              return d.id;
          });

  var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .call(force.drag);

  nodeEnter.append("svg:circle")
          .attr("r", 12)
          .attr("id", function (d) {
              return "Node;" + d.id;
          })
          .attr("class", "nodeStrokeClass")
          .attr("fill", function(d) { return color(d.id); });

  nodeEnter.append("svg:text")
          .attr("class", "nodeText")
          // .attr("x", 0)
          // .attr("y", "0em")
          .attr({
              "alignment-baseline": "middle"
              ,"text-anchor": "middle"
          })
          .text(function (d) {
              return d.id;
          });

  node.exit().remove();
  force.on("tick", function () {

      node.attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
      });

      link.attr("d", function(d) {
          var dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = Math.sqrt(dx * dx + dy * dy);
          return "M" + 
              d.source.x + "," + 
              d.source.y + "A" + 
              dr + "," + dr + " 0 0,1 " + 
              d.target.x + "," + 
              d.target.y;
      });
      linktext.attr("transform", function(d) {
              return "translate(" + ((d.source.x + d.target.x)/5000) + "," 
                                  + ((d.source.y + d.target.y)/5000) + ")"; });
  });
  force
      .gravity(.1)
      .charge(-2500)
      // .friction(0)
      .linkDistance( function(d) { return d.value * 10 } )
      .size([w, h])
      .start();
  keepNodesOnTop();
};

update();
d3.select("#btnReset").on("click",function(){
  links.splice(0);
  update();
  graph.ResetGraph();
  graph.JSONify().links.each(function(obj,i){
  links.push({color:obj.color
              ,cost:obj.cost
              ,flow:obj.flow
              ,max:obj.max
              ,min:obj.min
              ,value: /*obj.cost+*/10
              ,source:nodes[obj.source]
              ,target:nodes[obj.target]});
  });
  update();
});
d3.select("#btnAddVertex").on("click",function(){
  if(!graph.ContainsVertex(document.getElementById("boxVertex").value)){
    graph.AddVertex(document.getElementById("boxVertex").value);
    var info = graph.JSONify().nodes;
    nodes.push(info[info.length-1]);
    update();
  };
});
d3.select("#btnRemoveVertex").on("click",function(){
  var id=document.getElementById("boxVertex").value;
  if(graph.RemoveVertex(id)){
    for (var x = links.length - 1; x >= 0; x--) {
      if(links[x].source.id==id || links[x].target.id==id){
        links.splice(x,1);
      };
    };

    for (var x = nodes.length - 1; x >= 0; x--) {
      if(nodes[x].id==id){
        nodes.splice(x,1);
        break;
      }
    };
    update();
  };
});
d3.select("#btnAddEdge").on("click",function(){
  if(!graph.ContainsVertex(document.getElementById("boxEdge2").value)){
    graph.AddVertex(document.getElementById("boxEdge2").value);
    var info = graph.JSONify().nodes;
    nodes.push(info[info.length-1]);
    update();
  };
  if(!graph.ContainsVertex(document.getElementById("boxEdge1").value)){
    graph.AddVertex(document.getElementById("boxEdge1").value);
    var info = graph.JSONify().nodes;
    nodes.push(info[info.length-1]);
    update();
  };
  if(!graph.ContainsEdge(document.getElementById("boxEdge1").value,document.getElementById("boxEdge2").value)){
    graph.AddEdge(document.getElementById("boxEdge1").value,document.getElementById("boxEdge2").value);
    var obj = graph.JSONify().links;
    obj=obj[obj.length-1]
    links.push({color:obj.color
              ,cost:obj.cost
              ,flow:obj.flow
              ,max:obj.max
              ,min:obj.min
              ,value: /*obj.cost+*/10
              ,source:nodes[obj.source]
              ,target:nodes[obj.target]});
    update();
  };
});
d3.select("#btnRemoveEdge").on("click",function(){
    if(graph.RemoveEdge(document.getElementById("boxEdge1").value,document.getElementById("boxEdge2").value)){
      var info = graph.JSONify().links;
      for (var x = 0; x < links.length; x++) {
        if(info[x]==undefined || !(links[x].source.id==nodes[info[x].source].id && links[x].target.id==nodes[info[x].target].id)){
          links.splice(x,1);
        };
      };
      update();
    }
});
d3.select("#chckDirected").on("click",function(){
  graph.directed=document.getElementById("chckDirected").checked;
});



d3.select("#btnBFS").on("click",function(){
  runAlgorithm("BFS");
});
d3.select("#btnDFSi").on("click",function(){
  runAlgorithm("DFSi");
});
d3.select("#btnDFSr").on("click",function(){
  runAlgorithm("DFSr");
});
d3.select("#btnPRIM").on("click",function(){
  runAlgorithm("PRIM");
});
d3.select("#btnKRUSKAL").on("click",function(){
  runAlgorithm("Kruskal");
});
d3.select("#btnDIJKSTRA").on("click",function(){
  runAlgorithm("Dijkstra");
});
d3.select("#btnFORDF").on("click",function(){
  runAlgorithm("FordF");
});
d3.select("#btnMCCF").on("click",function(){
  runAlgorithm("MCCFFF");
});
function runAlgorithm(choice){
  var id=document.getElementById("boxRoot").value;
  if(choice=="Kruskal" || choice=="FordF" ||choice=="MCCF"|| graph.ContainsVertex(id)){
    links.splice(0);
    update();
    graph.ResetGraph();

    switch(choice){
      case "BFS":
        graph.BFS(id);
        break;
      case "DFSi":
        graph.DFSi(id);
        break;
      case "DFSr":
        graph.DFSr(id);
        break;
      case "Kruskal":
        graph.Kruskal();
        break;
      case "PRIM":
        graph.PRIM(id);
        break;
      case "Dijkstra":
        document.getElementById("chckDirected").checked=true;
        graph.Dijkstra(id,document.getElementById("boxDest").value);
        break;
      case "FordF":
        document.getElementById("chckDirected").checked=true;
        graph.FordFulkerson(
          id.split(","),
          document.getElementById("boxDest").value.split(",")
          ,document.getElementById("boxLimit").value.split(",")
        );
        break;
      case "MCCFFF":
        document.getElementById("chckDirected").checked=true;
        graph.MinCostConstFlowFF(
          id.split(",")
          ,document.getElementById("boxDest").value.split(",")
          ,document.getElementById("boxLimit").value
        );
        break;
    }

    graph.JSONify().links.each(function(obj,i){
        links.push({color:obj.color
                  ,cost:obj.cost
                  ,flow:obj.flow
                  ,max:obj.max
                  ,min:obj.min
                  ,value: /*obj.cost+*/10
                  ,source:nodes[obj.source]
                  ,target:nodes[obj.target]});
    });

    update();
  }
}

function keepNodesOnTop() {
    $(".nodeStrokeClass").each(function( index ) {
        var gnode = this.parentNode;
        gnode.parentNode.appendChild(gnode);
    });
}
function updateWindow(){
    w=$("#CanvasSection").width()
};
window.onresize = updateWindow;