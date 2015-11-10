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
	
	return Ext.define('modules.administration.SecureRoomController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.secureroomcontroller',
		
		secureRoom: false,
		
		init: function(){
			this.mediator = Core.Mediator.getInstance();
		},
		
		loadUsers: function(){
			var grid = this.getView().getFirstGrid();
			
			var topic = Core.Util.generateUUID();
			
			//populate the user grids
			Core.EventManager.createCallbackHandler(topic, this, 
					function(evt, response){
						if(response.users){
							var data = [];
							for(var i=0; i<response.users.length;i++){
								data.push([response.users[i].username, 
								           	response.users[i].userId,
								           	"", ""]);
							}
							grid.getStore().loadData(data);
						}
					}
			);
			
			var url = Ext.String.format('{0}/users/{1}', 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					this.workspaceId);
			
			this.mediator.sendRequestMessage(url, topic);
		},
		
		getAdminUsers: function(){
			var users = this.getUsers(this.getView().getThirdGrid());
			
			//Add the current user as an admin
			if($.inArray(this.userId, users) == -1){
				users.push(this.userId);
			}
			return users;
		},
		
		getReadWriteUsers: function(){
			return this.getUsers(this.getView().getSecondGrid());
		},
		
		getUsers: function(grid){
			var store = grid.getStore();
			var ids = [];
			for(var i=0; i<store.count(); i++){
				ids.push(store.getAt(i).data.userid);
			}
			return ids;
		},
		
		setWorkspaceId: function(workspaceId){
			this.workspaceId = workspaceId;
		},
		
		setUserId: function(userId){
			this.userId = userId;
		}
	});
});
