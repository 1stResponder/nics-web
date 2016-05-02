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
define(['ext', 'iweb/CoreModule', './CreateCollabroomWindow', './SecureRoomView', 'nics/modules/UserProfileModule'],
		
	function(Ext, Core, CreateCollabroomWindow, SecureRoomView, UserProfile){
	
		var COLLABROOM_TOPIC = 'iweb.NICS.collabroom.{0}.#';
	
		return Ext.define('modules.incident.CollabRoomController', {
		
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.collabroomcontroller',
			
			createTopic: null,
    
			isAdmin: false,
			
			adminRooms: [],
			rooms: null,
			
			init: function(){
				this.mediator = Core.Mediator.getInstance();
			    
			    this.createTopic = "iweb.NICS.incident.{0}.newcollabroom";
			    this.addCollabRoom = this.addCollabRoom.bind(this);
			    
			    this.updateTopic = "iweb.NICS.incident.{0}.updatedcollabroom";
			    this.addUpdatedCollabRoom = this.addUpdatedCollabRoom.bind(this);
			    
			    this.bindEvents();
			},
		 
			bindEvents: function(){
				Core.EventManager.addListener("nics.collabroom.load", this.onLoadCollabRooms.bind(this));
				Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
				Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
				Core.EventManager.addListener("nics.collabroom.close", this.onCloseCollabRoom.bind(this));
				Core.EventManager.addListener("nics.collabroom.create.callback", this.onCreateCollabRoom.bind(this));
				
				Core.EventManager.addListener("nics.archived.collabroom.load", this.onLoadArchivedCollabRooms.bind(this));
				
				Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.loadUser.bind(this));
			},
	
			//TODO : Incorporate into UserProfile
			loadUser: function(e){
				//Check if user is an admin
				var topic = Core.Util.generateUUID();
				Core.EventManager.createCallbackHandler(topic, this, this.setAdmin);
				
				var url = Ext.String.format('{0}/users/{1}/admin/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId(), UserProfile.getUserOrgId());
				this.mediator.sendRequestMessage(url, topic);
			},
	
			onLoadCollabRooms: function(e, response){
				//clear old menu items
				this.getView().clearMenuItems();
				
				Core.EventManager.fireEvent("nics.administration.collabroom.permission", 
						response.adminRooms);
				
				this.rooms = [];
				
				//add items to dropdown menu
				var rooms = response.results;
				if(rooms.length > 0){
					Ext.iterate(rooms, function(value,index){
						this.addCollabRoom(e, value);
					}, this);
				}
				
			},
			
			onLoadArchivedCollabRooms: function(e, response){
				//clear old menu items
				this.getView().clearMenuItems();
				
				this.rooms = [];
				
				//add items to dropdown menu
				var rooms = response.results;
				if(rooms.length > 0){
					Ext.iterate(rooms, function(value,index){
						this.addArchivedCollabRoom(e, value);
					}, this);
				}
				
			},
			
			onCreateBtnClick: function() {
				var roomNames = this.rooms.map(function(room){
					return room.name;
				});
				
				this.window = new CreateCollabroomWindow({
					title: 'Create Room',
					roomPresets: this.roomPresets,
					existingRooms: roomNames
				});
				this.window.on('create', this.createCollabRoom, this);
				this.window.on('close', this.cancelSecureRoom, this);
				if(this.isAdmin){
					this.window.lookupReference('secureRoomCB').setVisible(true);
					this.window.on('secure', this.secureCollabRoom, this);
					this.window.on('unsecure', this.unSecureCollabRoom, this);
				}
				this.window.show();
			},
			
			unSecureCollabRoom: function(){
				if(this.secureRoomController && 
						this.secureRoomController.secureRoom){
					this.secureRoomController.secureRoom = false;
				}
			},
			
			secureCollabRoom: function(){
				var checkbox = this.window.lookupReference('secureRoomCB');
				
				var secureRoomView = new SecureRoomView();
				this.secureRoomController = secureRoomView.getController();
				
				var window = Ext.create("Ext.Window", {
					buttons: [
			 	          { 
			 	        	  xtype: 'button', 
			 	        	  text: 'Apply', 
			 	        	  handler: function(){
			 	        		 window.hide();
			 	        		 secureRoomView.getController().secureRoom = true;
			 	        	  }
			 	          },
			 	          { 
			 	        	  xtype: 'button', 
			 	        	  text: 'Cancel',
			 	        	  handler: function(){
			 	        		  checkbox.setValue(false);
			 	        		  window.close();
			 	        	  }
			 	          }
				 	],
					width: 500,
			 		height: 550
				});
				
				this.secureRoomController.loadUnsecureUsers(this.currentIncidentId);
				
				this.secureWindow = window;
				this.secureWindow.add(secureRoomView);
				this.secureWindow.show();
			},
			
			createCollabRoom: function(window, formValues){
				var collabroom = {
					'incidentid':  this.currentIncidentId,
					'usersessionid': UserProfile.getUserSessionId(),
					'name': formValues.name
				};
				
				this.mediator.sendPostMessage(
					this.getCreateCollabRoomUrl(this.currentIncidentId, UserProfile.getUserOrgId()),
					'nics.collabroom.create.callback',
					this.addCollabRoomPermissions(collabroom)
				);
			},
			
			cancelSecureRoom: function(){
				if(this.secureRoomController){
					this.secureWindow.destroy();
					this.secureRoomController = null
					this.secureWindow == null;
				}
			},
			
			onCreateCollabRoom: function(e, response) {
				if(response.results.length == 1){
					var room = response.results[0];
					room.featureType = "collabroom";
					
					this.window.close();
					this.cancelSecureRoom();
					this.openCollabRoom({
						collabRoom: room
					});
				}else if(!Ext.isEmpty(response.message)){
					this.window.setName("");
					Ext.MessageBox.alert("Status", response.message);
				}
			},
			
			onJoinArchivedIncident: function(incident){
				//Close the incident if we already have one open
				if(this.currentIncidentId != -1){
					this.onCloseIncident();
				}
				
				this.currentIncidentId = incident.id;
				
				//request rooms
				this.mediator.sendRequestMessage(
					this.getLoadCollabRoomUrl(incident.id, UserProfile.getUserId()), "nics.archived.collabroom.load");
			},
			
			onJoinIncident: function(e, incident){
				if(incident.archived){
					this.onJoinArchivedIncident(incident);
				}else{
				
					//Close the incident if we already have one open
					if(this.currentIncidentId != -1){
						this.onCloseIncident();
					}
					
					this.currentIncidentId = incident.id;
					
					Core.EventManager.addListener(
							Ext.String.format(this.createTopic, incident.id), 
							this.addCollabRoom);
					
					Core.EventManager.addListener(
							Ext.String.format(this.updateTopic, incident.id), 
							this.addUpdatedCollabRoom);
					
					this.toggleEnableNewRoom(true);
					
					//request rooms
					this.mediator.sendRequestMessage(
						this.getLoadCollabRoomUrl(incident.id, UserProfile.getUserId()), "nics.collabroom.load");
				}
			},
			
			onCloseIncident: function(e, menuItem){
				//Remove the create topic for this incident
				Core.EventManager.removeListener(
						Ext.String.format(this.createTopic, this.currentIncidentId), 
						this.addCollabRoom);
				
				Core.EventManager.removeListener(
						Ext.String.format(this.updateTopic, this.currentIncidentId), 
						this.addUpdatedCollabRoom);
				
				this.toggleEnableNewRoom(false);
				
				this.currentIncidentId = -1;
				
				//Remove items from the dropdown menu
				this.getView().clearMenuItems();
			},
			
			onCloseCollabRoom: function(evt, menuItem){
				var topic = Ext.String.format(COLLABROOM_TOPIC, menuItem.collabRoomId);
				this.mediator.unsubscribe(topic);
			},
	
			openCollabRoom: function(menuItem){
				var topic = Ext.String.format(COLLABROOM_TOPIC, menuItem.collabRoom.collabRoomId);
				this.mediator.subscribe(topic);
				//Fire event
				Core.EventManager.fireEvent("nics.collabroom.open", menuItem.collabRoom);
			},
			
			addUpdatedCollabRoom: function(e, collabRoom){
				var menuItems = this.getView().getMenu().items;
				var found = -1;
				for(var i=0; i<menuItems.length; i++){
					if(menuItems.getAt(i).collabRoom &&
							menuItems.getAt(i).collabRoom.collabRoomId ==
								collabRoom.collabRoomId){
						found = i;
					}
				}
				
				var access = true;
				if(collabRoom.adminUsers && 
						collabRoom.adminUsers.length > 0){
					access = false;
					if(found != -1){//The room is in the dropdown box
						if($.inArray(UserProfile.getUserId(), collabRoom.adminUsers) == -1){//User is not an admin
							Core.EventManager.fireEvent("nics.administration.collabroom.admin.remove", collabRoom.collabRoomId);
						}else{
							access = true;
							Core.EventManager.fireEvent("nics.administration.collabroom.admin", collabRoom.collabRoomId);
						}
					}
					if($.inArray(UserProfile.getUserId(), collabRoom.adminUsers) > -1 ||
							$.inArray(UserProfile.getUserId(), collabRoom.readWriteUsers) > -1){
						access = true;
					}
				}
				
				if(found != -1 && !access){
					//User no longer has access
					this.getView().getMenu().remove(menuItems.getAt(found));
					//Remove tab if active
					Core.EventManager.fireEvent("nics.incident.close.tab", collabRoom.collabRoomId);
				}else if(found == -1 && access){
					this.addCollabRoom(e, collabRoom);
				}
			},
			
			addArchivedCollabRoom: function(e, collabRoom){
				if(collabRoom){
					
					collabRoom.readOnly = true;
					
					//Distinguish item from My Map
					collabRoom.featureType = "collabroom";
					
					this.rooms.push(collabRoom);
					var item = this.getView().addMenuItem(collabRoom);
					if(item){
						item.on("click", this.openCollabRoom, this);
					}
				}
			},
			
			addCollabRoom: function(e, collabRoom){
				if(collabRoom){
					
					if(collabRoom.name == UserProfile.getIncidentMapName()){
						if($.inArray(UserProfile.getUserId(), collabRoom.readWriteUsers) == -1 &&
								$.inArray(UserProfile.getUserId(), collabRoom.adminUsers) == -1){
							collabRoom.readOnly = true;
						}
					}
					
					if(collabRoom.adminUsers && 
							collabRoom.adminUsers.length > 0){
						if($.inArray(UserProfile.getUserId(), collabRoom.adminUsers) != -1){
							//Add user to the list of admins
							Core.EventManager.fireEvent("nics.administration.collabroom.admin", collabRoom.collabRoomId);
						}else if($.inArray(UserProfile.getUserId(), collabRoom.readWriteUsers) == -1){
							return;
						}
					}
					
					//Distinguish item from My Map
					collabRoom.featureType = "collabroom";
					
					this.rooms.push(collabRoom);
					var item = this.getView().addMenuItem(collabRoom);
					if(item){
						item.on("click", this.openCollabRoom, this);
					}
				}
			},
			
			setAdmin: function(e, response){
				if(response.count == 1){
					this.isAdmin = true;
				}
			},
			
			/**** Util Methods - make private? ***/
			getLoadCollabRoomUrl: function(incidentId, userid){
				return Ext.String.format("{0}/collabroom/{1}?userId={2}", 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						incidentId, userid);
			},
			
			getCreateCollabRoomUrl: function(incidentId, userOrgId){
				return Ext.String.format("{0}/collabroom/{1}?userOrgId={2}&orgId={3}&workspaceId={4}", 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						incidentId, userOrgId, UserProfile.getOrgId(), UserProfile.getWorkspaceId());
			},
			
			toggleEnableNewRoom: function(enabled) {
				this.view.menu.lookupReference('createRoomBtn').setDisabled(!enabled);
			},
			
			addCollabRoomPermissions: function(collabroom){
				if(this.secureRoomController &&
						this.secureRoomController.secureRoom){
					collabroom.adminUsers = this.secureRoomController.getAdminUsers();
					collabroom.readWriteUsers = this.secureRoomController.getReadWriteUsers();
				}
				return collabroom;
			}
		});
});
