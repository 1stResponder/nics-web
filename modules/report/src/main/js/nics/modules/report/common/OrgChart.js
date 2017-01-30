/*
 * Copyright (c) 2008-2016, Massachusetts Institute of Technology (MIT)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
define(["iweb/CoreModule", "d3"],
    function(Core, d3)
    {
        var svg;

        return Ext.define('modules.report.OrgChart',
            {
                extend: "Ext.Component",
                alias: "widget.orgchart",

                initComponent: function()
                {
                   

                    this.callParent();
                },
                setData: function(data, horizontal){
                	var chartParams = [];
                	//The tree can be laid out either horizontally or vertically.  Set some parameters based on this
                	 hChartParams = {leftMargin:"100", width:"2000", height:"800", textYOpen: "-20", textYClosed:"-20", textDx:"0em", textDy:"-1.35em"};
                	 vChartParams = {leftMargin:"50",  width:"3000", height:"1200", textYOpen: "-30", textYClosed:"30", textDx:"0em", textDy:"0em"};
                	 chartParams = horizontal ? hChartParams : vChartParams;
                	
                	/* Sample data:
                	 * var data  =[ {role: "incidentCommander", name: "Person 1",position:"Incident Commander",agency:"Agency",parent: "null", light:#f5f5f5, dark:#b3b3b3},
    				{role: "sectionChiefs",position: "Ops Section Chief",name: "",agency:"",parent: "incidentCommander",light:#f5f5f5, dark:#b3b3b3},
    				{role: "icOfficers",position: "Public Information Officer",name: "Person 11",agency:"Agency",parent: "incidentCommander",light:"#f5f5f5", dark:"#b3b3b3"},
    				{role: "opsSectionChief",position: "Ops Section Chief",name: "Person 21",agency:"Agency",parent: "sectionChiefs",light:"#ffe6ea",dark:"#ff8095";}
    				
    			    
    				];*/
                	  
                    // convert array data to tree data by creating a  node map based on role
                   if (data){
                	 
                	    var dataMap = data.reduce(function (map, node) {
                        map[node.role] = node;
                        return map;
                	    }, {});

	                    // create the tree array
	                    var treeData = [];
	                    data.forEach(function (node) {
	                        // add to parent
	                        var parent = dataMap[node.parent];
	                        if (parent) {
	                            // create child array if it doesn't exist
	                            (parent.children || (parent.children = []))
	                            // add node to child array
	                			.push(node);
	                        } else {
	                            // parent is null or missing
	                            treeData.push(node);
	                        }
	                    });
	    			
	                	 if (svg != null)
	                     {
	                         d3.select("#" + this.id).selectAll("svg").remove();
	                     }
	                		// Generate the Org Chart
	             		var margin = ({top: 50, right: 50, bottom: 50, left: chartParams.leftMargin}),
	             			width = chartParams.width - margin.right - margin.left,
	             			height = chartParams.height - margin.top - margin.bottom;
	             		var i = 0,
	             			duration = 300,
	             			root;
	
	        		var tree = d3.layout.tree()
	        			.size([height, width]);
	
	        		// Use diagonal connectors
	        		var diagonal = d3.svg.diagonal()
	        			.projection(function(d) { 
	        				return horizontal ? [d.y, d.x] : [d.x, d.y]
	        				
	        			});
	             
	             	var svg = d3.select("#" + this.id).append("svg")
	                        .attr("width", width + margin.right + margin.left)
							.attr("height", height + margin.top + margin.bottom)
							.attr("class", "orgchart")
							.append("g")
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				             		 
	              
	            			root = data[0];
	            			root.x0 = 20;
	            			root.y0 = width / 2;
	            			
	            			// Collapse all nodes on start (or alter JSON so children = _children)
	            			var nodes = tree.nodes(root).reverse();
	            			nodes.forEach(function(d) {
	            				d._children = d.children;
	            				d.children = null;
	            			});
	            			
	            	update(root);	
	            			 
	             
	               d3.select(self.frameElement).style("width", "100px");
                   }//end of check for data
	       		function update(source) {
	
	       			// Compute the new tree layout
	       			var nodes = tree.nodes(root).reverse(),
	       				links = tree.links(nodes);
	       				
	       			// Normalize for fixed-depth (longer gives you longer branches)
	       			nodes.forEach(function(d) { 
	       				d.y = d.depth * 140; 
	       			});
	
	       			// Update the nodes
	       			var node = svg.selectAll("g.node")
	       				.data(nodes, function(d) { 
	       					return d.id || (d.id = ++i); 
	       				});
	
	       			// Enter any new nodes at the parent's previous position
	       			var nodeEnter = node.enter().append("g")
	       				.attr("class", "node")
	       				.attr("transform", function(d) { 
	       					return  horizontal ? "translate(" + source.y0 + "," + source.x0 + ")" : "translate(" + source.x0 + "," + source.y0 + ")"; 
	       				})
	       				.on("click", click);
	       			  
	       			nodeEnter.append("circle")
	       				 .attr("r", 1e-6)
	       				  .style("stroke", function(d) { return d.dark })
	       				 .style("fill", function(d) {return d._children ? d.light : "#fff";});
	       			    
	
	       				var text = nodeEnter.append("text")
	       				.attr("y", function (d) {
	       				    return d.children || d._children ? chartParams.textYOpen : chartParams.textYClosed;
	       				})
	       				.attr("dx", chartParams.textDx)
	       				.attr("dy", chartParams.textDy)
	       				.attr("text-anchor", "middle")
	       				.text(function (d) {
	       				    return d.name;
	       				})
	                       .style("border",1)
	
	       				.style("fill-opacity", 1);
	
	       				text.append("tspan")
	                       .attr("x", "0em")
	       				.attr("dy", "1.35em")
	       				.attr("text-anchor", "middle")
	       				.text(function (d) {
	       				 return d.position + " " + d.agency
	       				})
	
	       				
	       			// Transition nodes to their new position
	       			var nodeUpdate = node.transition()
	       				.duration(duration)
	       				.attr("transform", function(d) { 
	       					return horizontal ? "translate(" + d.y + "," + d.x + ")" : "translate(" + d.x + "," + d.y + ")"; 
	       				});
	
	                      nodeUpdate.select("circle")
	      				.attr("r", 10)
	      				.style("fill", function(d) { 
	      					return d._children ? d.light : "#fff"; 
	      				});
	
	
	       			nodeUpdate.select("text")
	       				.style("fill-opacity", 1);
	
	       			// Transition exiting nodes to the parent's new position
	       			var nodeExit = node.exit().transition()
	       				.duration(duration)
	       				.attr("transform", function(d) { 
	       					return horizontal ? "translate(" + source.y + "," + source.x + ")" : "translate(" + source.x + "," + source.y + ")"; 
	       				})
	       				.remove();
	
	       			nodeExit.select("circle")
					.attr("r", 1e-6);
	
	       			nodeExit.select("text")
	       				.style("fill-opacity", 1e-6);
	
	       			// Update the links
	       			var link = svg.selectAll("path.link")
	       				.data(links, function(d) { 
	       					return d.target.id; 
	       				});
	
	       			// Enter any new links at the parent's previous position
	       			link.enter().insert("path", "g")
	       				.attr("class", "link")
	       				.attr("d", function(d) {
	       					var o = {y: source.y0, x: source.x0};
	       					return diagonal({source: o, target: o});
	       				});
	
	       			// Transition links to their new position
	       			link.transition()
	       				.duration(duration)
	       				.attr("d", diagonal);
	
	       			// Transition exiting nodes to the parent's new position
	       			link.exit().transition()
	       				.duration(duration)
	       				.attr("d", function(d) {
	       					var o = {y: source.y, x: source.x};
	       					return diagonal({source: o, target: o});
	       				})
	       				.remove();
	
	       			// Save the old positions for transition
	       			nodes.forEach(function(d) {
	       				d.y0 = d.y;
	       				d.x0 = d.x;
	       			});
	       		}
	
	       		// Toggle children on click
	       		function click(d) {
	       			if (d.children) {
	       				d._children = d.children;
	       				d.children = null;
	       			} else {
	       				d.children = d._children;
	       				d._children = null;
	       			}
	       			update(d);
	       		}
	       		
	       		function collapseAll(){
	       			root.children.forEach(collapse);
	       			collapse(root);
	       			update(root);
	       		}
                	
             ////end of scipt 
               
            }
            });
    }
);
    