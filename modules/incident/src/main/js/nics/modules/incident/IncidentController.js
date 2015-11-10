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
define(["iweb/CoreModule", 
         "./IncidentModel",
 	'nics/modules/UserProfileModule'], 

	function(Core, IncidentModel, UserProfile){
	
		Ext.define('modules.incident.IncidentController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.incidentcontroller',
			
			init: function(){
				this.model = new IncidentModel();
			    
			    this.mediator = Core.Mediator.getInstance();
			    
			    this.bindEvents();
			},
	 
			bindEvents: function(){
				//Bind UI Elements
				this.getView().createIncidentButton.on("click", this.showIncidentMenu, this);
				this.getView().createButton.on("click", this.createIncident, this);
		
				//Subscribe to UI Events
				Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
				Core.EventManager.addListener("nics.incident.load", this.onLoadIncidents.bind(this));
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
				
				Core.EventManager.fireEvent("nics.incident.join", incident);
			},

			onCloseIncident: function(e){
				this.mediator.unsubscribe(this.model.getCurrentIncident().topic);
				this.model.removeCurrentIncident();
				this.getView().resetIncidentLabel();
			},

			onNewIncident: function(e, incident){
				this.getView().addMenuItem(
						incident.incidentname,
						incident.incidentid,
						incident.lat, incident.lon,
						incident.incidenttypes, //need to figure out incidenttypes? -- Not returning from API atm
						2, false, //0 is the Create Incident option & 1 is the menu separator
						this.onJoinIncident.bind(this)); 
			},

			showIncidentMenu: function(){
				this.getView().createWindow.show();
			},

			createIncident: function(){
				var view = this.getView();
				
				var incidentTypes = this.getView().getIncidentTypeIds().map(function(id){
					return {incidenttypeid: id};
				});
				
				var incident = {
						usersessionid: UserProfile.getUserSessionId(),
						workspaceid: UserProfile.getWorkspaceId(), 
						description: view.getDescription(), //validate
						incidentname: view.getIncidentName(), //validate
						parentincidentid: view.getParentIncident(),
						lat: 0,
						lon: 0,
						folder: '',
						active: true,
						incidentIncidenttypes: incidentTypes
				};
				
				//Create a new User Session
				var topic = "nics.incident.create.callback";
				
				Core.EventManager.createCallbackHandler(topic, this, function(evt, response){
					if(response.message != "OK"){
							Ext.MessageBox.alert("NICS", response.message);
					}else{
						//Reset Display
						view.resetCreateWindow();
						view.closeCreateWindow();
					}
				});
				
				var url = Ext.String.format("{0}/incidents/{1}",
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId());
				
				this.mediator.sendPostMessage(url,topic,incident);
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
