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
define(['ext', 'ol', 'iweb/CoreModule', 'nics/modules/UserProfileModule', 
        "iweb/modules/geocode/AbstractController",
        "iweb/modules/MapModule", "iweb/modules/drawmenu/Interactions",
        "./UserLookupView"],
         function(Ext, ol, Core, UserProfile, 
        		 AbstractController, MapModule, 
        		 Interactions, UserLookupView){
	
	return Ext.define('modules.administration.OrganizationFormController', {
		extend : 'modules.geocode.AbstractController',

		alias: 'controller.orgformcontroller',

		init: function(){
			this.mediator = Core.Mediator.getInstance();
			
			Core.EventManager.addListener('nics.admin.close', this.removeLayer.bind(this));
			
			var source = new ol.source.Vector();
			this.vectorLayer = new ol.layer.Vector({
              source: source
            });

            Core.Ext.Map.addLayer(this.vectorLayer);
            this.vectorLayer.setVisible(true); 
            
            this.lookupWindow = new UserLookupView({
            	callback: { fnc: this.addUserOrgs, scope: this}
            });
            
            this.getOrgTypes();
		},
		
		getOrgTypes: function(){
			var topic = "nics.admin.orgtypes";
			Core.EventManager.createCallbackHandler(topic, this, function(evt,response){
				var orgTypes = response.orgTypes;
				var orgTypeForm = this.lookupReference('orgTypeForm');
				for(var i=0; i<orgTypes.length; i++){
					var type = orgTypes[i]; 
					orgTypeForm.add({
	                    boxLabel  : type.orgTypeName,
	                    inputValue: type.orgTypeId,
	                    reference: 'orgtype-' + type.orgTypeId
	                });
				}
			});
			
			var url = Ext.String.format('{0}/orgs/{1}/types', 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId());
			
			this.mediator.sendRequestMessage(url, topic)
		},
		
		getSelectedOrgTypes: function(){
			//Collection of original orgtypes
			var orgTypes = this.lookupReference('orgForm').getViewModel().get('orgTypes');
			//Array of orgtypes found in both the new and original collection
			var validated = new Array();
			
			var addedTypes = [];
			var removedTypes = [];
			
			//Loop thru edited checkboxes
			var items = this.lookupReference('orgTypeForm').getRefItems();
			for(var i=0; i<items.length; i++){
				if(items[i].checked){
					var found = false;
					if(orgTypes){
						for(var j=0; j<orgTypes.length; j++){
							if(orgTypes[j].orgtypeid == items[i].inputValue){
								validated.push(orgTypes[j].orgtypeid);
								found = true;
								break;
							}
						}
					}
					if(!found){
						addedTypes.push(items[i].inputValue);
					}
				}
			}
			
			//Find Removed Checkboxes
			if(orgTypes){
				for(var j=0; j<orgTypes.length; j++){
					var type = orgTypes[j];
					if(validated.indexOf(type.orgtypeid) == -1){
						removedTypes.push(type.orgtypeid);
					}
				}
			}
			
			return { added: addedTypes, removed: removedTypes };
		},
		
		submitForm : function() {
			var vm = this.lookupReference('orgForm').getViewModel();
			
			var updatedOrgTypes = this.getSelectedOrgTypes();
			
			var org = {
				name: vm.get("name"),
				county: vm.get("county"),
				state: vm.get("state"),
				prefix: vm.get("prefix"),
				distribution: vm.get("distribution"),
				defaultlatitude: vm.get("defaultlatitude"),
				defaultlongitude: vm.get("defaultlongitude"),
				country: vm.get("country")
			};
			
			if(!Ext.isEmpty(vm.get('orgId'))){
				org.orgId = vm.get("orgId");
			}
			
			var topic = "nics.org.new";
			Core.EventManager.createCallbackHandler(topic, this, 
					function(updatedOrgTypes, evt, response){
						if(response.message != "OK"){
							Ext.MessageBox.alert("Status", "There was an error updating the organization.");
						}else{
							Ext.MessageBox.alert("Status", "Organization was successfully updated.");
							Core.EventManager.fireEvent("nics.admin.org.new", response.organizations);
							this.updateOrgTypes(updatedOrgTypes, response.organizations[0].orgId);
						}
					},
					[updatedOrgTypes]
			);
			
			var url = Ext.String.format('{0}/orgs/{1}', 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId());
			
			this.mediator.sendPostMessage(url, topic, org);
		},
		
		updateOrgTypes: function(updatedOrgTypes, orgId){
			//Add New Org Types
			if(updatedOrgTypes.added.length > 0){
				var topic = "nics.org.orgtype.new";
				for(var i=0; i<updatedOrgTypes.added.length; i++){
					var url = Ext.String.format('{0}/orgs/{1}/orgtype/add/{2}/{3}', 
							Core.Config.getProperty(UserProfile.REST_ENDPOINT),
							UserProfile.getWorkspaceId(),
							orgId,
							updatedOrgTypes.added[i]);
					
					this.mediator.sendPostMessage(url, topic);
				}
			}
			//Remove Old Org Types
			if(updatedOrgTypes.removed.length > 0){
				var topic = "nics.org.orgtype.remove";
				for(var i=0; i<updatedOrgTypes.removed.length; i++){
					var url = Ext.String.format('{0}/orgs/{1}/orgtype/remove/{2}/{3}', 
							Core.Config.getProperty(UserProfile.REST_ENDPOINT),
							UserProfile.getWorkspaceId(),
							orgId,
							updatedOrgTypes.removed[i]);
					
					this.mediator.sendPostMessage(url, topic);
				}
			}
		},
		
		cancelForm: function() {
			this.lookupReference('orgForm').getForm().reset();
		},
		
		clearForms: function() {
			this.lookupReference('orgForm').getForm().reset();
			Core.EventManager.fireEvent("nics.admin.org.clear");
		},
		
		onLocateCallback: function(feature) {
			feature.setProperties({
				type: 'Geocoded Location'
			});
			
			var view = MapModule.getMap().getView();
			var clone = feature.getGeometry().clone()
				.transform(view.getProjection(), ol.proj.get('EPSG:4326'));
			var coord = clone.getCoordinates();
			this.lookupReference('orgForm').getViewModel().set("defaultlatitude", coord[1]);
			this.lookupReference('orgForm').getViewModel().set("defaultlongitude", coord[0]);
			
			//turn off our drawing interaction
			var controller = MapModule.getMapController();
			controller.setInteractions(controller.getDefaultInteractions());
		},
		
		 onInteractionChange: function(){
	    	var button = this.lookupReference('locateButton');
	    	if(button.pressed){
	    		button.toggle();
	    	}
	    	this.prevInteractions = Core.Ext.Map.interactions;
	    },
	    
	    onAddUsers: function(){
	    	var vm = this.lookupReference('orgForm').getViewModel();
	    	if(!Ext.isEmpty(vm.get('orgId'))){
	    		this.lookupWindow.controller.clearGrid()
	    		this.lookupWindow.show();
	    	}
	    },
	    
	    addUserOrgs: function(selected){
	    	var vm = this.lookupReference('orgForm').getViewModel();
	    	var orgId = vm.get('orgId');
			if(orgId != -1){
				var userIds = [];
				for(var i=0; i<selected.length; i++){
					userIds.push(selected[i].data.userId);
				}
				
				var topic = Core.Util.generateUUID();
				Core.EventManager.createCallbackHandler(topic, this, 
						function(orgId, evt, response){
							if(response.failedUsers.length > 0){
								Ext.MessageBox.alert("Status", response.failedUsers.length + 
										" users were not successfully added to the organization. Please confirm that they are not already members.");
							}
							if(response.users.length > 0){
								Core.EventManager.fireEvent("nics.admin.org.users.load", orgId);
							}
						}, [orgId]
				);
				
				var url = Ext.String.format('{0}/users/{1}/userorg?orgId={2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT), 
						UserProfile.getWorkspaceId(), orgId);
				
				this.mediator.sendPostMessage(url, topic, userIds);
			}
		},
	    
	    updateView: function(){
	    	//reset the checkboxes
	    	var checkboxes = this.view.query("checkbox");
	    	for(var j=0; j<checkboxes.length; j++){
	    		checkboxes[j].setValue(false);
	    	}
	    	
	    	var vm = this.lookupReference('orgForm').getViewModel();
	    	this.lookupReference('addUsersButton').setDisabled(Ext.isEmpty(vm.get('orgId')));
	    	var orgTypes = vm.get('orgTypes');
	    	for(var i=0; i<orgTypes.length; i++){
				var type = orgTypes[i]; 
				var checkbox = this.lookupReference('orgtype-' + type.orgtypeid);
				if(checkbox){
					checkbox.setValue(true);
				}
			}
	    	
	    	this.lookupReference('submitButton').setDisabled(false);
	    }
	});
});
