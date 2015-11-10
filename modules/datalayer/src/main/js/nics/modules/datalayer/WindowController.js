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
define(['ext', "iweb/CoreModule", "./DatalayerBuilder", 'nics/modules/UserProfileModule'], 

	function(Ext, Core, DatalayerBuilder, UserProfile){
	
		return Ext.define('modules.datalayer.WindowController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.datalayer.windowcontroller',
			
			init: function(){
				
				this.rootName = this.getView().rootName;
			    
			    this.mediator = Core.Mediator.getInstance();
			    
			    this.datalayerBuilder = Ext.create('modules.datalayer.builder');
			    
			    this.bindEvents();
			},
	 
			bindEvents: function(){
				//Bind UI Elements
				
				Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.onLoadUserProfile.bind(this));
				
				Core.EventManager.addListener("nics.data.newfolder." + this.rootName, this.onNewFolder.bind(this));
				this.mediator.subscribe("iweb.nics.data.newdatalayer." + this.rootName);
				Core.EventManager.addListener("iweb.nics.data.newdatalayer." + this.rootName, this.onNewDatalayer.bind(this));
				Core.EventManager.addListener("nics.data.loadfolder." + this.rootName, this.onLoadFolder.bind(this));
				Core.EventManager.addListener("nics.data.createtree." + this.rootName, this.onCreateTree.bind(this));
			},
			
			onLoadUserProfile: function(e){
				//Request Root Folder Data
				var url = Ext.String.format('{0}/folder/{1}/name/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId(), this.rootName);
				this.mediator.sendRequestMessage(url , 'nics.data.createtree.' + this.rootName);
			},
			
			onCreateTree: function(evt, data){
				this.getView().createRoot(data.rootId);
				this.onLoadFolder(evt, data);
				
				//Datalayer Tree
				this.getView().getTree().on("checkchange", this.onDatalayerCheck, this);
			},
			
			onLoadFolder: function(evt, data){
				//load the datalayers
				for(var i=0; i<data.datalayers.length; i++){
					var datalayer = data.datalayers[i];
					this.addDatalayer(data.rootId, datalayer);
				}
				
				//load folders
				for(var j=0; j<data.folders.length; j++){
					var folder = data.folders[j];
					var props = {
							folderid: folder.folderid
					};
					var node = this.getView().addChildNode(data.rootId, folder.foldername, false, props);
					node.on("expand", this.lazyLoadFolder, this);
				}
			},
			
			lazyLoadFolder: function(folder, opts){
				if(!folder.lazyLoaded){
					var url = Ext.String.format('{0}/folder/{1}/id/{2}', 
							Core.Config.getProperty(UserProfile.REST_ENDPOINT),
							UserProfile.getWorkspaceId(), folder.data.folderid);
					this.mediator.sendRequestMessage(url, 'nics.data.loadfolder.' + this.rootName);
					folder.lazyLoaded = true;
				}
			},
			
			onDatalayerCheck: function( node, checked, eOpts ){
				//turn data layer on/off
				if(checked){
					if(!node.data.layer){
						node.data.layer = this.datalayerBuilder.buildLayer(
								node.data.layerType,{
									url: node.data.url, 
									layername: node.data.layername
								});
						if(node.data.layer){
							Core.Ext.Map.addLayer(node.data.layer);
						}
					}else{
						node.data.layer.setVisible(true);
						Core.EventManager.fireEvent("layerVisible", node.data.layer);
					}
				}else{
					if(node.data.layer){
						node.data.layer.setVisible(false);
						Core.EventManager.fireEvent("layerInvisible", node.data.layer);
					}//throw exception - no layer found on the node
				}
			},
			
			onNewDatalayer: function(evt, data){
				if (data.datalayerfolders && data.datalayerfolders.length) {
					var parentFolder = data.datalayerfolders[0];
					this.addDatalayer(parentFolder.folderid, data);
				} else {
					var root = this.getView().getTree().getRootNode();
					this.addDatalayer(root.id, data);
				}
				
				
			},
			
			onNewFolder: function(evt, data){
				
			},
			
			addDatalayer: function(rootId, datalayer) {
				var props = {
						datalayerid: datalayer.datalayerid,
						layerType: datalayer.datalayersource.datasource.datasourcetype.typename,
						url: datalayer.datalayersource.datasource.internalurl,
						layername: datalayer.datalayersource.layername,
						attributes: datalayer.datalayersource.attributes
					};
				this.getView().addChildNode(rootId, datalayer.displayname, true, props);
			}
		});
});
