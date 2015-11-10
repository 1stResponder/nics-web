/*
 * Copyright (c) 2008-2015, Massachusetts Institute of Technology (MIT)
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
define(['ext', 'iweb/CoreModule', './WindowController', './DatalayerBuilder'], 

	function(Ext, Core, DatalayerController, DatalayerBuilder){
	
		return Ext.define('modules.datalayer.MapsController', {
			extend : 'modules.datalayer.WindowController',
			
			alias: 'controller.datalayer.mapscontroller',
			
			onCreateTree: function() {
				this.callSuper(arguments);
				
				//set the first item selected
				var first = this.getView().getTree().getRootNode().getChildAt(0);
				if (first != null) {
					first.set("checked", true);
					this.activateLayer(first);
				}
			},

			/**
			 * Override DatalayerController to handle item check events
			 */
			onDatalayerCheck: function( node, checked, eOpts ){
				//turn data layer on/off
				if(checked){
					this.uncheckOtherNodes(node);
					this.activateLayer(node);
				} else {
					//if we are unchecked and none others are checked, recheck
					var checked = this.getView().getTree().getChecked();
					if (checked.length === 0) {
						node.set("checked", true);
					}
				}
			},
			
			/**
			 * walk the tree and uncheck all nodes except the one provided
			 */
			uncheckOtherNodes: function(checkedNode){
				var root = this.getView().getTree().getRootNode();
				root.cascadeBy({
					after: function(node){
						if (node !== checkedNode) {
							node.set("checked", false);
						}
					}
				});
			},
			
			/**
			 * Activate the specified node as the base layer
			 */
			activateLayer: function(node) {
				//attempt to build a layer and set it as the base layer
				var layer = this.datalayerBuilder.buildLayer(
					node.data.layerType, node.data);
				if (layer) {
					Core.Ext.Map.setBaseLayer(layer);
				}
			}
		});
});
