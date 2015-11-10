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
define(['ext', 'iweb/CoreModule', "ol", "nics/modules/UserProfileModule"], function(Ext, Core, ol, UserProfile){
	
	var format = new ol.format.WKT();
	var USER_TYPE = "user";
	var COLLABROOM_TYPE = "collabroom";
	var GEOMETRY_FIELD = "geometry";
	var OK_STATUS = "OK";
	
	return Ext.define('modules.feature.FeatureTopicListener', {
		
		constructor: function(featureType, id, user, userId) {
			this.layer = this.getNewDrawingLayer();
			
			this.id = id;
			
			this.featureType = featureType;
			
			this.username = user;
			
			this.mediator = Core.Mediator.getInstance();
			
			this.isActive = true;
			
			//Add new room drawing layer
			Core.Ext.Map.addLayer(this.layer);
			
			//Load features when room is initially open or on reconnect
			this.loadFeatureTopic = Ext.String.format('NICS.{0}.{1}.loadfeature', featureType, id);
			Core.EventManager.addListener(this.loadFeatureTopic, this.onLoadFeatures.bind(this));
			
			this.loadFeatureURL = Ext.String.format('{0}/features/{1}/{2}', 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					this.featureType, this.id);
			//no need to subscribe for the My Map instance since the features are not shared
			if(featureType != USER_TYPE){
				//New Features
				this.newFeatureTopic = Ext.String.format('iweb.NICS.collabroom.{0}.feature', id);
				//Delete Features
				this.deleteFeatureTopic = Ext.String.format('iweb.NICS.collabroom.{0}.deletefeature', id);
				//Changed Feature
				this.changeFeatureTopic = Ext.String.format('iweb.NICS.collabroom.{0}.changefeature', id);

				//Setting as new functions for removal
				this.newFeatureCallback = this.onNewFeatureFromMessage.bind(this);
				this.deleteFeatureCallback = this.onDeleteFeatureFromMessage.bind(this);
				this.changeFeatureCallback = this.onChangeFeatureFromMessage.bind(this);
				
				//Subscribe to the Client event manager
				Core.EventManager.addListener(this.newFeatureTopic, this.newFeatureCallback);
				Core.EventManager.addListener(this.deleteFeatureTopic, this.deleteFeatureCallback);
				Core.EventManager.addListener(this.changeFeatureTopic, this.changeFeatureCallback);
				
				//Send in userId to verify the User has permissions to view this room
				this.loadFeatureURL += "?userId=" + userId;
			}
			
			//Load the features for this instance
			this.mediator.sendRequestMessage(this.loadFeatureURL, this.loadFeatureTopic);
			
			//Handle reconnect
			Core.EventManager.addListener("iweb.connection.reconnected", this.handleReconnect.bind(this));
		},
		
		/** handle reconnect **/
		handleReconnect: function(evt, timeOfDisconnect){
			if(this.featureType != USER_TYPE){
				this.mediator.sendRequestMessage(this.loadFeatureURL + "&fromDate=" + timeOfDisconnect
						+ "&dateColumn=lastupdate", this.changeFeatureTopic);
			}
		},
		
		/** Enable this drawing source **/
		enable: function(readOnly){
			if(readOnly){
				Core.Ext.Map.setSource(null);
			}else{
				Core.Ext.Map.setSource(this.layer.getSource());
			}
			this.isActive = true;
			this.layer.setVisible(true);
		},
		
		/** Disable this drawing source **/
		disable: function(){
			this.isActive = false;
			this.layer.setVisible(false);
		},
		
		/** Load features onto the layer **/
		onLoadFeatures: function (e, response) {
			if(response.features){
				for(var i=0; i<response.features.length; i++){
					this.createFeature(response.features[i]);
				}
			}
		},
		
		/** New feature was added by another client **/
		onNewFeatureFromMessage: function(e, response){
			if(response.username != this.username
					|| response.topic === "share"){
				this.createFeature(response);
			}
		},
		
		/** Create a local instance of the feature**/
		createFeature: function(data){
			try{
				var feature = new ol.Feature({
				  geometry: format.readGeometry(data.geometry)
				});
			}catch(e){
				return;
			}
			
			var properties = {};
			for(var prop in data){
				//We have already set the geometry
				if(prop != GEOMETRY_FIELD){
					if(data[prop] != null){
						properties[prop] = data[prop]
					}
				}
			}
			
			if (properties.attributes && typeof properties.attributes === "string") {
				properties.attributes = JSON.parse(properties.attributes);
			}
			
			feature.persistChange = false;
			feature.setProperties(properties);
			feature.setId(data.featureId);
			
			
			//Add feature to the layer
			this.layer.getSource().addFeature(feature);
			feature.persistChange = true;
		},
		
		/** Persist if the feature is newly drawn **/
		onNewFeature: function(event){
			if(this.isActive && 
					event.feature && 
					!event.feature.getId()){ //If the feature is a new drawing it will not have an id assigned yet
				
				var feature = this.getFeature(event.feature);
				
				var url = Ext.String.format('{0}/features/{1}/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						this.featureType, this.id);
				
				var topic = "nics.collabroom.feature.create" + Core.Util.generateUUID();
				Core.EventManager.createCallbackHandler(topic, this, this.onCreateFeature, [event.feature]);
				
				//post to API
				//sendPostMessage(url, requestObj.eventName, payload, fullUrl, responseType);
				this.mediator.sendPostMessage( url, topic, feature);
			} else if (event.feature && event.feature.removed) {
				event.feature.removed = false;
				this.onChangeFeature(event);
			}
		},
		
		/** After the feature has been persisted - add the new id **/
		onCreateFeature: function(feature, evt, response){
			if(response.message != OK_STATUS){
				Ext.MessageBox.alert("NICS", response.message);
			}
			
			//Only one feature expected on a persist
			if(response.features && response.features[0]){
				feature.persistChange = false;
				feature.setId(response.features[0].featureId);
				feature.set("featureId", response.features[0].featureId);
				feature.persistChange = true; //Set back to true
			}
		},
		
		/** Handler for when a feature has been removed from the layer source **/
		onDeleteFeature: function(event){
			if(this.isActive && !event.feature.removed){
				var url = Ext.String.format('{0}/features/remove/{1}/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						this.featureType, event.feature.getId());
				
				if(this.featureType == COLLABROOM_TYPE){
					url += "?collabRoomId=" + this.id;
				}
				
				var topic = "nics.collabroom.feature.delete" + Core.Util.generateUUID();
				Core.EventManager.createCallbackHandler(topic, this, function(feature, evt, response){
					if(response.message != OK_STATUS){
						Ext.MessageBox.alert("NICS", response.message);
					} else {
						feature.removed = true;
					}
				}, [event.feature]);
				
				//post to API
				this.mediator.sendPostMessage(url, topic, {});
			}
		},
		
		/** Handler for when a message was received that a feature has been deleted from this room **/
		onDeleteFeatureFromMessage: function(event, data){
			var source = this.layer.getSource();
			//Message from the client
			if(data.deletedFeatureId && source.getFeatureById(data.deletedFeatureId)){
				var feature = source.getFeatureById(data.deletedFeatureId);
				feature.removed = true; //set the feature as removed so that the source handler does not call onDeleteFeature again
				source.removeFeature(feature);
			}
		},
		
		/** Handler for when a feature has been changed in this layer source */
		onChangeFeature: function(event){
			if(event.feature){
				if(event.feature.persistChange){
					if(event.feature.getGeometry()){
						var feature = this.getFeature(event.feature);
						feature.featureId = event.feature.getId();
						
						var url = Ext.String.format('{0}/features/update/{1}', 
								Core.Config.getProperty(UserProfile.REST_ENDPOINT),
								this.featureType);
						
						if(this.featureType == COLLABROOM_TYPE){
							url += '/' + this.id;
						}
						
						var topic = "nics.collabroom.feature.change" + Core.Util.generateUUID();
						Core.EventManager.createCallbackHandler(topic, this, function(evt, response){
							if(response.message != OK_STATUS){
								Ext.MessageBox.alert("NICS", response.message);
							}
						});
						
						this.mediator.sendPostMessage(url, topic, feature);
					}
				}
			}
		},
		
		/** Handler for when a message was received that a feature has been updated in this room */
		onChangeFeatureFromMessage: function(evt, data){
			if(data.username != this.username){
				if(data.featureId){
					this.updateFeatures([data]);
				}
				//List of updated features
				else if(data.features && data.features.length > 0){
					this.updateFeatures(data.features);
				}
				//List of deleted features
				if(data.deletedFeature && data.deletedFeature.length > 0){
					for(var i=0; i<data.deletedFeature.length; i++){
						this.onDeleteFeatureFromMessage(
								evt, 
								{ deletedFeatureId: data.deletedFeature[i]});
					}
				}
			}
		},
		
		updateFeatures: function(features){
			if(features){
				for(var i=0; i<features.length; i++){
					//find the feature
					var feature = this.layer.getSource().getFeatureById(features[i].featureId);
					var data = features[i];
					if(feature){
						//Tell the source event handler not to persist the 
						//change since this user did not make the change
						feature.persistChange = false;
						
						//update the feature
						for(var prop in data){
							if(prop != GEOMETRY_FIELD && data[prop] != null){ //unset if the new value is null?
								feature.set(prop, data[prop]);
							}
						}
						
						if(data.geometry){
							feature.setGeometry(format.readGeometry(data.geometry));
						}
						
						feature.persistChange = true; //Set back to true after we're finished
					}else {
						this.createFeature(data);
					}
				}
			}
		},
		
		/** Clean up listeners and subscriptions **/
		close: function(){
			if(this.featureType != USER_TYPE){
				Core.EventManager.removeListener(this.newFeatureTopic, this.newFeatureCallback);
				Core.EventManager.removeListener(this.deleteFeatureTopic, this.deleteFeatureCallback);
				Core.EventManager.removeListener(this.changeFeatureTopic, this.changeFeatureCallback);
			}
			
			Core.EventManager.removeListener(this.loadFeatureTopic, this.onLoadFeatures);
			Core.Ext.Map.removeLayer(this.layer);
		},
		
		/** Return a new drawing layer for this room **/
		getNewDrawingLayer: function(){
			var topicListener = this;
			
			var source = new ol.source.Vector();
			source.on('addfeature', this.onNewFeature.bind(this));
			source.on('removefeature', this.onDeleteFeature.bind(this));
			source.on('changefeature', this.onChangeFeature.bind(this));
			
			return new ol.layer.Vector({
				  source: source,
				  style: Core.Ext.Map.getStyle
				});
		},
		
		/** Return the feature's properties for sending to the API**/
		getFeature: function(feat){
			//Create a new copy of features
			var feature = jQuery.extend(true, {}, feat.getProperties());

			delete feature.lastupdate; //Update on the server
			delete feature.gesture; //Does not exist in the database
			
			//Might want to add this to the database
			if(feature.description || feature.description==""){
				delete feature.description;
			}
			
			//Does not exist in the database
			if(feature.dragging){
				delete feature.dragging;
			}
			if(feature.documents){
				delete feature.documents;
			}
			
			//Change value to WKT
			feature.geometry = format.writeFeature(feat);
			
			//Add the user session id
			feature.usersessionId = UserProfile.getUserSessionId();
			
			//Add the username
			feature.username = this.username; //Move to global properties module eventually
			
			if (feature.attributes && typeof feature.attributes !== "string") {
				feature.attributes = JSON.stringify(feature.attributes);
			}
			
			return feature;
		}
		
	});

});
