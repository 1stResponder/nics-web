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
define(['ext', 'iweb/CoreModule', "./ActiveUsersModel", 'nics/modules/UserProfileModule'],
		function(Ext, Core, ActiveUsersModel, UserProfile){
	
	return Ext.define('modules.activeusers.ActiveUsersController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.activeuserscontroller',

		init: function(){
			this.mediator = Core.Mediator.getInstance();

			Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.onLoadUserProfile.bind(this));
			Core.EventManager.addListener("NICS.activeUsers", this.onLoadActiveUsers.bind(this));
		},
		
		onLoadUserProfile: function(e) {
			//request the active users
			var url = Ext.String.format("{0}/users/{1}/active", 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId());
			this.mediator.sendRequestMessage(url, "NICS.activeUsers");
			
			var loginTopic = Ext.String.format("iweb.NICS.{0}.login", UserProfile.getWorkspaceId());
			this.mediator.subscribe(loginTopic);
			Core.EventManager.addListener(loginTopic, this.onUserLogin.bind(this));
			
			var logoutTopic = Ext.String.format("iweb.NICS.{0}.logout", UserProfile.getWorkspaceId());
			this.mediator.subscribe(logoutTopic);
			Core.EventManager.addListener(logoutTopic, this.onUserLogout.bind(this));
		},
		
		onLoadActiveUsers: function(e, response) {
			//load store with all active users
			this.view.store.loadRawData(response.users);
		},
		
		onUserLogin: function(evt, user) {
			//append new data to store
			this.view.store.loadRawData(user, true);
		},
		
		onUserLogout: function(evt, userSessionId) {
			var store = this.view.store;
			var results = store.query('currentusersessionid', userSessionId);
			if (results && results.length) {
				store.remove(results.getRange());
			}
		},
		
		onSelectionChange: function(grid, selected, eOpts) {
			//enable our button if there is a selection
			var button = this.lookupReference('chatButton');
			
			//filter current user from selection
			var filtered = this.filterUsersArray(UserProfile.getUserId(), selected);
			if (filtered.length) {
				button.enable();
			} else {
				button.disable();
			}
		},
		
		onChatButtonClick: function() {
			var selected = this.view.getSelectionModel().getSelection();
			var filtered = this.filterUsersArray(UserProfile.getUserId(), selected);
			
			//build an occupants list
			var occupants = filtered.map(function(user){
				return {
					userId: user.getId(),
					nickname: user.get('fullname')
				};
			})
			
			//kick off a new private chat request
			Core.EventManager.fireEvent("startPrivateChat", {
				to: occupants
			});
		},
		
		/**
		 * Removes the specified userId from the provided array of ActiveUserModels.
		 * 
		 * @returns A new array with the specified user model removed.
		 */
		filterUsersArray: function(userId, array) {
	 		var clone = array.slice();
			var item = Ext.Array.findBy(clone, function(user, index) {
	 			return user.getId() === userId;
	 		});
	 		Ext.Array.remove(clone, item);
	 		return clone;
		}
	});
});
