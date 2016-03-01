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
define(['ext', 'iweb/CoreModule','nics/modules/UserProfileModule',
        'nics/modules/administration/UserLookupView'],
         function(Ext, Core, UserProfile, UserLookupView){
	
	return Ext.define('modules.administration.SecureRoomController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.secureroomcontroller',
		
		secureRoom: false,
		
		init: function(){
			this.mediator = Core.Mediator.getInstance();
			this.lookupWindow = new UserLookupView({
	            	callback: { fnc: this.addUsers, scope: this}
			});
		},
		
		onLookupUsersButtonClick: function(){
			this.lookupWindow.show();
		},
		
		addUsers: function(selected){
			var grid = this.getView().getFirstGrid();
			var data = [];
			for(var i=0; i<selected.length; i++){
				data.push([selected[i].data.username,
				           selected[i].data.userId,
				           "",""]);
			}
			grid.getStore().loadData(data, true);
		},
		
		loadUnsecureUsers: function(incidentId, collabRoomId){
			var grid = this.getView().getFirstGrid();
			
			var topic = Core.Util.generateUUID();
			
			//populate the user grids
			Core.EventManager.createCallbackHandler(topic, this, 
					function(evt, response){
						if(response.data && response.data.length > 0){
							var data = [];
							for(var i=0; i<response.data.length;i++){
								var user = response.data[i];
								data.push([user.username, user.userid,	"", ""]);
							}
							grid.getStore().loadData(data);
						}
					}
			);
			
			if(!collabRoomId){
				collabRoomId = -1;
			}
			
			var url = Ext.String.format('{0}/collabroom/{1}/users/{2}/unsecure/{3}?orgId={4}', 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					incidentId, UserProfile.getWorkspaceId(), collabRoomId, UserProfile.getOrgId(),
					UserProfile.getUserOrgId());
			
			this.mediator.sendRequestMessage(url, topic);
		},
		
		loadSecureUsers: function(incidentId, collabroomId){
			var grid = this.getView().getFirstGrid();
			var readWriteGrid = this.getView().getSecondGrid();
			var adminGrid = this.getView().getThirdGrid();
			
			var topic = Core.Util.generateUUID();
			
			//populate the user grids
			Core.EventManager.createCallbackHandler(topic, this, 
					function(evt, response){
						var adminUsers = [];
						var readWriteUsers = [];
						if(response.data && response.data.length > 0){
							for(var i=0; i<response.data.length;i++){
								var user = response.data[i];
								var userData = [user.username, user.userid,	"", ""];
								if(user.systemroleid == 4){
									adminUsers.push(userData);
								}else{
									readWriteUsers.push(userData);
								}
							}
							if(adminUsers.length > 0){
								adminGrid.getStore().loadData(adminUsers);
							}
							if(readWriteUsers.length > 0){
								readWriteGrid.getStore().loadData(readWriteUsers);
							}
						}
					}
			);
			
			var url = Ext.String.format('{0}/collabroom/{1}/users/{2}', 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					incidentId, collabroomId);
			
			this.mediator.sendRequestMessage(url, topic);
		},
		
		getAdminUsers: function(){
			
			var users = this.getUsers(this.getView().getThirdGrid());
			
			//If current user is not an admin
			if($.inArray(UserProfile.getUserId(), users) == -1){
				var rwUsers = this.getUsers(this.getView().getSecondGrid());
				var index = $.inArray(UserProfile.getUserId(), rwUsers);
				
				if(index == -1){ //User did not indicate ReadWrite user, make them an admin
					users.push(UserProfile.getUserId());
				}else{
					if(users.length == 0){ //If user indicated ReadWrite but no other admins, make user an admin
						users.push(UserProfile.getUserId());
					}
				}
			}
			return users;
		},
		
		getReadWriteUsers: function(){
			return this.getUsers(this.getView().getSecondGrid()); 
		},
		
		clearAdminUsers: function(){
			this.getView().getThirdGrid().store.removeAll();
		},
		
		clearReadWriteUsers: function(){
			this.getView().getSecondGrid().store.removeAll();
		},
		
		getUsers: function(grid){
			var store = grid.getStore();
			var ids = [];
			for(var i=0; i<store.count(); i++){
				ids.push(store.getAt(i).data.userid);
			}
			return ids;
		}
	});
});
