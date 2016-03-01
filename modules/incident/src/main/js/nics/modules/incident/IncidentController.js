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
define(['iweb/CoreModule', 
		'ol',
         './IncidentModel',
 		'nics/modules/UserProfileModule',
 		'iweb/modules/MapModule',
 		'iweb/modules/geocode/AbstractController',
 		'iweb/modules/drawmenu/Interactions'], 

	function(Core, ol, IncidentModel, UserProfile, MapModule, AbstractController, Interactions){
	
		Ext.define('modules.incident.IncidentController', {
			extend : 'Ext.app.ViewController',
			
			id: 'incidentcontroller',
			
			alias: 'controller.incidentcontroller',
			
			onCreate: true,
			
			updateIncidentId: null,
			
			mixins: {
		
				geoApp: 'modules.geocode.AbstractController'
			
			},
			
			init: function(){
				this.model = new IncidentModel();
			    
			    this.mediator = Core.Mediator.getInstance();
			    
			    this.bindEvents();
			},
	 
			bindEvents: function(){
				//Bind UI Elements
				this.getView().createIncidentButton.on("click", this.showIncidentMenu, this);
				this.getView().createButton.on("click", this.createIncident, this);
				this.getView().locateButton.on("toggle", this.locateIncident, this);
		
				//Subscribe to UI Events
				Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
				Core.EventManager.addListener("nics.incident.load", this.onLoadIncidents.bind(this));
				Core.EventManager.addListener("nics.incident.window.update", this.showUpdateWindow.bind(this));
				Core.EventManager.addListener("nics.miv.join", this.onMIVJoinIncident.bind(this));
				Core.EventManager.addListener("nics.incident.create.callback", this.onCreateIncident.bind(this));
				Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.populateModel.bind(this));
			},

			populateModel: function(e, userProfile){
		
				//Handler for new incidents
				var topic = Ext.String.format("iweb.NICS.ws.{0}.newIncident", UserProfile.getWorkspaceId());
				this.mediator.subscribe(topic);
				Core.EventManager.addListener(topic, this.onNewIncident.bind(this));
				
				var url = Ext.String.format("{0}/incidents/{1}?accessibleByUserId={2}",
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId(), UserProfile.getUserId());
				//request incidents
				this.mediator.sendRequestMessage(url, "nics.incident.load");
			},

			onLoadIncidents: function(e, incidents){
				var incidentData = this.parseIncidents(incidents);
				this.model.setIncidents(incidentData.incidents);
				this.model.setIncidentCallBack(this.onJoinIncident.bind(this));
				this.model.setIncidentTypes(UserProfile.getIncidentTypes()); //Should probably take this out of UserProfile
		
				this.getView().setData(this.model, UserProfile);
			},

			onJoinIncident: function(menuItem){
				//For now leave the incident that you are in to join a new one
				if(this.model.getCurrentIncident().id != -1){
					Core.EventManager.fireEvent("nics.incident.close");
				}
				
				var topic = Ext.String.format("iweb.NICS.incident.{0}.#", menuItem.incidentId);
				var incident = { name: menuItem.text, id: menuItem.incidentId, topic: topic };
			
				if(!this.model.isOpen(incident)){
					this.mediator.subscribe(topic);
				}
				
				this.model.setCurrentIncident(incident);
				this.getView().setIncidentLabel(menuItem.text, menuItem.incidentId);
				
				var latAndLonValues = [menuItem.lon,menuItem.lat];
    			var center = ol.proj.transform(latAndLonValues,'EPSG:4326','EPSG:3857');
    			MapModule.getMap().getView().setCenter(center);
				
				Core.EventManager.fireEvent("nics.incident.join", incident);
			},

			onMIVJoinIncident: function(e, incidentName){
				var menuIndex = -1;
				for(var i = 0; i < Core.View.titleBar.items.items.length; i++){
					if(Core.View.titleBar.items.items[i].text == 'Incidents'){
						menuIndex = i; 
					}	
				}
				
				if(menuIndex != -1){
					for(var i = 0; i < Core.View.titleBar.items.items[menuIndex].menu.items.items.length; i++){
						if(incidentName == Core.View.titleBar.items.items[menuIndex].menu.items.items[i].text){
							this.onJoinIncident(Core.View.titleBar.items.items[menuIndex].menu.items.items[i]);	
						}
					}
				}
				else{
					Ext.MessageBox.alert("NICS","Unable to join incident.");
				}
				
			},

			onCloseIncident: function(e){
				this.mediator.unsubscribe(this.model.getCurrentIncident().topic);
				this.model.removeCurrentIncident();
				this.getView().resetIncidentLabel();
				MapModule.getMapController().setInteractions(null);
				this.getView().locateButton.toggle(false);
			},

			onNewIncident: function(e, incident){
				
				this.getView().addMenuItem(
						incident.incidentname,
						incident.incidentid,
						incident.lat, incident.lon,
						incident.incidenttypes, //need to figure out incidenttypes? -- Not returning from API atm
						2, false, //0 is the Create Incident option & 1 is the menu separator
						this.onJoinIncident.bind(this)); 
						
				
				this.getView().addParentIncident([[ incident.incidentname, incident.incidentid]]);
						
			},
			
			onCreateIncident: function(evt, response){
				if(response.message != "OK"){
					Ext.MessageBox.alert("NICS", response.message);
					
				}else{
					//Reset Display
					this.getView().resetCreateWindow();
					this.getView().closeCreateWindow();
					
					if(response.incidents && response.incidents[0]){
						var incident = response.incidents[0];
						this.onJoinIncident({
								text: incident.incidentname,
								incidentId: incident.incidentid,
								lat: incident.lat,
								lon: incident.lon
							});
						}
					}
			},

			showIncidentMenu: function(){
				var view = this.getView();
				
				view.createWindow.setTitle('Create Incident');
				view.createButton.setText('Create');
				view.resetCreateWindow();
				
				if(!this.onCreate){	
					view.createButton.removeListener("click", this.updateIncident, this);
					view.createButton.on("click", this.createIncident, this);
					this.onCreate = true;
				}
				
				var center = MapModule.getMap().getView().getCenter();
				var latLonValues = ol.proj.transform(center,'EPSG:3857', 'EPSG:4326');
				
				view.setLat(latLonValues[1]);
				view.setLon(latLonValues[0]);
				
				view.createWindow.show();
				
			},
			
			showUpdateWindow: function(e, selected){
				var view = this.getView();
				
				
				view.createWindow.setTitle('Update Incident');
				view.createButton.setText('Update');
				
				if(this.onCreate){
					view.createButton.removeListener("click", this.createIncident, this);
					view.createButton.on("click", this.updateIncident, this);
					this.onCreate = false;
				}
				
				var incidentName = selected.get('incidentname');
				var incidentNameStart = incidentName.indexOf(view.getPrefixValue());
				var nameStartLocation = -1;	
							
				view.setName(incidentName.substring(incidentNameStart + view.getPrefixValue().length + 1));
				view.setDescription(selected.get('description'));
				view.setLat(selected.get('lat'));
				view.setLon(selected.get('lon'));
				
				if(incidentName.indexOf('United States') != -1){
				
					view.setCountry('United States');
					
					incidentName = incidentName.substring(14);
					var state = incidentName.substring(0,incidentName.indexOf(' '));
					
					if(state.length == 2){
						view.setState(state);
					}
					
					
				}
				else{
					view.setCountry(incidentName.substring(0,incidentName.indexOf(view.getPrefixValue()) - 1));
				}
				
				
				var incidentTypesName = selected.get('incidenttypes').split(', ');
				var parentId = selected.get('parentincidentid');
				
				view.resetIncidentTypes();
				
				for(var i = 0; i < incidentTypesName.length; i++){
					view.checkIncidentTypes(incidentTypesName[i]);
				}
				
				view.setParentIncidentBox(parentId);
				
				this.updateIncidentId = selected.get('incidentid');
				
				view.createWindow.show();
				
			},

			updateIncident: function(){
				var view = this.getView();
			
				var incidentTypes = this.getView().getIncidentTypeIds().map(function(id){
					return {incidenttypeid: id};
				});
			
				if(this.updateIncidentId){
				
					var incident = {
						incidentid: this.updateIncidentId,
						workspaceid: UserProfile.getWorkspaceId(), 
						description: view.getDescription(), 
						incidentname: view.getIncidentName(), 
						parentincidentid: view.getParentIncident(),
						lat: view.getLat(),
						lon: view.getLon(),
						folder: '',
						active: true,
						incidentIncidenttypes: incidentTypes
					};
					
					var topic = "nics.incident.update.callback";
				
					Core.EventManager.createCallbackHandler(topic, this, function(evt, response){
						if(response.message != "OK"){
							Ext.MessageBox.alert("NICS", response.message);
						}else{
							Ext.MessageBox.alert("NICS", "Incident successfully updated.");
							view.closeCreateWindow();
							view.resetCreateWindow();
						}
					});
					
					var url = Ext.String.format("{0}/incidents/{1}/update",
							Core.Config.getProperty(UserProfile.REST_ENDPOINT),
							UserProfile.getWorkspaceId());
					
					this.mediator.sendPostMessage(url,topic,incident);
				
				}
				
			},

			createIncident: function(){
				var view = this.getView();
				
				var incidentTypes = this.getView().getIncidentTypeIds().map(function(id){
					return {incidenttypeid: id};
				});
				
				var incident = {
						usersessionid: UserProfile.getUserSessionId(),
						workspaceid: UserProfile.getWorkspaceId(), 
						description: view.getDescription(), 
						incidentname: view.getIncidentName(), 
						parentincidentid: view.getParentIncident(),
						lat: view.getLat(),
						lon: view.getLon(),
						folder: '',
						active: true,
						incidentIncidenttypes: incidentTypes
				};
				
				var topic = "nics.incident.create.callback";
				
				var url = Ext.String.format("{0}/incidents/{1}?orgId={2}&userId={3}",
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId(),
						UserProfile.getOrgId(),
						UserProfile.getUserId());
				
				this.mediator.sendPostMessage(url,topic,incident);
			},
			
			locateIncident: function(button, pressed){
				
				if(pressed){
					
					var source = this.mixins.geoApp.getLayer().getSource();
					var style = this.mixins.geoApp.getLayer().getStyle();
					var interaction = Interactions.drawPoint(source, style);
					interaction.on("drawend", this.onDrawEnd.bind(this));
					MapModule.getMapController().setInteractions([interaction]);
					
				}
				else{
					MapModule.getMapController().setInteractions(null);
				}
			
			},
			
			onDrawEnd: function(drawEvent){
			
				var view = MapModule.getMap().getView();
				var clone = drawEvent.feature.getGeometry().clone().transform(view.getProjection(), ol.proj.get('EPSG:4326'));
				var coord = clone.getCoordinates();
				
				this.getView().latitudeInput.setValue(coord[1]);
				this.getView().longitudeInput.setValue(coord[0]);
				
				this.getView().locateButton.toggle(false);
				
				this.mixins.geoApp.removeLayer();
				
				MapModule.getMapController().setInteractions(null);

			},
			
			getIncidentTypes: function(){
				var newIncidentTypes = [];
				var incidentTypes = this.getView().getIncidentTypeIds();
				for(var i=0; i<incidentTypes.length; i++){
					newIncidentTypes.push({
						incidenttypeid: incidentTypes[i]
					});
				}	
				return newIncidentTypes;
			},

			parseIncidents: function(data){
				var incidents = [];
				var collabRooms = {};
		
				for(var i=0; i<data.incidents.length; i++){
					incidents.push({
						incidentName: data.incidents[i].incidentname,
						incidentId: data.incidents[i].incidentid,
						lat: data.incidents[i].lat,
						lon: data.incidents[i].lon
					});
					collabRooms[data.incidents[i].incidentName] = data.incidents[i].collabrooms;
				}
		
				return { incidents: incidents, collabRooms: collabRooms };
			}
	});
});
