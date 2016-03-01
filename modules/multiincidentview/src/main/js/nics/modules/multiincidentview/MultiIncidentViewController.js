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
define(['ext', 'iweb/CoreModule', 'ol', './MultiIncidentViewModel', 'nics/modules/UserProfileModule', 'iweb/modules/MapModule'],
		function(Ext, Core, ol, MultiIncidentModel, UserProfile, MapModule){
	
	return Ext.define('modules.multiincidentview.MultiIncidentViewController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.multiincidentviewcontroller',

		incidentColor : 'rgb(0,0,0)',
		
		viewEnabled: false,

		init: function(){
			this.mediator = Core.Mediator.getInstance();
			
			var source = new ol.source.Vector();
			this.vectorLayer = new ol.layer.Vector({
				source : source,
				style : Core.Ext.Map.getStyle
			});
			
			this.vectorLayer.setVisible(false);
			
			Core.Ext.Map.addLayer(this.vectorLayer);
			
			Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.loadAllIncidents.bind(this));
			Core.EventManager.addListener("nics.miv.onloadallincidents", this.onLoadAllIncidents.bind(this));
		},
		
		loadAllIncidents: function(e) {
			var grid = this.lookupReference('multiincidentsgrid');
			
			if(UserProfile.getSystemRoleId() != 4 && UserProfile.getSystemRoleId() != 0){
				this.lookupReference('miveditbutton').hide()
			}
			
			if(grid.getSelectionModel().getSelection()){
				grid.getSelectionModel().clearSelections();
				this.resetFormPanel();
			}
			
			var topic = Ext.String.format("iweb.NICS.ws.{0}.newIncident", UserProfile.getWorkspaceId());
			this.mediator.subscribe(topic);
			Core.EventManager.addListener(topic, this.getAllIncidents.bind(this));
			
			topic = Ext.String.format("iweb.NICS.ws.{0}.updateIncident", UserProfile.getWorkspaceId());
			this.mediator.subscribe(topic);
			Core.EventManager.addListener(topic, this.getAllIncidents.bind(this));
			
			this.getAllIncidents();
			
		},
		
		getAllIncidents: function(){
		
			var url = Ext.String.format("{0}/incidents/{1}/getincidenttree?accessibleByUserId={2}", 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId(),
					UserProfile.getUserId());
				
			this.mediator.sendRequestMessage(url, "nics.miv.onloadallincidents");
		
		},
		
		onNewIncident: function(e, incident){
			
			// Must change to add incident manually to MIV
			// Not enough time to fix properly for Sprint
			
			//console.log('new');
			//console.log(incident);
		
		},
		
		onUpdateIncident: function(e, incident){
		
			// Must change to add incident manually to MIV
			// Not enough time to fix properly for Sprint
			
			//console.log('update');
			//console.log(incident);
		
		},
		
		onLoadAllIncidents: function(e,response) {
		
			if(response != null && response.incidents != null){
				
				if(this.lookupReference('multiincidentsgrid').getSelectionModel().getSelection()){
					this.lookupReference('multiincidentsgrid').getSelectionModel().clearSelections();
				}
				
				this.lookupReference('multiincidentsgrid').getRootNode().removeAll();
				
				response.incidents.forEach(function(incident){
					
					var root = this.lookupReference('multiincidentsgrid').getRootNode();
					
					root.appendChild(this.createTree(incident));
					
					
				}, this);
				
				this.addMIVLayer(response.incidents);
			
			}
			
		},
		
		createTree: function(incident){
			
			if(!incident.lastUpdate){
				incident.lastUpdate = incident.created;
			}
			
			incident.lastUpdate = new Date(incident.lastUpdate)

			incident.incidenttypes = "";

			for(var i = 0; i < incident.incidentIncidenttypes.length; i++){
		
				incident.incidenttypes += incident.incidentIncidenttypes[i].incidentType.incidentTypeName;
				
				if(i != incident.incidentIncidenttypes.length - 1){
					incident.incidenttypes += ", "
				}
		
			}
			
			if(!incident.leaf){
				incident.children.forEach(function(incident){
					var childIncident = this.createTree(incident);
					incident.lastUpdate = childIncident.lastUpdate;
					incident.incidenttypesstring = childIncident.incidenttypesstring;
				}, this);
			}
			
			console.log(incident);
			
			return incident;
		
		},
		
		addMIVLayer: function(incidents){
			
			for(var i = 0; i < incidents.length; i++){
				
				var feature = new ol.Feature({
					geometry : new ol.geom.Point(ol.proj.transform([ incidents[i].lon, incidents[i].lat ],
							'EPSG:4326', 'EPSG:3857'))	
				});
				
				feature.set('type', 'incident');
				feature.set('fillColor', this.incidentColor);
				feature.set('strokeColor',this.incidentColor);
				feature.set('incidentname',incidents[i].incidentname);
				feature.set('description',incidents[i].description);
					
				this.vectorLayer.getSource().addFeature(feature);
				
				if(incidents[i].children != null){
					this.addMIVLayer(incidents[i].children);
				}
			}
			
		},
		
		resetFormPanel: function(){
		
			var form = this.lookupReference('multiincidentform');
			
			form.collapse();
			form.getForm().findField('incidentname').setValue('');
			form.getForm().findField('created').setValue('');
			form.getForm().findField('description').setValue('');
			form.getForm().findField('timesincecreated').setValue('');
			
		},
		
		editIncident: function(e){
		
			var selected = this.lookupReference('multiincidentsgrid').getSelectionModel().getSelection()[0];
			if(selected == null){
				Ext.MessageBox.alert("NICS","Select an incident to update.");
			}
			else{
				Core.EventManager.fireEvent('nics.incident.window.update',selected);
			}
		
		},
		
		enableIncidentView: function(e){
		
			if(this.viewEnabled){
				this.vectorLayer.setVisible(false);
				this.viewEnabled = false;
				this.lookupReference('mivviewbutton').setText('Enable All Views');
			}
			else{
				this.vectorLayer.setVisible(true);
				this.viewEnabled = true;
				this.lookupReference('mivviewbutton').setText('Disable All Views');
			}
			
		},
		
		onItemDblClick: function(dv, incident, item, index, e){
    		var latAndLonValues = [incident.data.lon,incident.data.lat];
    		var center = ol.proj.transform(latAndLonValues,'EPSG:4326','EPSG:3857');
    		MapModule.getMap().getView().setCenter(center);
    		
    		if(!this.viewEnabled){
    			this.lookupReference('mivviewbutton').el.dom.click();
    		}
		},
		
		onSelectionChange: function(grid, selected, eOpts) {
			var incident = selected[0].data;
			var form = this.lookupReference('multiincidentform');
			var date = new Date(incident.created);
			
			
			
			var dateFormat = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
			var diff = date.getTime() - Date.now();
			var hours = Math.abs(Math.round((((diff/1000)/60)/60)));
			var days = Math.abs(Math.round(hours / 24));
			
			form.getForm().findField('incidentname').setValue(incident.incidentname);
			form.getForm().findField('created').setValue(dateFormat);
			
			if(incident.description == ""){
				form.getForm().findField('description').setValue("No description available");
			}
			else{
				form.getForm().findField('description').setValue(incident.description);
			}
			
			if(days == 0){
				form.getForm().findField('timesincecreated').setValue(hours + " hours");
			}
			else{
				
				form.getForm().findField('timesincecreated').setValue(days + " days, " + hours + " hours");
			}
			
			form.expand();
			
		}		
		
	});
});
