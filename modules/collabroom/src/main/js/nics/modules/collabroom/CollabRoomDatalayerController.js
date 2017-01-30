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
define(['ext', 'iweb/CoreModule','nics/modules/UserProfileModule','nics/modules/datalayer/DatalayerBuilder',
        './CollabRoomDatalayerModel'],
		function(Ext, Core, UserProfile, DatalayerBuilder){
	
	return Ext.define('modules.collabroom.CollabRoomDatalayerController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.collabroomdatalayercontroller',
		
		activeRooms : [],
		
		collabRoomListenerIds: [],

		init: function(){
			this.mediator = Core.Mediator.getInstance();
			
			this.tokenHandlerTopic = "nics.datalayer.token.collabroomlayer";
			
			this.datalayerBuilder = Ext.create('modules.datalayer.builder');

			Core.EventManager.addListener("nics.collabroom.close", this.onCloseCollabRoom.bind(this));
			Core.EventManager.addListener("nics.collabroom.activate", this.onActivateCollabRoom.bind(this));
			Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
			Core.EventManager.addListener("nics.collabroom.data.select", this.selectRoomForLayer.bind(this));
			Core.EventManager.addListener("nics.collabroom.data.add", this.onAddLayerToRoom.bind(this));
			Core.EventManager.addListener(this.tokenHandlerTopic, this.addSecureLayer.bind(this));
		},
		
		selectRoomForLayer: function(evt, layer){
			if(this.activeRooms.length == 0){
				Ext.MessageBox.alert("Room Error", "Please join a collaboration room.");
				return;
			}
			
			if(this.activeRooms.length > 1){
			
				var store = Ext.create('Ext.data.Store', {
				    fields: ['collabRoomId', 'collabRoomName'],
				    data : this.activeRooms
				});
			
				
				var window = new Ext.Window({
					title: 'Collabroom Datalayer',
					referenceHolder: true,
					closeAction: 'hide',
					reference: 'collabRoomWindow',
					resizable: false,
					items: {
						xtype: 'combo',
						reference: 'collabRoomCombo',
						queryModel: 'local',
						valueField: 'collabRoomId',
						displayField: 'collabRoomName'
					},
					buttons: [{ 
						text: 'Add',
						handler: function() {
							var record = window.lookupReference('collabRoomCombo').getSelection();
							this.addLayerToRoom(record.get('collabRoomId'), layer.datalayerid);
							window.close();
						},
						scope: this
					}]
				});	

				
				var combo = window.lookupReference('collabRoomCombo');
				combo.getStore().removeAll();
				combo.bindStore(store);
				combo.select(combo.getStore().getAt(0));
				
				window.show();
			}
			else {
				this.addLayerToRoom(this.activeRooms[0].collabRoomId,layer.datalayerid);
			}
			
		},
		
		addLayerToRoom: function(collabRoomId, dataLayerId) {
			
			var url = Ext.String.format("{0}/datalayer/{1}/collabroom/{2}/{3}?username={4}",
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId(), collabRoomId, dataLayerId,UserProfile.getUsername());
			var event = 'nics.collabroom.data.add';

			this.mediator.sendPostMessage(url, event);

		},
		
		onAddLayerToRoom: function(evt, response){
			if(response && response.message != "ok"){
				Ext.MessageBox.alert("Status","Failed: " + response.message);
			}
		},
		
		onCellClick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts){
	 		if(cellIndex == 1){
	 			if(record.get('view') == true){
	 				record.set("view", false);
	 				record.get("layer").setVisible(false);
	 			}else{
		 			record.set("view", true);
	 				record.get("layer").setVisible(true);
	 			}
	 		}
	 	},

	 	onNewLayer: function(evt, layer){
	 		
	 		var store = this.getView().getStore();
	 		var layerProps = this.buildDataLayer(layer.datalayer);
			var newLayer = this.datalayerBuilder.buildLayer(
					layerProps.layerType, layerProps);
					
			if(newLayer){
				if(layer.collabroomid != this.currentCollabRoomId){
					newLayer.setVisible(false);
				}
				
				this.addNewLayer(newLayer, 
						layerProps.datasourceid, layerProps.datalayerid, 
						layerProps.refreshrate, layerProps.secure);
			}
			
			store.add({
				datalayerId: layer.datalayerid,
				collabroomId: layer.collabroomid,
				displayname: layer.datalayer.displayname,
				view: true,
				layer: newLayer
			});
			
			store.load();
	
	 	},
	 	
	 	onRemoveLayer: function(evt, layers){
	 	
	 		var store = this.getView().getStore().getDataSource();

	 		for(var i = 0; i < layers.length; i++){
		 		for(var j = 0; j < store.getCount(); j++){
		 			if(layers[i].datalayerid == store.getAt(j).get('datalayerId') && layers[i].collabroomid == store.getAt(j).get('collabroomId')){
		 				Core.Ext.Map.removeLayer(store.getAt(j).get('layer'));
		 				store.removeAt(j);
		 			}
	 			}
	 		}
	 		
	 		store.load();
	 	},	
	 	
	 	onActivateCollabRoom: function(e, collabRoomId, readOnly, collabRoomName) {
	 		//Turn off current layers
	 		this.updateLayers(false);
	 		var contained = false;
	 		
	 		for(var i = 0; i < this.activeRooms.length; i ++){
	 			if(this.activeRooms[i].collabRoomName == collabRoomName){
	 				contained = true;
	 			}
	 		}
	 		
	 		if(collabRoomId != "myMap" && !contained){
				
				//request layers
				var url = Ext.String.format("{0}/datalayer/{1}/collabroom/{2}",
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId(), collabRoomId);
				var eventName = Core.Util.generateUUID();
				
				Core.EventManager.createCallbackHandler(eventName, this, this.onLoadLayers, [collabRoomId]);
				this.mediator.sendRequestMessage(url, eventName);
				
				this.activeRooms.push({'collabRoomId': collabRoomId, 'collabRoomName': collabRoomName});
				
				var topicAdd = Ext.String.format('iweb.NICS.collabroom.{0}.datalayer.new',collabRoomId);
				var topicRemove = Ext.String.format('iweb.NICS.collabroom.{0}.datalayer.delete',collabRoomId);
				
				if(this.collabRoomListenerIds.indexOf(collabRoomId) == -1){
					
					Core.EventManager.addListener(topicAdd, this.onNewLayer.bind(this));
					Core.EventManager.addListener(topicRemove, this.onRemoveLayer.bind(this));
				
					this.collabRoomListenerIds.push(collabRoomId);	
				}
				
				this.mediator.subscribe(topicAdd);
				this.mediator.subscribe(topicRemove);
				
			}else{
				var store = this.getView().getStore();
				store.filter('collabroomId', collabRoomId);
				//Turn collabroom layers back on
				this.updateLayers(true);
			}
			
			this.currentCollabRoomId = collabRoomId;
		},
		
		updateLayers: function(view){
			var records = this.getView().getStore().getData();
			for(var i=0; i<records.count(); i++){
				var record = records.getAt(i);
				if(record.data.layer){
					if(record.data.layer){
						if(!view || (view && record.data.view)){
							record.data.layer.setVisible(view);
						}
					}
				}
			}
		},
	
		onLoadLayers : function(collabRoomId, e, response){
			var store = this.getView().getStore();
			var dataLayerArray = [];
			var i = 0;
			
			Ext.Array.forEach(response.datalayers, function(layer){
				var layerProps = this.buildDataLayer(layer);
				var newLayer = this.datalayerBuilder.buildLayer(
						layerProps.layerType, layerProps);
				if(newLayer){
					this.addNewLayer(newLayer, 
							layerProps.datasourceid, layerProps.datalayerid, 
							layerProps.refreshrate, layerProps.secure);
				}
				dataLayerArray.push({
					datalayerId: layer.datalayerid,
					collabroomId: collabRoomId,
					displayname: layer.displayname,
					view: true,
					layer: newLayer
					
				});
			
			}, this);
			
			var records = this.getView().getStore().getData();
			store.loadRawData(dataLayerArray,true);
			store.filter('collabroomId', collabRoomId);
		},
		
		onCloseCollabRoom: function (e, menuItem) {
			
			for(var i = 0; i < this.activeRooms.length; i++){
				if(this.activeRooms[i].collabRoomId == menuItem.collabRoomId){
					Ext.Array.erase(this.activeRooms,i,1);
				}
			}
			
			var store = this.getView().getStore();
			var records = store.getData();
			records.each(function(record){
				if(record.data.collabroomId == menuItem.collabRoomId){
					Core.Ext.Map.removeLayer(record.data.layer);
					store.remove(record);
				}
			});
		},
		
		onJoinIncident: function(e, incident){
			//reset the activeRooms
			this.activeRooms = [];

			//clear the grid
			this.getView().getStore().removeAll();
		},
		
		addSecureLayer: function(event, layerObj){
			this.addNewLayer(layerObj.layer, layerObj.datasourceid,
					layerObj.datalayerid, layerObj.refreshRate, true);
		},
		
		addNewLayer: function(layer, datasourceid, datalayerid, refreshrate, secure){
			if(secure){
				//Add the layer once we have a token
				var token = TokenManager.getToken(datasourceid, {
					topic: tokenHandlerTopic,
					params: {
						layer: layer,
						datasourceid: datasourceid,
						datalayerid: datalayerid,
						refreshrate: refreshrate
					}
				});
				
				if(!token){ return; }
			}
			
			if(layer.refreshrate){
				RefreshLayerManager.addLayer(
						refreshrate, datalayerid, 
						layer, datasourceid);
			}
			Core.Ext.Map.addLayer(layer);
		},
		
		buildDataLayer: function(layer) {

			var props = {
				id: layer.datalayerid,
				text: layer.displayname,
				layerType: layer.datalayersource.datasource.datasourcetype.typename,
				url: layer.datalayersource.datasource.internalurl,
				layername: layer.datalayersource.layername,
				attributes: layer.datalayersource.attributes,
				opacity: layer.datalayersource.opacity,
				refreshrate: layer.datalayersource.refreshrate
			};
			
			//Need to add this to API endpoint
			if(layer.secure){
				props.secure = true;
				props.datasourceid = layer.datalayersource.datasource.datasourceid;
			}
			
			return props;
		},
		
		onRemoveButtonClick: function(){
			var records = this.view.getSelection();
			
			if(records.length > 0) {
			
				var collabDataLayers = [];
				
				for(var i = 0; i < records.length; i ++){
					collabDataLayers.push( { 'collabroomid':records[i].get('collabroomId'), 'datalayerid':records[i].get('datalayerId') });
				}
				
				var url  = Ext.String.format("{0}/datalayer/{1}/collabroom/",
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId());
				
				var topic = 'nics.collabroom.data.remove';
				
				this.mediator.sendPostMessage(url,topic,collabDataLayers);
				
			}
		}
	});
});
