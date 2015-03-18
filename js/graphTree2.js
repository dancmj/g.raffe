Array.prototype.each = function (callback) {
    for (var i = 0; i < this.length; i++) {
        callback.call(this[i], this[i], i);
    };
    };
    Array.prototype.where = function (callback) {
        var arr = [];
        for (var i = 0; i < this.length; i++) {
            if (callback.call(this[i], this[i])) {
                arr.push(this[i]);
            }
        }
        return arr;
    };
    Array.prototype.whereFirst = function (callback) {
        for (var i = 0; i < this.length; i++) {
            if (callback.call(this[i], this[i])) {
                return this[i];
            }
        }
        return null;
    };
    Array.prototype.whereFirstIndex = function (callback) {
        for (var i = 0; i < this.length; i++) {
            if (callback.call(this[i], this[i],i)) {
                return i;
            }
        }
    };
    Array.prototype.any=function (fun){
        for (var i=0; i<this.length; i++){
            if( (typeof(fun)=='function' && fun.call(this,this[i])) || fun==this[i]){
                return true;
            }
        };
        return false;
    };
    Array.prototype.max = function() {
      return Math.max.apply(null, this);
    };
    Array.prototype.min = function() {
      return Math.min.apply(null, this);
};

function BinaryHeap(scoreFunction){
    this.content = [];
    this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
    push: function(element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to bubble up.
        this.bubbleUp(this.content.length - 1);
    },
    pop: function() {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it sink down.
        if (this.content.length > 0) {
          this.content[0] = end;
          this.sinkDown(0);
        }
        return result;
    },
    remove: function(node) {
        var length = this.content.length;
        // To remove a value, we must search through the array to find
        // it.
        for (var i = 0; i < length; i++) {
            if (this.content[i] != node){ 
                continue;
            }
            // When it is found, the process seen in 'pop' is repeated
            // to fill up the hole.
            var end = this.content.pop();
            // If the element we popped was the one we needed to remove,
            // we're done.
            if (i == length - 1) {
                break;
            }
            // Otherwise, we replace the removed element with the popped
            // one, and allow it to float up or sink down as appropriate.
            this.content[i] = end;
            this.bubbleUp(i);
            this.sinkDown(i);
            break;
        }
    },
    size: function() {
        return this.content.length;
    },
    bubbleUp: function(n) {
        // Fetch the element that has to be moved.
        var element = this.content[n], score = this.scoreFunction(element);
        // When at 0, an element can not go up any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            var parentN = Math.floor((n + 1) / 2) - 1,
            parent = this.content[parentN];
            // If the parent has a lesser score, things are in order and we
            // are done.
            if (score >= this.scoreFunction(parent)){
                break;
            }

            // Otherwise, swap the parent with the current element and
            // continue.
            this.content[parentN] = element;
            this.content[n] = parent;
            n = parentN;
        }
    },
    sinkDown: function(n) {
        // Look up the target element and its score.
        var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);

        while(true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) * 2, child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N],
                child1Score = this.scoreFunction(child1);
                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore){
                  swap = child1N;
                }
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N],
                child2Score = this.scoreFunction(child2);
                if (child2Score < (swap == null ? elemScore : child1Score)){
                  swap = child2N;
                }
            }

            // No need to swap further, we are done.
            if (swap == null) {
                break;
            }

            // Otherwise, swap and continue.
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
        }
    } 
};

function Vertex(n){
    this.name = n+"";
    this.adjacents=[];
    this.distance=0;
    this.maxFlow="none";
    this.minFlow=0;
    this.tag={key:Infinity,parent:null,edge:null};
    this.color=-1;
};

function Edge(source,sink,cost,flow,maxFlow,minFlow){
    this.source = source;
    this.sink = sink;
    this.cost = cost || 0;
    this.minFlow = !minFlow || minFlow < 0 ? 0 : minFlow;
    this.maxFlow = !maxFlow ? Infinity : maxFlow < this.minFlow ? this.minFlow : maxFlow;
    this.flow = !flow || flow < 0 ? 0 : flow > this.maxFlow ? this.maxFlow : flow;
    this.redge = null;
    this.fake = false;  
    this.color = -1;
};

function Graph(){
    this.vertexList=[];
    this.edgeList=[];
    this.directed=true;
    this.matrix = [];
};
Graph.prototype = {
    ContainsVertex: function(name) {
        return (this.vertexList.length != 0 && this.vertexList.any(function(node){ return node.name == name;}));
    },
    FindVertex: function(name) {
        return (this.vertexList.whereFirst(function(node) {
            if(node.name == name){
                return node;
            }
        }));
    },
    AddVertex: function(name) {
        if(this.ContainsVertex(name)){
            return this.FindVertex(name);
        }
        this.vertexList.push(new Vertex(name));
        return this.vertexList[this.vertexList.length-1];
    },
    RemoveVertex: function(name) {
        if(!this.ContainsVertex(name)){
            return false;
        }
        var nodeErase = this.FindVertex(name),that=this;

        for (var x = this.vertexList.length - 1; x >= 0; x--) {
            var node = this.vertexList[x];
            for (var y = node.adjacents.length - 1; y >= 0; y--) {
                var edge = node.adjacents[y];
                if(edge.sink.name == nodeErase.name){
                    this.RemoveEdge(edge.source.name,nodeErase.name);
                }else if(node.name == nodeErase.name){
                    this.RemoveEdge(nodeErase.name,edge.sink.name)
                }
            };
        };
        this.vertexList.splice(this.vertexList.whereFirstIndex(function(obj){
            return obj.name == name;
        }),1);

        return true;
    },
    FuseDiffuseVertex: function(node,choice) {
        if(choice=="Diffuse"){
            var node_clone = this.AddVertex(node.name+"_/Clone");
            node.clone = node_clone;
            for (var x = node.adjacents.length - 1; x >= 0; x--) {
                var edge = node.adjacents[x];
                if(!edge.fake){
                    this.AddEdge(node_clone.name,edge.sink.name,edge.cost,edge.flow,edge.maxFlow,edge.minFlow);
                    this.RemoveEdge(edge.source.name,edge.sink.name);
                };
            };
            this.AddEdge(node.name,node_clone.name,0,0,node.maxFlow,node.minFlow);
        }else if(choice=="Fuse"){
            var node_clone = node.clone,that=this;
            this.RemoveEdge(node.name,node_clone.name);
            node_clone.adjacents.each(function(edge){
                that.AddEdge(node.name,edge.sink.name,edge.cost,edge.flow,edge.maxFlow,edge.minFlow);
            });
            this.RemoveVertex(node_clone.name);
        }
    },
    AddEdge: function(source,sink,cost,flow,maxFlow,minFlow) {
        // console.log(maxFlow);
        if( !source || !sink || sink == source){
            return false;
        }
        source = this.AddVertex(source);
        sink = this.AddVertex(sink);

        for (var x = 0; x < source.adjacents.length && !source.adjacents[x].fake; x++) {
            if(source.adjacents[x].sink.name == sink.name ){
                return false;
            };
        };

        edge = new Edge(source,sink,cost,flow,maxFlow,minFlow);
        redge = new Edge(sink,source,Infinity,0,0,minFlow);
        redge.fake = true;
        edge.redge = redge;
        redge.redge = edge;
        source.adjacents.push(edge);
        sink.adjacents.push(redge);
        this.edgeList.push(edge);
        return this.edgeList[this.edgeList.length-1]; ///MODDED FROM TRUE to REFERENCE
    },
    FindEdge: function(source,sink){
        return (this.edgeList.whereFirst(function(edge) {
            if(edge.source.name==source && edge.sink.name==sink){
                return edge;
            }
        }));
    },
    ContainsEdge: function(source,sink){
        source = this.FindVertex(source);
        sink = this.FindVertex(sink);
        return ((source.adjacents.length!=0) 
            && (source.adjacents.any(function(edge) {
                return !edge.fake && edge.sink.name==sink.name;
            })
        ));
    },
    RemoveEdge: function(source,sink) {
        source = this.FindVertex(source);
        sink = this.FindVertex(sink);
        if(!source || !sink || sink.name == source.name || !this.ContainsEdge(source.name,sink.name)){
            return false;
        }
        for (var x = source.adjacents.length - 1; x >= 0; x--) {
            var edge = source.adjacents[x];
            if(edge.sink.name == sink.name && !edge.fake){
                edge.redge = undefined;
                source.adjacents.splice(x,1);
                break;
            };    
        };
        for (var x = sink.adjacents.length - 1; x >= 0; x--) {
            var edge = sink.adjacents[x];
            if(edge.sink.name == source.name && edge.fake){
                edge.redge = undefined;
                sink.adjacents.splice(x,1);
                break;
            };    
        };

        for (var x = this.edgeList.length - 1; x >= 0; x--) {
            var edge = this.edgeList[x];
            if(edge.source.name == source.name && edge.sink.name == sink.name){
                this.edgeList.splice(x,1);
                break;
            }
        };
        return true;
    },
    //////////////////////////////////////////////////////////
    IsBipartite: function() {
        if(this.vertexList.length===0){
            return false;
        }

        var startNode = this.FindVertex(this.vertexList[0].name);
        startNode.color = 1;

        var queue=[], result=true;
        queue.push(startNode);

        while(queue.length>0 && result){
            var u = queue.shift();

            u.adjacents.where(function(obj){
                return !obj.fake;
            }).each(function(edge){
                if(edge.sink.color == -1){
                    edge.sink.color = 1 - u.color;
                    queue.push(edge.sink);
                }else if(edge.sink.color == u.color){
                    result = false;
                }
            });
        };
        return result;
    },
    BFS: function(startNode) {
        startNode = this.FindVertex(startNode);
        if(!startNode){
            return false;
        }
        startNode.color = "gray";
        var queue = [],that=this;
        queue.push(startNode);
        while(queue.length>0){
            var u=queue.shift();

            u.adjacents.each(function(edge){
                if(edge.sink.color == -1 && !(edge.fake&&that.directed)){
                    edge.color="blue";
                    edge.redge.color="blue";
                    edge.sink.distance = u.distance+1;
                    edge.sink.color = "gray";
                    queue.push(edge.sink);
                }
            });
            u.color="black";
        };
        return true;
    },
    DFSi: function(startNode) {
        startNode = this.FindVertex(startNode);
        if(!startNode){
            return false;
        };   

        var flag=false,x=1,stack=[];
        stack.push(startNode);
        var w=stack[0];
        w.color="black";

        while(stack.length>=0 && this.vertexList.length!=x && w!=undefined){
            for (var i = 0; i < w.adjacents.length; i++) {
                var edge = w.adjacents[i];
                if(edge.sink.color===-1 && !(edge.fake && this.directed)){
                    edge.sink.color = "black"; //discovered.
                    edge.sink.distance+=w.distance+1;
                    edge.color = "blue";
                    edge.redge.color="blue";

                    stack.push(edge.sink);

                    w=edge.sink;
                    flag = true;
                    x++;
                    break;
                };
                flag=false;
            };
            if(!flag){
                w=stack.pop();
            };
        };
        return true;
    },
    DFSr: function(startNode) {
        var current= this.FindVertex(startNode), that=this;
        if(!current){
            return false;
        }

        current.color="gray";
        current.adjacents.each(function(edge){
            if(edge.sink.color === -1 && !(edge.fake && that.directed)){
                edge.color="blue";
                edge.redge.color="blue";
                edge.sink.distance=current.distance+1;
                that.DFSr(edge.sink.name);
            }
        });
        return true;
    },
    PRIM: function(startNode) {
        startNode = this.FindVertex(startNode);
        if(!startNode){
            return false;
        }; 

        startNode.tag.key = 0;
        var heap = new BinaryHeap(function(node){return node.tag.key;}),that=this;
        heap.push(startNode);

        while(heap.content.length>0){
            u=heap.pop();
            u.color="black";
            u.adjacents.where(function(e){
                return !(e.fake && that.directed);
            }).each(function(edge){
                if(edge.fake){
                    edge.cost=edge.redge.cost;
                }
                if(edge.sink.color!="black" && edge.cost < edge.sink.tag.key){
                    edge.sink.tag={key: edge.cost ,parent: u,edge: edge};
                    heap.push(edge.sink);
                }
            });
        }

        this.vertexList.where(function(e){
            return e.tag.edge!=null;
        }).each(function(node){
            node.tag.edge.color="blue";
            node.tag.edge.redge.color="blue";
        })  

        return true;
    },
    Kruskal: function() {
        if(this.edgeList.length===0 || this.vertexList.length===0){ return; };

        var counter = 0,heap=new BinaryHeap(function(edge){return edge.cost;});

        this.edgeList.each(function(edge){
            heap.push(edge);
        });
        this.vertexList.each(function(node,i){
            node.color=i;
        });
        while(heap.length!=0 && counter != this.vertexList.length-1){
            var e = heap.pop();
            if(e.source.color!=e.sink.color){
                colorH=e.sink.color;
                e.color="blue";
                this.vertexList.each(function(node){ //change colors
                    if(node.color==colorH){
                        node.color=e.source.color;
                    };
                });
                counter++;
            }
        }
    },
    Dijkstra: function(startNode,endNode){
        startNode = this.FindVertex(startNode);
        endNode = this.FindVertex(endNode);
        if(!startNode || !endNode){
            return false;
        }; 
        this.directed=true;
        startNode.tag.key = 0;
        var heap = new BinaryHeap(function(node){return node.tag.key;}),that=this,path=[];
        heap.push(startNode);

        while(heap.content.length!=0){
            var u=heap.pop();
            u.color="black";

            u.adjacents.where(function(e){
                return !e.fake;
            }).each(function(edge){
                if(edge.sink.color!="black" && edge.cost < edge.sink.tag.key){
                    edge.sink.tag={key: edge.cost + u.tag.key,parent: u,edge: edge};
                    edge.sink.distance=u.distance+1;
                    heap.push(edge.sink);
                };
            });
        };

        var p=endNode;
        while(p!=undefined){ //color the path from endNode to startNode.
            path.unshift(p);
            if(p.tag.edge!=undefined){
                p.tag.edge.color="blue";
            }
            p=p.tag.parent;
        }

        heap=new BinaryHeap(function(edge){return edge.cost;}); //Heap with the edges that weren't used.
        this.edgeList.each(function(edge){ //Check if there are unused edges.
            if(edge.color!="blue"){
                heap.push(edge); //push non-used edge to heap.
            }else{
                edge.color=-1; //If edge wasn't used, reset color.
            }
        });

        while(heap.content.length>0){ //while the heap isn't empty.
            var e = heap.pop();
            if(e.cost + e.source.tag.key < e.sink.tag.key){ //If the cost will be less than the sink's key.
                if(e.sink.distance < e.source.distance){ /////There maybe a negCycle
                    var nm=e.source.distance-e.sink.distance,tmp_src=e.source,counter=0,cyclePath="";
                    for (var i = 0; i < nm; i++) {
                        cyclePath+=tmp_src.name+" -> ";
                        counter+=tmp_src.tag.edge.cost;
                        if(tmp_src.tag.parent==e.sink){
                            counter+=e.cost;
                            cyclePath+=e.sink.name;
                            console.log("neg_cycle",counter,cyclePath); //negative cycle found.
                            return false;//Return false, there is a negative cycle therefore no solution.
                        }
                        tmp_src=tmp_src.tag.parent;
                    };
                }
                //No negcycles, add the edge to the graph and change all of the children.
                e.sink.tag.edge.color=-1; //Revert previous edge to parent color.
                e.sink.tag={key: e.cost + e.source.tag.key, parent: e.source, edge: e};
                var stack=[];
                stack.push(e.sink);

                while(stack.length>0){////vertex stack to check children's tags.
                    var u = stack.pop();

                    u.adjacents.where(function(_edge){
                        return !_edge.fake;
                    }).each(function(edge){
                        if(edge.sink.tag.parent==u){
                            stack.push(edge.sink);
                            edge.sink.distance=edge.source.distance+1;
                            edge.sink.tag={key: edge.cost + edge.source.tag.key, parent: edge.source, edge: edge};
                        }
                    });
                }
            }
        }

        p=endNode;
        while(p!=undefined){ //Once again, color from endNode to startNode.
            path.unshift(p);
            if(p.tag.edge!=undefined){
                p.tag.edge.color="blue";
            }
            p=p.tag.parent;
        }

        return true;
    },
    Matrix: function() {
        var nodes=this.vertexList,that=this;
        this.matrix = [];

        for (var i = 0; i < nodes.length; i++) {
            this.matrix[nodes[i].name]=[];
            for (var j = 0; j < nodes.length; j++) {
                this.matrix[nodes[i].name][nodes[j].name]={ c:Infinity, p:null};
                var current = this.matrix[nodes[i].name][nodes[j].name];
                if(i==j){
                    current.c=0;
                }else{
                    this.edgeList.where(function(edge){
                            return edge.source.name == nodes[i].name && edge.sink.name == nodes[j].name;
                    }).each(function(element,indx){
                            current.c=element.cost;   
                            current.p=element.source.name;
                    });
                };
            };
        };

        return this.matrix;
    },
    FloydWarshall: function(){
        var m = this.Matrix(),that=this,cond=true,path=[];

        this.vertexList.each(function(vk,k){ if(!cond){return false};
            vk=vk.name;
            that.vertexList.each(function(vi,i){ if(!cond){return false};
                vi=vi.name;
                that.vertexList.each(function(vj,j){
                    vj=vj.name;

                    if( m[vi][vj].c > m[vi][vk].c + m[vk][vj].c){
                        m[vi][vj].c = m[vi][vk].c + m[vk][vj].c;
                        m[vi][vj].p = m[vk][vj].p;

                        if(vi==vj && m[vi][vj].c<0 ){
                            path.push([]);
                            var origin = vi,actual=m[vi][vj].p;
                            path[0].unshift(that.FindEdge(actual,origin));

                            while(actual!=null && origin!=actual){
                                path[0].unshift(that.FindEdge(m[origin][actual].p,actual));
                                actual=m[origin][actual].p;
                            }
                            return cond=false;
                        }
                    }
                });
            });
        });
        if(!cond){return path;}//Return negcycle path.

        this.vertexList.each(function(vi,i){
            vi=vi.name;
            that.vertexList.each(function(vj,j){
                vj=vj.name;

                if(m[vi][vj].p==null){ return false; } //only continue if ij.p != null

                path.push([]);

                var slot=path[path.length-1],origin=vi,actual=vj;

                while(origin!=actual && actual!=null){
                    slot.unshift(that.FindEdge(m[origin][actual].p,actual));
                    actual=m[origin][actual].p;
                    if(actual==null){ path.splice(path.length-1); }
                }
            });
        });
        return path; //Return path from all to all.
    },
    FordFulkerson: function(source,sink,limit) {
        if(source.length==0 || sink.length==0 || source.whereFirst(function(src){return sink.any(src);})){
            return 0;
        }
        this.directed=true;
        var superSource = this.AddVertex("_/SuperSource"),superSink = this.AddVertex("_/SuperSink");
        var that=this,cloneList=[],minList=[],maxFlow=0;
        limit=(function(){if(limit==undefined || limit <= 0){return Infinity;}else{return limit;};})();

        source.each(function(sourceNode,i) { //Adding supersource
            that.AddEdge(superSource.name,sourceNode);
        });
        sink.each(function(sinkNode,i) { //Adding supersink
            that.AddEdge(sinkNode,superSink.name,0,0,limit);
        });
        this.vertexList.where(function(node){ //Check if any node has restrictions.
            return node.maxFlow != "none" || node.minFlow>0;
            }).each(function(node){ //This node has Restrictions, create a clone.
                cloneList.push(node);
                that.FuseDiffuseVertex(node,"Diffuse");
        });

        this.edgeList.where(function(edge){
            return edge.minFlow>0;
        }).each(function(edge){
            minList.push({edge:edge,min:edge.minFlow});
        });

        if(minList.length>0){ //there is edges with minimum requirements.
            var apexSource = this.AddVertex("_/ApexSource"), nadirSink = this.AddVertex("_/NadirSink");
            var addedEdges = [],aux=false;

            minList.each(function(me){
                var edge=me.edge;
                if(addedEdges[edge.source.name]==undefined){
                    addedEdges[edge.source.name] = {apexCount:0,nadirCount:0};
                    addedEdges.push(edge.source.name);
                }
                if(addedEdges[edge.sink.name]==undefined){
                    addedEdges[edge.sink.name] = {apexCount:0,nadirCount:0};
                    addedEdges.push(edge.sink.name);
                }
                addedEdges[edge.sink.name].apexCount+=me.min;
                addedEdges[edge.source.name].nadirCount+=me.min; 
                edge.maxFlow-=me.min;
                edge.minFlow-=me.min;
            })
            //Add each missing apex & nadir edge
            addedEdges.each(function(e){ ///!!!!!!!!!!!!!!!!!!!!
                var info = addedEdges[e];
                if(info.apexCount>0){
                    that.AddEdge(apexSource.name,e,0,0,info.apexCount); //apexcount as maxFlow
                }
                if(info.nadirCount>0){
                    that.AddEdge( e,nadirSink.name,0,0,info.nadirCount); //nadirCount as maxFlow
                }

            });
            //Add from original source to original sink and vice versa
            that.AddEdge(superSink.name,superSource.name,0,0);
            that.AddEdge(superSource.name,superSink.name,0,0);

            that.MaxFlow(apexSource,nadirSink);

            apexSource.adjacents.each(function(edge){
                //Failsafe in case any of the apex's edge's aren't full.
                if(edge.flow<edge.maxFlow && !aux){
                    aux=true;
                    return false;
                };
            });
            that.RemoveVertex("_/ApexSource");
            that.RemoveVertex("_/NadirSink");
            //////////////////////////////////
            that.RemoveEdge(superSource.name,superSink.name);
            that.RemoveEdge(superSink.name,superSource.name);
            
            minList.each(function(me){//restore removed flow.
                var edge=me.edge;
                edge.maxFlow+=me.min;
                edge.minFlow+=me.min;
                edge.flow+=me.min;
            });
        }

        if(!aux){ //if there is no error.
            maxFlow = this.MaxFlow(superSource,superSink);
        }else{
            this.ResetGraph();
        };
        
        cloneList.where(function(node){ //Return restricted nodes back to normal.
            return node.clone!=undefined;
        }).each(function(node){         //This node had a restriction, join with clone.
            that.FuseDiffuseVertex(node,"Fuse");
            node.clone=undefined;
        });

        this.RemoveVertex("_/SuperSource");
        this.RemoveVertex("_/SuperSink");

        this.edgeList.where(function(edge){
            return edge.flow>0;
        }).each(function(edge){
            edge.color="blue";
        });

        return maxFlow;
    },
    MaxFlow: function(source,sink) {
        var path = this.AugmPath(source,sink,[]);
        while (path != undefined){
            var residuals = [];
            path.each(function(edge){
                residuals.push(edge.maxFlow-edge.flow);
            });
            var flow = residuals.min();
            path.each(function(edge){
                edge.flow += flow;
                edge.redge.flow -= flow;
            });
            path = this.AugmPath(source,sink,[]);
        }
        return (function(){
            var sum=0;
            source.adjacents.each(function(edge){
                sum += edge.flow;
            });
            return sum;
        })();
    },
    AugmPath: function(source,sink,path) {
        if(source==sink){
            return path;
        }

        var that=this,result;
        for (var x = 0; x < source.adjacents.length; x++) {
            var edge = source.adjacents[x], residual = edge.maxFlow - edge.flow;
            if(residual>0 && !path.any(edge) && !(edge.fake && this.directed)){   
                var clone = [];
                path.each(function(obj){
                    clone.push(obj);
                });
                clone.push(edge);

                result = this.AugmPath(edge.sink,sink,clone);
                if(result!=undefined){
                    return result;
                }
            }
        };
    },
    MinCostConstFlowFF: function(source,sink,limit){
        if(source.length==0 || sink.length==0 || source.whereFirst(function(src){return sink.any(src);})){
            return false;
        }
        this.directed=true;
        var superSource = this.AddVertex("_/SuperSource"),superSink = this.AddVertex("_/SuperSink");
        var that=this,cloneList=[],minList=[],maxFlow=0,aux=false;
        limit=(function(){if(limit==undefined || limit <= 0){return Infinity;}else{return limit;};})();

        source.each(function(sourceNode,i) { //Adding supersource
            that.AddEdge(superSource.name,sourceNode);
        });
        sink.each(function(sinkNode,i) { //Adding supersink
            that.AddEdge(sinkNode,superSink.name,0,0,limit);
        });
        this.vertexList.where(function(node){ //Check if any node has restrictions.
            return node.maxFlow != "none" || node.minFlow>0;
        }).each(function(node){ //This node has Restrictions, create a clone.
            cloneList.push(node);
            that.FuseDiffuseVertex(node,"Diffuse");
        });

        this.edgeList.where(function(edge){
            return edge.minFlow>0;
        }).each(function(edge){
            minList.push({edge:edge,min:edge.minFlow});
        });

        if(minList.length>0){ //there is edges with minimum requirements.
            var apexSource = this.AddVertex("_/ApexSource"), nadirSink = this.AddVertex("_/NadirSink");
            var addedEdges = [];

            minList.each(function(me){
                var edge=me.edge;
                if(addedEdges[edge.source.name]==undefined){
                    addedEdges[edge.source.name] = {apexCount:0,nadirCount:0};
                    addedEdges.push(edge.source.name);
                }
                if(addedEdges[edge.sink.name]==undefined){
                    addedEdges[edge.sink.name] = {apexCount:0,nadirCount:0};
                    addedEdges.push(edge.sink.name);
                }
                addedEdges[edge.sink.name].apexCount+=me.min;
                addedEdges[edge.source.name].nadirCount+=me.min; 
                edge.maxFlow-=me.min;
                edge.minFlow-=me.min;
            })
            //Add each missing apex & nadir edge
            addedEdges.each(function(e){ ///!!!!!!!!!!!!!!!!!!!!
                var info = addedEdges[e];
                if(info.apexCount>0){
                    that.AddEdge(apexSource.name,e,0,0,info.apexCount); //apexcount as maxFlow
                }
                if(info.nadirCount>0){
                    that.AddEdge( e,nadirSink.name,0,0,info.nadirCount); //nadirCount as maxFlow
                }

            });
            //Add from original source to original sink and vice versa
            that.AddEdge(superSink.name,superSource.name,0,0);
            that.AddEdge(superSource.name,superSink.name,0,0);

            that.MaxFlow(apexSource,nadirSink);

            apexSource.adjacents.each(function(edge){
                if(edge.flow<edge.maxFlow && !aux){
                    aux=true;
                    return false;
                };
            });
            that.RemoveVertex("_/ApexSource");
            that.RemoveVertex("_/NadirSink");
            that.RemoveEdge(superSource.name,superSink.name);
            that.RemoveEdge(superSink.name,superSource.name);
            
            minList.each(function(me){//restore removed flow.
                var edge=me.edge;
                edge.maxFlow+=me.min;
                edge.minFlow+=me.min;
                edge.flow+=me.min;
            });
        }

        if(!aux){ //if there is no error.
            this.MaxFlow(superSource,superSink);
        }else{
            this.ResetGraph();
        };
        //////////////////////////////////////////////
        var residualNetwork = this.ResidualGet(),resPaths=[];

        while(!aux && (function(){ //While the network has negcycles.
            resPaths=residualNetwork.FloydWarshall();
            return resPaths[0][0].source.name==resPaths[0][resPaths[0].length-1].sink.name; //There exists a negcycle.
            
            })()){

            var d = (function(){ 
                var min=Infinity;
                resPaths[0].each(function(edge){
                    if(edge.maxFlow<min){
                        min=edge.maxFlow;
                    }
                }); 
                return min;
            })();
            
            resPaths[0].each(function(e){
                if(e.color=="1a"){
                    that.FindEdge(e.source.name,e.sink.name).flow+=d;
                }else{
                    that.FindEdge(e.sink.name,e.source.name).flow-=d;
                }
            });

            residualNetwork = that.ResidualGet();
        };


        ///////////////////////////////////////////////
        cloneList.where(function(node){ //Return restricted nodes back to normal.
            return node.clone!=undefined;
        }).each(function(node){         //This node had a restriction, join with clone.
            that.FuseDiffuseVertex(node,"Fuse");
            node.clone=undefined;
        });
        this.RemoveVertex("_/SuperSource");
        this.RemoveVertex("_/SuperSink");

        this.edgeList.where(function(edge){
            return edge.flow>0;
        }).each(function(edge){
            edge.color="blue";
        });

        return true;
    },
    //////////////////////////////////////////////////////////
    ResidualGet: function(){
        var residualNetwork=new Graph();
        this.edgeList.each(function(edge){ ///Create residual netwok.
            if(edge.flow<edge.maxFlow){    //If the edge's flow is lesser than maxFlow
                residualNetwork.AddEdge(edge.source.name,edge.sink.name, edge.cost,0,edge.maxFlow-edge.flow,0).color="1a";
            }
            if(edge.flow>edge.minFlow){
                residualNetwork.AddEdge(edge.sink.name,edge.source.name,-edge.cost,0,edge.flow-edge.minFlow,0).color="2a";
            }
        })
        return  residualNetwork;
    },
    JSONify: function() {
        var nodes=[],edges=[];

        this.vertexList.each(function(node,i){
            nodes.push({id: node.name
                /*
                ,index: i
                ,d: node.distance
                ,tag: (function(){ 
                    if(node.tag.parent){
                        return node.tag.parent.name;
                    }else{
                        return null;
                    };
                })()
                */
            });
        });

        this.edgeList.each(function(edge){
            edges.push({
                source:(function(){
                return nodes.whereFirstIndex(function(node,i){ //WHere FIrst INDEX, to revert.
                    return node.id==edge.source.name;
                });//.name
            })(),target:(function(){
                return nodes.whereFirstIndex(function(node,i){
                    return node.id==edge.sink.name;
                });//.name
            })(),cost: edge.cost
                , min: edge.minFlow
                ,flow: edge.flow
                , max: (function(){if(edge.maxFlow!=Infinity){return edge.maxFlow;}else{return "∞";}})()  
                , color: (function(){if(edge.color!="blue"){return "link";}else{return "link_path";}})()
                , total: edge.cost*edge.flow
            });
        });
        return {nodes: nodes, links: edges};
    },
    ResetGraph: function(){
        this.vertexList.each(function(vertex){
            vertex.color=-1;
            vertex.tag={key:Infinity,parent:null,edge:null};
            vertex.distance=0;
        });
        this.edgeList.each(function(edge){
            edge.flow=0;
            edge.color=-1;
            edge.redge.flow=0;
            edge.redge.color=-1;
        });
    }
};

var g = new Graph();
g.AddEdge("A","Z");
g.AddEdge("A","B");
g.AddEdge("B","C");
g.AddEdge("A","C");
g.AddEdge("A","D");
g.AddEdge("A","X");
g.RemoveEdge("A","C");





//////////////////////////////