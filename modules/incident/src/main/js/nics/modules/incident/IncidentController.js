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
				Core.EventManager.addListener('nics.incident.orgs', this.onLoadOrgs.bind(this));
				Core.EventManager.addListener("nics.miv.update.mivpanel", this.onUpdateIncident.bind(this));
				Core.EventManager.addListener("nics.archived.incident.join", this.onJoinArchivedIncident.bind(this));
			},

			populateModel: function(e, userProfile){

			
				//Handler for new incidents
				var topic = Ext.String.format("iweb.NICS.ws.{0}.newIncident", UserProfile.getWorkspaceId());
				this.mediator.subscribe(topic);
				Core.EventManager.addListener(topic, this.onNewIncident.bind(this));
				
				//Handler for new incidents
				var removeTopic = Ext.String.format("iweb.NICS.ws.{0}.removeIncident", UserProfile.getWorkspaceId());
				this.mediator.subscribe(removeTopic);
				Core.EventManager.addListener(removeTopic, this.onRemoveIncident.bind(this));
				
				var url = Ext.String.format("{0}/incidents/{1}?accessibleByUserId={2}",
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId(), UserProfile.getUserId());
				//request incidents
				this.mediator.sendRequestMessage(url, "nics.incident.load");
				//Core.EventManager.fireEvent('nics.incident.orgs.get',UserProfile);
				//Get the list of organizations, so we can create the list of prefixes used for updating incidents
				if(UserProfile.isSuperUser() || UserProfile.isAdminUser()){
					var orgsURL = Ext.String.format('{0}/orgs/{1}/all', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT), 
						UserProfile.getWorkspaceId());
					this.mediator.sendRequestMessage(orgsURL,"nics.incident.orgs" );
				}
				
			},
			
			onLoadOrgs: function(evt, response){
				/*if(response && response.organizations){
					this.lookupReference('orgGrid').store.loadRawData(response.organizations);
				}*/
				var orgData = response.organizations;
				this.model.setAllOrgPrefixes(orgData);
				
				
			},
			onUpdateIncident: function(e, response){
				this.getView().closeCreateWindow();
				this.getView().updateIncidentName(this.updateIncidentId,this.getView().getIncidentName());
				
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
			
			onJoinArchivedIncident: function(evt, incident){
				//For now leave the incident that you are in to join a new one
				if(this.model.getCurrentIncident().id != -1){
					Core.EventManager.fireEvent("nics.incident.close");
				}
				
				this.model.setCurrentIncident(incident);
				
				this.getView().setIncidentLabel(incident.name, incident.id);
				
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
					Ext.MessageBox.alert("Incident Error","Unable to join incident.");
				}
				
			},

			onCloseIncident: function(e){
				this.mediator.unsubscribe(this.model.getCurrentIncident().topic);
				this.model.removeCurrentIncident();
				this.getView().resetIncidentLabel();
				
				var actions = Core.Ext.Map.getDefaultInteractions();
		    	Core.Ext.Map.setInteractions(actions);
				
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
			
			onRemoveIncident: function(e, incidentId){
				var items = this.getView().getMenu().items;
				for(var i=0; i<items.length; i++){
					var item = items.getAt(i);
					if(item.config && item.config.incidentId == incidentId){
						this.getView().getMenu().remove(item);
						return;
					}
				}
			},
			
			onCreateIncident: function(evt, response){
				if(response.message != "OK"){
					Ext.MessageBox.alert("Status", response.message);
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
				// Set the state/region box based on the user's org country, or if there isn't one set.  
				// Don't set Country though, or it will show up in the Incident name automatically.
				var countryCode = this.getView().getCodeFromCountry(UserProfile.getOrgCountry());
				
				if (typeof(countryCode)  === 'string' && countryCode == 'US' ){
					view.stateDropdown.setVisible(true);
				    view.regionInput.setVisible(false);
				    view.regionWarning.setVisible(false);
				}
				else {
					 view.stateDropdown.setVisible(false);
				     view.regionInput.setVisible(true);
				     view.regionWarning.setVisible(false);
				}
				
				view.createWindow.show();
				
			},
			

			showUpdateWindow: function(e, selected){
				var view = this.getView();
				var defaultPrefix = UserProfile.getOrgPrefix();
				view.createWindow.setTitle('Update Incident');
				view.createButton.setText('Update');
				
				if(this.onCreate){
					view.createButton.removeListener("click", this.createIncident, this);
					view.createButton.on("click", this.updateIncident, this);
					this.onCreate = false;
				}
				var country;
				var stateRegion = "";
				var name = "";
				var isUSState = false;
				
				var incidentName = selected.get('incidentname');
				
				
				//get state and country info from name - Name is "Country(optional) State/Region Prefix Name"
				
				//Find the position of the prefix
				var prefixes = this.model.getAllOrgPrefixes();
				var nameParts = incidentName.split(" ");
				var prefixPos = "";
				for (i = 0; i < nameParts.length; i++) {
					if ((prefixes.indexOf(nameParts[i])) != -1){
						prefixPos = i;
					}
				}
				// 
				if (prefixPos == 0){
					//There is no state or country.  Leave them blank, so user can fix it
					stateRegion = " ";
					countryCode = 'ZZ';
					view.setCountry(countryCode);
					
				
					
				}
				else if (prefixPos == 1){
					//state is pos 0, no country
					stateRegion = nameParts[0];	
					
					if (view.stateDropdown.getStore().findRecord('state',stateRegion)){ 
						isUSState = true;
						view.setState(stateRegion);
					}
					else{
						view.setRegion(stateRegion);
					}
					countryCode = 'ZZ';
					view.setCountry(countryCode);
					
				
					
				}
				else{
					//There are at least 2 things before the prefix, check to see if the first thing is a country code
					
				    if (view.countryDropdown.getStore().findRecord('countryCode', nameParts[0])){
				    	//There is a country
				    	countryCode =  nameParts[0];
				    	for (i = 1; i < (prefixPos); i++) {
				    		stateRegion += nameParts[i] + " ";
						}
				    	view.setCountry(countryCode);
						
				    }
				    else if (nameParts[0] == 'United' && nameParts[1] == 'States') {
				    	//this is old so let's fix it
				    	countryCode='US'
				    	view.setCountry(countryCode);
				    	for (i = 2; i < (prefixPos); i++) {
				    		stateRegion += nameParts[i] + " ";
						}
				    }
				    else {
				    	//No country, assume it's a region
				    	view.setCountry('ZZ');
				    	for (i = 10; i < (prefixPos); i++) {
				    		stateRegion += nameParts[i] + " ";
						}
				    }
				   
				} 

				//Everything after the prefix is the name
				var name = "";
				for (i = prefixPos+1; i < nameParts.length; i++) {
		    		name += nameParts[i] + " ";
				}
				
				//Set form data
				view.setName(name.trim());
				view.setDescription(selected.get('description'));
				view.setLat(selected.get('lat'));
				view.setLon(selected.get('lon'));
				view.setPrefixValue(defaultPrefix); //just in case there is no prefix in name in imported incidents
				if (nameParts[prefixPos]) view.setPrefixValue( nameParts[prefixPos]);
				
				
				if (countryCode == 'US' || isUSState) {
					//Set State code
					view.setState(stateRegion.trim());
					view.stateDropdown.setVisible(true);
				    view.regionInput.setVisible(false);
				    view.regionWarning.setVisible(false);
				}
				else if  (countryCode == 'ZZ') {
					//We're not sure, so set it in region, 
					view.setRegion(stateRegion.trim());
					view.stateDropdown.setVisible(false);
				    view.regionInput.setVisible(true);
				    view.regionWarning.setVisible(false);
				}
				else
				{
					view.setRegion(stateRegion.trim());
					view.stateDropdown.setVisible(false);
				    view.regionInput.setVisible(true);
				    view.regionWarning.setVisible(false);
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
				
					
					var url = Ext.String.format("{0}/incidents/{1}/update",
							Core.Config.getProperty(UserProfile.REST_ENDPOINT),
							UserProfile.getWorkspaceId());
					
					this.mediator.sendPostMessage(url,topic,incident);
				
				}
				
			},
			
			

			createIncident: function(){
				var view = this.getView();
				if (!view.getStateRegion())
				{
					Ext.MessageBox.alert("Input Error","You must supply one State or one Region.");
					return;
				}
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
					var actions = Core.Ext.Map.getDefaultInteractions();
					Core.Ext.Map.setInteractions(actions);
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
				
				var actions = Core.Ext.Map.getDefaultInteractions();
		    	Core.Ext.Map.setInteractions(actions);
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
			},
			
	});
});
