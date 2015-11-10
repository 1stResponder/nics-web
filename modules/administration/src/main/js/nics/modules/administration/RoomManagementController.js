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
define(['ext', 'iweb/CoreModule','nics/modules/UserProfileModule'],
         function(Ext, Core, UserProfile){
	
	return Ext.define('modules.administration.RoomManagementController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.roommanagementcontroller',
		
		adminRooms: [],
		
		collabRoomId: null,
		
		incidentId: null,
		
		userId: null,

		init: function(){
			this.mediator = Core.Mediator.getInstance();
			Core.EventManager.addListener('nics.administration.collabroom.permission', this.setAdminRooms.bind(this));
			Core.EventManager.addListener('nics.administration.collabroom.admin', this.addAdminRoom.bind(this));
			Core.EventManager.addListener('nics.collabroom.activate', this.onActivateRoom.bind(this));
			Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
		},

		setAdminRooms: function(evt, rooms){
			this.adminRooms = rooms;
		},
		
		addAdminRoom: function(evt, collabRoomId){
			this.adminRooms.push(collabRoomId);
		},
		
		onActivateRoom: function(evt, collabRoomId){
			this.collabRoomId = collabRoomId;
			if($.inArray(collabRoomId, this.adminRooms) != -1){
				this.getView().addUnsecure();
			}else{
				this.getView().removeUnsecure();
			}
		},
		
		onJoinIncident: function(evt, incident){
			this.incidentId = incident.id;
		},
		
		onUnsecureRoomClick: function(checkbox) {
			if(checkbox.checked){
				//Remove the session from the database
				var topic = Core.Util.generateUUID();
				
				Core.EventManager.createCallbackHandler(topic, this, 
						function(evt, response){
							if(response.message != "OK"){
								Ext.MessageBox.alert("NICS", response.message);
							}else{
								this.getView().removeUnsecure();
								var pos = $.inArray(this.collabRoomId, this.adminRooms);
								this.adminRooms.splice(pos, 1);
							}
							this.getView().uncheck();
							this.getView().close();
				});
				
				var url = Ext.String.format("{0}/collabroom/{1}/unsecure/{2}?userId={3}",
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						this.incidentId, this.collabRoomId, UserProfile.getUserId());
				
				this.mediator.sendDeleteMessage(url, topic);
			}
		}
	});
});
