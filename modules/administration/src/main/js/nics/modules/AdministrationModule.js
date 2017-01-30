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
define(["iweb/CoreModule", "./administration/AdminView",
		"./administration/RoomManagementView", "nics/modules/UserProfileModule", 
		"./administration/ArchivedIncidentLookup", "./administration/OrganizationCapabilitiesView" ],
	
	function(Core, AdminView, RoomManagementView, UserProfile, 
				ArchivedIncidentLookup, OrganizationCapabilitiesView) {
	
		var AdminModule = function(){};
		
		var view;
		AdminModule.prototype.load = function(){
			new AdminView();//Create Tool Dropdown
			
			view = new RoomManagementView();
			//Add Item to Tools Menu
			Core.Ext.ToolsMenu.add({
				text: 'Room Management',
				menu: {
					items:[{
						text: "Copy drawings from 'Workspace' to current collaboration room",
						handler: this.copyWorkspaceFeatures,
						scope: this
					}, {
						text: 'Modify Room Permissions',
						handler: function(){
							view.controller.load();
						}
					}]
				}
			});
			
			var lookupArchive = new ArchivedIncidentLookup();
			//Add Item to Tools Menu
			Core.Ext.ToolsMenu.add({
					text: 'View Archived Incidents',
					handler: function(){
						lookupArchive.show();
					}
				}
			);
			
		};
		
		AdminModule.prototype.copyWorkspaceFeatures = function(){
			var restEndpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					collabRoomId = view.controller.collabRoomId,
					userId = UserProfile.getUserId(),
					topic = "nics.collabroom.feature.copy." + userId;
			
			if (collabRoomId == "myMap") {
				Ext.MessageBox.alert("Warning",
					"There is no current collab room. Please choose one from the list or join a new room.");
				return;
			}
			
			var	url = Ext.String.format('{0}/features/user/{1}/copy?collabRoomId={2}',
							restEndpoint, userId, collabRoomId);
							
			Core.EventManager.createCallbackHandler(topic, this, function(evt, response){
				if (!response || response.message !== "OK") {
					Ext.MessageBox.alert("No Workspace Features Copied",
						"Unexpected error attempting to copy features");
				} else if (response.count) {
					Ext.MessageBox.alert("Workspace Features Copied",
						Ext.String.format("{0} features were copied to the current workspace", response.count));
				} else {
					Ext.MessageBox.alert("No Workspace Features Copied",
						"No workspace features were found to copy");
				}
			});
			
			Core.Mediator.getInstance().sendPostMessage( url, topic, {});
		};
		
		return new AdminModule();
	}
);
	
