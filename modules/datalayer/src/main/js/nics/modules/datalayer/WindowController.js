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
define(['ext', "iweb/CoreModule", "./DatalayerBuilder", 
        'nics/modules/UserProfileModule',  "./RefreshLayerManager", "./TokenManager"],

	function(Ext, Core, DatalayerBuilder, UserProfile, RefreshLayerManager, TokenManager){
	
		var sharedContextMenu = new Ext.menu.Menu({});
	
		return Ext.define('modules.datalayer.WindowController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.datalayer.windowcontroller',
			
			init: function(){
				
				this.rootName = this.getView().rootName;
			    
			    this.mediator = Core.Mediator.getInstance();
			    
			    this.datalayerBuilder = Ext.create('modules.datalayer.builder');
			    
			    this.tokenHandlerTopic = "nics.datalayer.token." + this.rootName;
					
			    this.bindEvents();
			},
	 
			bindEvents: function(){
				var treeview = this.getView().getTree().getView();
				treeview.on("beforedrop", this.onBeforeTreeNodeDrop, this);
				treeview.on("nodedragover", this.onTreeNodeDragOver, this);
				treeview.on('afteritemexpand', this.lazyLoadFolder, this);
				
				//Bind UI Elements
				Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.onLoadUserProfile.bind(this));
				
				
				this.listenAndSubscribe(
					Ext.String.format('iweb.NICS.{0}.datalayer.new', UserProfile.getWorkspaceId()),
					this.onNewDatalayer);
					
				this.listenAndSubscribe(
					Ext.String.format('iweb.NICS.{0}.datalayer.update', UserProfile.getWorkspaceId()),
					this.onUpdateDatalayer);
					
				this.listenAndSubscribe(
					Ext.String.format('iweb.NICS.{0}.folder.new', UserProfile.getWorkspaceId()),
					this.onNewFolder);
					
				this.listenAndSubscribe(
					Ext.String.format('iweb.NICS.{0}.folder.update', UserProfile.getWorkspaceId()),
					this.onUpdateFolder);
					
				this.listenAndSubscribe(
					Ext.String.format('iweb.NICS.{0}.folder.delete', UserProfile.getWorkspaceId()),
					this.onDeleteFolder);
				
				this.listenAndSubscribe(
					Ext.String.format('iweb.NICS.datalayer.delete'),
					this.onDeleteDatalayer);
					
				this.listenAndSubscribe(
					Ext.String.format('iweb.NICS.datalayer.update', UserProfile.getWorkspaceId()),
					this.onRenameDatalayer);
				
				//local callback topics
				Core.EventManager.addListener("nics.data.loadfolder." + this.rootName, this.onLoadFolder.bind(this));
				Core.EventManager.addListener("nics.data.createtree." + this.rootName, this.onCreateTree.bind(this));
				Core.EventManager.addListener(this.tokenHandlerTopic, this.tokenHandler.bind(this));
			},
			
			listenAndSubscribe: function(topic, callback) {
				this.mediator.subscribe(topic);
				Core.EventManager.addListener(topic, callback.bind(this));
			},
			
			onLoadUserProfile: function(e){
				if(UserProfile.isSuperUser() || UserProfile.isAdminUser()){
					//add drag and drop support
					var treeview = this.getView().getTree().getView();
					treeview.addPlugin({
						ptype: 'treeviewdragdrop',
						containerScroll: true
					});
		    	}
				
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
				var store = this.getView().getTree().getStore();
				
				var folder = store.getNodeById(data.rootId);
				if (folder) {
					folder.lazyLoaded = true;
					folder.set("loading", false);
				}

				//load the datalayers
				data.datalayerfolders.forEach(function(layer){
					this.addDatalayerFolder(data.rootId, layer);
				}, this);
				
				//load folders
				data.folders.forEach(function(folder){
					var props = this.buildFolderModel(folder);
					this.getView().addChildNode(
						data.rootId, folder.foldername, false, props);
				}, this);
			},
			
			buildFolderModel: function(folder) {
				return {
					id: folder.folderid,
					folderid: folder.folderid,
					folderindex: folder.index,
					
					text: folder.foldername
				};
			},
			
			lazyLoadFolder: function(folder, opts){
				if(!folder.lazyLoaded){
					var url = Ext.String.format('{0}/folder/{1}/id/{2}',
							Core.Config.getProperty(UserProfile.REST_ENDPOINT),
							UserProfile.getWorkspaceId(), folder.data.folderid);
					this.mediator.sendRequestMessage(url, 'nics.data.loadfolder.' + this.rootName);
					
					folder.set("loading", true);
					folder.lazyLoaded = true;
				}
			},
			
			tokenHandler: function(evt, node){
				this.addNewLayer(node);
			},
			
			addNewLayer: function(node){
				if(node.data.secure){
					//Add the layer once we have a token
					var token = TokenManager.getToken(node.data.datasourceid, {
						topic: this.tokenHandlerTopic,
						params: node
					});
					
					if(!token){ return; }
				}
				
				if(node.data.refreshrate){
					RefreshLayerManager.addLayer(
							node.data.refreshrate, node.data.datalayerid, 
							node.data.layer, node.data.datasourceid);
				}
				Core.EventManager.fireEvent("nics.datalayer.legend.click", node.data);
				Core.Ext.Map.addLayer(node.data.layer);
			},
			
			showLayer: function(node){
				node.data.layer.setVisible(true);
				if(node.data.refreshrate){
					RefreshLayerManager.addLayer(
							node.data.refreshrate, node.data.datalayerid, 
							node.data.layer, node.data.datasourceid);
				}
				Core.EventManager.fireEvent("layerVisible", node.data.layer);
				Core.EventManager.fireEvent("nics.datalayer.legend.click", node.data);
			},
			
			hideLayer: function(node){
				node.data.layer.setVisible(false);
				Core.EventManager.fireEvent("layerInvisible", node.data.layer);
				Core.EventManager.fireEvent("nics.datalayer.legend.unclick", node.data);
				if(node.data.refreshrate){
					RefreshLayerManager.removeLayer(node.data.refreshrate, node.data.datalayerid);
				}
			},
			
			onDatalayerCheck: function( node, checked, eOpts ){
				//turn data layer on/off
				if(checked){
					if(!node.data.layer){
						node.data.layer = this.datalayerBuilder.buildLayer(
								node.data.layerType, node.data);
						if(node.data.layer){
							node.data.layer.set("dataTree", true);
						}
						
						this.addNewLayer(node);
					}else{
						this.showLayer(node);
					}
				}else{
					if(node.data.layer){
						this.hideLayer(node);
					}//throw exception - no layer found on the node
				}
			},
			
			addDatalayerFolder: function(rootId, datalayerfolder) {
				var props = this.buildDataLayerFolderModel(datalayerfolder);

				var datalayerOrgs = datalayerfolder.datalayer.datalayerOrgs;

				// If no organizations are set,
				// the user has access to the datalayer
				var hasAccess = true;

				if (datalayerOrgs && datalayerOrgs.length > 0)
				{
					// If any organizations are set,
					// then the user must be in one of them
					// to have access to the datalayer
					hasAccess = false;
					for (var i=0; i<datalayerOrgs.length; i++)
					{
						if (UserProfile.getOrgId() == datalayerOrgs[i].orgid) {
							hasAccess = true;
						}
					}
				}

				if (hasAccess) {
					return this.getView().addChildNode(rootId,
						datalayerfolder.datalayer.displayname, true, props);
				}
			},
			
			buildDataLayerFolderModel: function(datalayerfolder) {
				var datalayer = datalayerfolder.datalayer;
				
				var props = {
					id: datalayerfolder.datalayerfolderid,
					text: datalayer.displayname,
					
					datalayerfolderid: datalayerfolder.datalayerfolderid,
					folderindex: datalayerfolder.index,
					
					datalayerid: datalayer.datalayerid,
					layerType: datalayer.datalayersource.datasource.datasourcetype.typename,
					url: datalayer.datalayersource.datasource.internalurl,
					layername: datalayer.datalayersource.layername,
					attributes: datalayer.datalayersource.attributes,
					opacity: datalayer.datalayersource.opacity,
					legend: datalayer.legend,
					refreshrate: datalayer.datalayersource.refreshrate
				};
				
				if(datalayer.datalayersource.datasource.secure){
					props.secure = true;
					props.datasourceid = datalayer.datalayersource.datasource.datasourceid;
				}
				
				return props;
			},
			
			onNewDatalayer: function(evt, datalayerfolderData){
				var store = this.getView().getTree().getStore();
				var parentNode = store.getNodeById(datalayerfolderData.folderid);
				if (parentNode) {
					this.addDatalayerFolder(datalayerfolderData.folderid,
						datalayerfolderData);
					parentNode.sort();
				}
			},

			onUpdateDatalayer: function(evt, datalayerfolderData){
				var store = this.getView().getTree().getStore();
				var layerNode = store.getNodeById(datalayerfolderData.datalayerfolderid);
				if (layerNode) {
					this.handleMove(layerNode, datalayerfolderData);
					layerNode.set(this.buildDataLayerFolderModel(datalayerfolderData));
				} else {
					//we didn't have the original node, but we might have its new parent
					var parentNode = store.getNodeById(datalayerfolderData.folderid);
					if (parentNode && parentNode.lazyLoaded) {
						var newNode = this.addDatalayerFolder(
							datalayerfolderData.folderid, datalayerfolderData);
						newNode.remove();
						this.handleMove(newNode, datalayerfolderData);
					}
				}
			},
			
			onNewFolder: function(evt, folderData){
				var store = this.getView().getTree().getStore();
				var parentNode = store.getNodeById(folderData.parentfolderid);
				if (parentNode) {
					var props = this.buildFolderModel(folderData);
					var node = this.getView().addChildNode(
						folderData.parentfolderid, folderData.foldername, false, props);
				}
			},
			
			onUpdateFolder: function(evt, folderData){
				var store = this.getView().getTree().getStore();
				var folderNode = store.getNodeById(folderData.folderid);
				if (folderNode) {
					this.handleMove(folderNode, folderData);
					folderNode.set(this.buildFolderModel(folderData));
				} else {
					//we didn't have the original node, but we might have its new parent
					var parentNode = store.getNodeById(folderData.parentfolderid);
					if (parentNode && parentNode.lazyLoaded) {
						var props = this.buildFolderModel(folderData);
						var newNode = this.getView().addChildNode(
							folderData.parentfolderid, folderData.foldername, false, props);
						newNode.remove();
						this.handleMove(newNode, folderData);
					}
				}
			},
			
			onDeleteFolder: function(evt, folderId){
				var store = this.getView().getTree().getStore();
				var folderNode = store.getNodeById(folderId);
				if (folderNode) {
					folderNode.remove();
				}
			},
			
			onItemContextMenu: function(view, record, item, index, event) {
				event.stopEvent();
				//ensure the right clicked item is selectedItem
				view.setSelection(record);
				
				var isFolder = record.get("folderid") !== undefined;
				var isRootChild = record.parentNode && record.parentNode.isRoot();
				var isChecked = record.get("checked");
				
				var menuItems = [{
					text: 'Show Legend',
					handler: function() {
						Core.EventManager.fireEvent("nics.data.legend.show", record);
					},
					disabled: !record.get('legend')
					},{
					text: 'Add to Room',
					disabled : UserProfile.isReadOnly(),
					handler: function() {
						Core.EventManager.fireEvent("nics.collabroom.data.select", record.data);
					}	
				}];
				
				var datalayer = record.get("layer");
				if (isChecked && datalayer) {
					var opacity = datalayer.getOpacity() * 100;
					menuItems.push({
						xtype: 'slider',
						fieldLabel: 'Opacity',
						labelAlign: 'top',
						labelClsExtra: "x-menu-item-text-default",
						value: opacity,
						increment: 1,
						minValue: 1,
						maxValue: 100,
						tipText: function(thumb) {
							return Ext.String.format('{0}%', thumb.value);
						},
						listeners: {
							change: 'changeDatalayerOpacity',
							scope: this
						}
					});
				}
				
				if(UserProfile.isSuperUser() || UserProfile.isAdminUser()){
					menuItems.push({
							text: 'Folder Management',
							menu: {
							items: [{
								text: 'New',
								handler: 'newFolder',
								scope: this,
								//allow 'New' on root non-folders
								disabled: !(isFolder || isRootChild)
							},{
								text: 'Rename',
								handler: 'renameItem',
								scope: this
							},{
								text: 'Delete',
								handler: 'deleteItem',
								scope: this
							}]
						}
					});
				}
					
				//setup and show our shared menu
				sharedContextMenu.removeAll();
				sharedContextMenu.add(menuItems);
				sharedContextMenu.showAt(event.getXY());
			},
			
			onCallbackHandler: function(evt, response){
				if(response && response.message != "OK"){
					Ext.MessageBox.alert("Status", response.message);
				}
			},

			deleteItem: function() {
				var tree = this.getView().getTree(),
						record = tree.getSelection()[0],
						isFolder = record.get("folderid") !== undefined;
						
				if (isFolder) {
					this.deleteFolder();
				} else {
					this.deleteDatalayer();
				}
			},

			renameItem: function() {
				var tree = this.getView().getTree(),
						record = tree.getSelection()[0],
						isFolder = record.get("folderid") !== undefined;
						
				if (isFolder) {
					this.renameFolder();
				} else {
					this.renameDatalayer();
				}
			},

			changeDatalayerOpacity: function(slider, newValue){
				var tree = this.getView().getTree(),
						record = tree.getSelection()[0];
						
				if (record.data.layer) {
					record.data.layer.setOpacity(newValue / 100);
				}
			},

			newFolder: function() {
				var tree = this.getView().getTree(),
						record = tree.getSelection()[0];
				
				//add on non-folder adds to the parent
				if (record.get('folderid') === undefined) {
					record = record.parentNode;
				}
						
				Ext.Msg.prompt('New Folder', 'Please enter a new folder name:',
					function(btn, name){
						if (btn !== 'ok' || name.trim().length < 0) {
							return;
						}
						var url = Ext.String.format("{0}/folder/{1}/create",
								Core.Config.getProperty(UserProfile.REST_ENDPOINT),
								UserProfile.getWorkspaceId()
							);
						
						var topic = 'nics.data.newfolder.' + this.rootName;
						Core.EventManager.createCallbackHandler(topic, this, this.onCallbackHandler);
						
						this.mediator.sendPostMessage(
							url, topic, {
								foldername: name,
								parentfolderid: record.get('id')
							}
						);
					}, this);
			},

			renameFolder: function() {
				var tree = this.getView().getTree(),
						selection = tree.getSelection()[0];
						
				Ext.Msg.prompt('Rename Folder', 'Please enter a new folder name:',
					function(btn, name){
						if (btn !== 'ok' || name.trim().length < 0) {
							return;
						}
						var url = Ext.String.format("{0}/folder/{1}/update",
								Core.Config.getProperty(UserProfile.REST_ENDPOINT),
								UserProfile.getWorkspaceId()
							);
						
						var topic = 'nics.data.renamefolder.' + this.rootName;
						Core.EventManager.createCallbackHandler(topic, this, this.onCallbackHandler);
						
						this.mediator.sendPostMessage(
							url, topic, {
								foldername: name,
								folderid: selection.get('id'),
								parentfolderid: selection.parentNode.get('id'),
								index: selection.get('folderindex'),
							}
						);
					}, this);
			},

			deleteFolder: function() {
				var tree = this.getView().getTree(),
						selection = tree.getSelection()[0];
						
				Ext.MessageBox.confirm(
					'Delete Folder?',
					'Deleting this folder will delete all child folders and datalayers. Do you want to continue?',
					function(btn){
						if (btn !== 'yes') {
							return;
						}
						var url = Ext.String.format("{0}/folder/{1}/{2}",
								Core.Config.getProperty(UserProfile.REST_ENDPOINT),
								UserProfile.getWorkspaceId(),
								selection.get('id')
							);
						
						var topic = 'nics.data.deletefolder.' + this.rootName;
						Core.EventManager.createCallbackHandler(topic, this, this.onCallbackHandler);
						
						this.mediator.sendDeleteMessage(
							url, topic);
					}, this);
			},
			
			renameDatalayer: function(event, record){
				var selection = this.getView().getTree().getSelection()[0];
				
				Ext.Msg.prompt('Rename Datalayer', 'Please enter a new layer name:',
					function(btn, name){
						if (btn !== 'ok' || name.trim().length < 0) {
							return;
						}
						
						var url = Ext.String.format("{0}/datalayer/{1}/sources/layer/update",
								Core.Config.getProperty(UserProfile.REST_ENDPOINT),
								UserProfile.getWorkspaceId()
							);
						
						var topic = 'nics.data.renamedatalayer.' + this.rootName;
						Core.EventManager.createCallbackHandler(topic, this, this.onCallbackHandler);
						
						this.mediator.sendPostMessage(
							url, topic, {
								displayname: name,
								datalayerid: selection.get('datalayerid')
							}
						);
					}, this);
			},
			
			onRenameDatalayer: function(event, datalayer){
			
				var store = this.getView().getTree().getStore();
				var datalayerNode = store.findNode('datalayerid',datalayer.datalayerid);
				if(datalayerNode){
					datalayerNode.set('text',datalayer.displayname);
				}
				
			},
			
			
			deleteDatalayer: function(event, record){
				var selection = this.getView().getTree().getSelection()[0];

				Ext.MessageBox.confirm(
					'Delete Datalayer?',
					'Are you sure you want delete this datalayer?',
					function(btn){
						if (btn !== 'yes') {
							return;
						}
						var url = Ext.String.format("{0}/datalayer/{1}/sources/{2}/layer",
								Core.Config.getProperty(UserProfile.REST_ENDPOINT),
								UserProfile.getWorkspaceId(),
								selection.get('datalayerid')
							);
						
						var topic = 'nics.data.deletedatalayer.' + this.rootName;
						Core.EventManager.createCallbackHandler(topic, this, this.onCallbackHandler);
						
						this.mediator.sendDeleteMessage(
							url, topic);
					}, this);
				
			},
			
			onDeleteDatalayer: function(event, datalayerId){
				var store = this.getView().getTree().getStore();
				var datalayerNode = store.findNode('datalayerid',datalayerId);
				if (datalayerNode) {
					datalayerNode.remove();
				}
			},
			
			onTreeNodeDragOver: function (targetNode, position, dragData, e, eOpts) {
				var dragNode = dragData.records[0];
				//disallow dragging datalayer to folder, unless append
				if ( position !== "append" && targetNode.get("folderid") !== undefined &&
								dragNode.get("datalayerfolderid") !== undefined) {
					return false;
					
				//disallow dragging folder to datalayer
				} else if (targetNode.get("datalayerfolderid") !== undefined && dragNode.get("folderid") !== undefined) {
					return false;
				}
				return true;
			},
			
			getLikeFolderItems: function(item, items) {
				var attr = item.get("folderid") !== undefined ? "folderid" : "datalayerfolderid";
				
				return (items || []).filter(function(node){
					return node.get(attr) !== undefined && node !== item;
				});
			},
			
			onBeforeTreeNodeDrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
				var nodeModel = data.records[0],
						newParent, index;
				
				switch(dropPosition) {
					case "before":
						newParent = overModel.parentNode;
						index = overModel.get("folderindex");
						break;
					case "after":
						newParent = overModel.parentNode;
						index = overModel.get("folderindex") + 1;
						break;
					case "append":
						newParent = overModel;
						index = 1;
						var kids = this.getLikeFolderItems(nodeModel, overModel.childNodes);
						if (kids.length) {
							var lastKid = kids[kids.length -1];
							index = lastKid.get("folderindex") + 1;
						}
						break;
				}
				
				//if moving node down in same folder, account for its current index
				if (nodeModel.parentNode === newParent &&
						nodeModel.get("folderindex") < index) {
					index -= 1;
				}
				
				var parentFolderId = newParent.get("id"),
						queryParams = {
							index : index
						};
				
				var folderid = nodeModel.get("folderid");
				if (folderid) {
					queryParams.folderId = folderid;
				}
				
				var datalayerfolderid = nodeModel.get("datalayerfolderid");
				if (datalayerfolderid) {
					queryParams.datalayerfolderId = datalayerfolderid;
				}
				
				var url = Ext.String.format("{0}/folder/{1}/move/{2}?{3}",
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId(),
						parentFolderId,
						Ext.Object.toQueryString(queryParams)
					);
				
				var topic = 'nics.data.movefolder.' + this.rootName + Core.Util.generateUUID();
				Core.EventManager.createCallbackHandler(topic, this, this.onMoveCallback,
					[nodeModel, newParent, dropHandlers]);
				this.mediator.sendPostMessage(url, topic);
				dropHandlers.wait = true;
				data.view.setLoading("Saving");
			},
			
			onMoveCallback: function(movedNode, newParent, dropHandlers, evt, data){
				var oldParent = movedNode.parentNode,
						treeView = this.getView().getTree().getView();
				treeView.setLoading(false);
				//everything is in the right place, just update folder indexes
				if (data && data.count) {
					dropHandlers.processDrop();

					var oldIndex = movedNode.get("folderindex"),
							folderItems = [].concat(data.folders, data.datalayerfolders);
					
					if (folderItems.length) {
						folderItem = folderItems[0];
						
						//decrement folder indexes in old folder
						var oldSiblings = this.getLikeFolderItems(movedNode, oldParent.childNodes);
						this.adjustSiblingFolderIndexes(oldIndex, oldSiblings, -1);
					
						//increment folder indexes in new folder
						var newIndex = folderItem.index;
						var newSiblings = this.getLikeFolderItems(movedNode, newParent.childNodes);
						this.adjustSiblingFolderIndexes(newIndex, newSiblings, 1);
						
						//set new folder index
						movedNode.set({folderindex: newIndex});
						
						//sort to maintain node ordering
						newParent.sort();
					}
					
				} else {
					dropHandlers.cancelDrop();
				}
			},
			
			adjustSiblingFolderIndexes: function(index, siblings, offset){
				siblings.forEach(function(node){
					var layerIndex = node.get("folderindex");
					if (layerIndex >= index) {
						node.set("folderindex", layerIndex + offset);
					}
				});
			},
			
			handleMove: function(folderItemNode, folderItemData) {
				var store = this.getView().getTree().getStore(),
						oldIndex = folderItemNode.get("folderindex"),
						oldParent = folderItemNode.parentNode,
						newIndex = folderItemData.index,
						newParentId = folderItemData.parentfolderid || folderItemData.folderid,
						newParent = store.getNodeById(newParentId);
				
				//if the parent and index are correct, no move necessary
				var sameParent = oldParent && oldParent.get("id") === newParentId;
				if (sameParent && oldIndex === newIndex) {
					return;
				}
				
				if (oldParent && oldParent.lazyLoaded) {
					//decrement folder indexes in old folder
					var oldSiblings = this.getLikeFolderItems(folderItemNode, oldParent.childNodes);
					this.adjustSiblingFolderIndexes(oldIndex, oldSiblings, -1);
				}
				
				if (newParent && newParent.lazyLoaded) {
					//increment folder indexes in new folder
					var newSiblings = this.getLikeFolderItems(folderItemNode, newParent.childNodes);
					this.adjustSiblingFolderIndexes(newIndex, newSiblings, 1);
					
					//set new folder index
					folderItemNode.set({folderindex: newIndex});
					
					//append our node to its new parent
					newParent.appendChild(folderItemNode);
					
					//sort to maintain node ordering
					newParent.sort();
				} else {
					//if we don't have the new parent to move to, just remove
					folderItemNode.remove();
				}
			}
		});
});
