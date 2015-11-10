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
define([
         "iweb/CoreModule", "./LoginModel", "nics/modules/UserProfileModule"], 
	function(Core, LoginModel, UserProfile){
	
		var LOGOUT = false;
	
		Ext.define('modules.login.LoginPresenter', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.logincontroller',
			
			init: function() {
				this.mediator = Core.Mediator.getInstance();
				
				this.setCookies();
			
			    this.bindEvents();
			    
			    var timeout = Core.Config.getProperty("token.timeout");//in minutes
			    if(!timeout){
			    	timeout = 1810 * 1000;
			    }else{
			    	timeout = timeout * 6000;
			    }
			    
			    window.setInterval(this.refreshToken.bind(this), timeout);
			},
			
			bindEvents: function(){
				Core.EventManager.addListener(Core.Config.CONFIG_LOADED, this.setCookies.bind(this));
				Core.EventManager.addListener(UserProfile.PROPERTIES_LOADED, this.requestUserOrgs(this));
				Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.setReinitUrl.bind(this));
				
				Core.EventManager.addListener('nics.userorg.load', this.loadUserOrg.bind(this));
				Core.EventManager.addListener('onLogout', this.logout.bind(this));
			},
			
			logout: function(){
				LOGOUT = true;
				
				Core.EventManager.fireEvent('logout'); //Give everyone a chance to clean up
				
				//Remove the session from the database
				var _mediator = this.mediator;
				var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);
				if(UserProfile.getCurrentUserSessionId()){
					var url = Ext.String.format("{0}/users/{1}/removesession?currentUserSessionId={2}",
							endpoint,
							UserProfile.getWorkspaceId(), 
							UserProfile.getCurrentUserSessionId());
					
					this.mediator.sendPostMessage(url,"", {});
				}
				
				//remove from openam
				var topic = "nics.logout.usersession.callback";
				Core.EventManager.createCallbackHandler(topic, this, function(){
					_mediator.close();
					location.href = "./login";
				});
				
				this.mediator.sendDeleteMessage(
						Ext.String.format("{0}/login/{1}", endpoint, UserProfile.getUsername()), topic);
			},
			
			logoutFromMessage: function(){
				if(!LOGOUT){
					LOGOUT = true;
					
					Core.EventManager.fireEvent('logout'); //Give everyone a chance to clean up
					
					var _mediator = this.mediator;
					
					//remove from openam
					var topic = "nics.logout.usersession.callback";
					Core.EventManager.createCallbackHandler(topic, this, function(){
						_mediator.close();
						location.href = "./login?loggedOut=true";
					});
					
					this.mediator.sendDeleteMessage(
							Ext.String.format("{0}/login/{1}", 
									Core.Config.getProperty(UserProfile.REST_ENDPOINT), 
									UserProfile.getUsername()), topic);
				}
			},
			
			setReinitUrl: function(e, userProfile){
				this.mediator.setReinitalizeUrl('mediator?reinit=' + userProfile.userId + "&sessionId=" + UserProfile.getSessionId());
			},
			
			setCookies: function(e){
				var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);
				this.mediator.setCookies(endpoint, ["openam", "iplanet"]);
			},
			
			requestUserOrgs: function(){
				var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);
				var url = Ext.String.format("{0}/users/1/userOrgs?workspaceId={1}&userName={2}",
						endpoint, UserProfile.getWorkspaceId(),UserProfile.getUsername());
				
				this.mediator.sendRequestMessage(url, "nics.userorg.load");
			},
			
			loadUserOrg: function(e, info){
				this.userId = info.userId;
				var userOrgs = info.userOrgs;
				if (userOrgs.length == 0) {
					this.showEmptyErrorMsg();
				} else if (userOrgs.length == 1) {
					this.setUserOrg(userOrgs[0]);
				} else {
					this.showOrgsDropdown(userOrgs);
				}
			},
			
			onOkButtonClick: function(button) {
				var dropdown = this.lookupReference('orgDropdown');
				var value = dropdown.getValue();
				var userOrg = dropdown.findRecordByValue(value);
				
				if (userOrg) {
					this.setUserOrg(userOrg.getData());
					this.getView().close();
				}
			},
			
			showOrgsDropdown: function(userOrgs) {
				var dropdown = this.lookupReference('orgDropdown');
				var store = dropdown.getStore();
				store.loadData(userOrgs);
				
				//select the first default org, or the first record
				var defaultOrg = store.findRecord('defaultorg', true);
				if (defaultOrg) {
					dropdown.select(defaultOrg);
				} else {
					dropdown.select(store.getAt(0));
				}
				
				this.getView().show();
			},
			
			showEmptyErrorMsg: function() {
				var view = this.getView();
				view.show();
				view.mask(view.NoOrgsError);
			},
			
			setUserOrg: function(userOrg){
				//Create a new User Session
				var topic = "nics.login.usersession.callback";
				
				Core.EventManager.createCallbackHandler(topic, this, this.setUserSessionId, [userOrg]);
				
				var url = Ext.String.format("{0}/users/{1}/createsession?userId={2}&displayName={3}&userOrgId={4}&systemRoleId={5}&sessionId={6}",
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
					
					var logoutListener = Ext.String.format("iweb.NICS.logout.{0}", userOrg.currentUsersessionId);
					this.mediator.subscribe(logoutListener);
					
					//NOTE: Tries to remove the current usersession but it has already been removed in the endpoint
					Core.EventManager.addListener(logoutListener, this.logoutFromMessage.bind(this));
				}else{
					this.logout();
				}
				//log out otherwise...no session id!
				
				var _mediator = this.mediator;
				var _userProfile = UserProfile;
				var config = Core.Config;
				
				var onUnload = function(){
					if(!LOGOUT){
						var url = Ext.String.format("{0}/users/{1}/removesession?currentUserSessionId={2}",
								config.getProperty(UserProfile.REST_ENDPOINT),
								_userProfile.getWorkspaceId(), 
								_userProfile.getCurrentUserSessionId());
						_mediator.sendPostMessage(url,"",{});
						//NOTE: Token is not getting removed
					}
				};

				window.addEventListener("beforeunload", onUnload);
				
				Core.EventManager.fireEvent("nics.userorg.change", userOrg);
			},
			
			refreshToken: function(){
				var url = './refresh?currentUserSessionId=' + UserProfile.getCurrentUserSessionId();
				var _this = this;
				$.ajax({
			      url:  url,
			      dataType: 'json',
			      success: function(data){
			    	  if(!data.success){
			    		_this.logout(true);
			    	  }
			      },
			      error: function(param1, status, error){
			    	  location.href = "./login?loggedOut=true";
			      }
			   });
			},
			
			logoutWithMessage: function(message){
				var _mediator = this.mediator;
				Ext.Msg.show({
				    title:'NICS',
				    message: message,
				    buttons: Ext.Msg.OK,
				    icon: Ext.Msg.WARNING,
				    fn: function(btn) {
				    	 _mediator.close();
				    	 location.href = "./login";
				    }
				});
			}
		});
});
