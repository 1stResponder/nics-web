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
define([
         "iweb/CoreModule", "nics/modules/UserProfileModule", "./ChangeOrgModel"], 
	function(Core, UserProfile, ChangeOrgModel){
		Ext.define('modules.accountinfo.ChangeOrgController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.changeorgcontroller',
			
			 init: function() {
				this.mediator = Core.Mediator.getInstance();
				this.model = new ChangeOrgModel();
			    this.bindEvents();
			    
			    
			},
			
			bindEvents: function(){
				Core.EventManager.addListener('nics.userorg.loads', this.loadUserOrgs.bind(this));
				Core.EventManager.addListener('nics.changeorgs.load', this.loadUserOrgs.bind(this));
				Core.EventManager.addListener("nics.user.profile.loaded", this.onProfileLoaded.bind(this));
				
			},
			load: function(){
				this.mediator.sendRequestMessage(this.url, 'nics.changeorgs.load');
			},
			onProfileLoaded: function(){
				var url = Ext.String.format("{0}/users/{1}/userOrgs?userName={2}",
						Core.Config.getProperty(UserProfile.REST_ENDPOINT), UserProfile.getWorkspaceId(), UserProfile.getUsername());
				
				this.mediator.sendRequestMessage(url, "nics.userorg.loads");
			},

			loadUserOrgs: function(e, info){
				this.userId = info.userId;
				var userOrgs = info.userOrgs;
				if (userOrgs.length == 0) {
					this.showEmptyErrorMsg();
				} else if (userOrgs.length == 1) {
					//turn off button,
					 Ext.getCmp('changeOrgButton').setHidden(true);
				} else {
					this.showOrgsDropdown(userOrgs);
					
				}
			},
			
			onOkButtonClick: function(button) {
				var dropdown = this.getView().lookupReference('changeOrgDropdown');
				var value = dropdown.getValue();
				var userOrg = dropdown.findRecordByValue(value);
				
				if (userOrg) {
					this.setUserOrg(userOrg.getData());
					Ext.MessageBox.alert("NICS","User organization has been changed.");
				}
			}, 
			
			showOrgsDropdown: function(userOrgs) {
				var dropdown = this.getView().lookupReference('changeOrgDropdown');
				
				var store = dropdown.getStore();
				store.loadData(userOrgs);
				var currentOrg = UserProfile.getUserOrgId();
				if (currentOrg) {
					dropdown.select(currentOrg);
				} else {
					dropdown.select(store.getAt(0));
				}
				
			},
			
			showEmptyErrorMsg: function() {
				var view = this.getView();
				view.show();
				view.mask(view.NoOrgsError);
			},
			
			setUserOrg: function(userOrg){
				//Create a new User Session

				var topic = "nics.changeuser.usersession.callback";
				
				Core.EventManager.createCallbackHandler(topic, this, this.setUserSessionId, [userOrg]);
				
				var url = Ext.String.format("{0}/users/{1}/updatesession?userId={2}&displayName={3}&userOrgId={4}&systemRoleId={5}&sessionId={6}",
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId(), 
						this.userId, 
						UserProfile.getUsername(),
						userOrg.userorgid, 
						userOrg.systemroleid, 
						UserProfile.getSessionId());
				
				this.mediator.sendPostMessage(url,topic,{});
			},
			
			setUserSessionId: function(userOrg, event, response){
				//Should probably send "onReady" event here for other modules...
				if(response && response.userSession){
					userOrg.usersessionId = response.userSession.usersessionid;
					userOrg.currentUsersessionId = response.userSession.currentusersessionid;
					userOrg.userId = response.userSession.userid;
					

				}else{
					this.logout();
				}
				//log out otherwise...no session id!
				
				var _mediator = this.mediator;
				var _userProfile = UserProfile;
				var config = Core.Config;
				Core.EventManager.fireEvent("nics.userorg.change", userOrg);
			},
			
			showChangeOrg: function(profile){
				if(profile == "Forbidden"){
					Ext.MessageBox.alert("NICS", "You do not have permission to view this profile");
					return;
				}
				
				
			},
			
		
		
		});
});
