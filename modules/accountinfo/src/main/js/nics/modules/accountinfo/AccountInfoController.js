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
define(['iweb/CoreModule', 
         './AccountInfoModel',
         'nics/modules/UserProfileModule'], 

	function(Core, AccountInfoModel, UserProfile){
	
		Ext.define('modules.accountinfo.AccountInfoController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.accountinfocontroller',
			
			init: function(){
				this.model = new AccountInfoModel();
				
				this.mediator = Core.Mediator.getInstance();
			
				this.bindEvents();
			},
			
			bindEvents: function(){
				
				this.getView().accountInfoButton.on("click", this.showAccountInfo, this);
				
				var submitButton = this.view.userAccountTab.lookupReference('submitButton');
				if(submitButton){
					submitButton.on('click', this.submitAccountInfo, this);
				}

				Core.EventManager.addListener("nics.user.profile.loaded", this.onProfileLoaded.bind(this));
				Core.EventManager.addListener("nics.accountInfo.response",this.accountInfoResponse.bind(this));	
			},
			
			showAccountInfo: function(profile){
				if(profile == "Forbidden"){
					Ext.MessageBox.alert("NICS", "You do not have permission to view this profile");
					return;
				}
				
				//show
				this.getView().accountWindow.show();
				
				if(profile.username){
					this.username = profile.username;
					this.userid = profile.userId;
					this.userorgid = profile.userOrgId;
					
					this.setAccountInfo(profile);
				}else{
					this.username = UserProfile.getUsername();
					this.userid = UserProfile.getUserId();
					this.userorgid = UserProfile.getUserOrgId();

					this.setAccountInfo({
						username: UserProfile.getUsername(),
						orgName: UserProfile.getOrgName(),
						userFirstname: UserProfile.getFirstName(),
						userLastname: UserProfile.getLastName(),
						rank: UserProfile.getRank(),
						desc: UserProfile.getDesc(),
						job: UserProfile.getJobTitle(),
						sysRoleId: UserProfile.getSystemRoleId()
					});
				}
			},
			
			submitAccountInfo: function(e){
				
				var workspaceid = UserProfile.getWorkspaceId();
				var firstname = this.getView().userAccountTab.getForm().findField('firstname').getValue();
				var lastname = this.getView().userAccountTab.getForm().findField('lastname').getValue();
				var rank = this.getView().userAccountTab.getForm().findField('rank').getValue();
				var job = this.getView().userAccountTab.getForm().findField('job').getValue();
				var desc = this.getView().userAccountTab.getForm().findField('desc').getValue();
				var oldpw = this.getView().userAccountTab.getForm().findField('oldpw').getValue();
				var newpw = this.getView().userAccountTab.getForm().findField('newpw').getValue();
				var confirmpw = this.getView().userAccountTab.getForm().findField('confirmpw').getValue();
				var sysRoleId = this.getView().userAccountTab.getForm().findField('sysrole').getValue();

				
				if(oldpw || newpw || confirmpw){
					
					if(!oldpw){
						return Ext.MessageBox.alert("NICS", "Please include your old password.");
					}
					
					
					if(newpw != confirmpw){
						return Ext.MessageBox.alert("NICS", "New passwords do not match.");
					}
					
					if(oldpw && (!newpw || !confirmpw)){
						return Ext.MessageBox.alert("NICS", "Please include a new password.");
					}
					
					if(oldpw == newpw){
						return Ext.MessageBox.alert("NICS", "Password can not match old password. Please enter a new password.");
					}
					
					var numCheck = new RegExp("[0-9]");
					var lowerCaseCheck = new RegExp("[a-z]"); 
					var capCaseCheck = new RegExp("[A-Z]");
					var symbolCheck = new RegExp("[\\#\\-\\_\\!\\@]");
					
					if(newpw.length < 8 || newpw.length > 20 || !numCheck.test(newpw) || !lowerCaseCheck.test(newpw) || !capCaseCheck.test(newpw) || !symbolCheck.test(newpw)){
						return Ext.MessageBox.alert("NICS", "Your password must be a minimum 8 characters long and a maximum of 20 with at least one digit, one upper case letter, one lower case letter and one special symbol (“#-_!@”)");
					}
					
				}
			
				var url = Ext.String.format("{0}/users/{1}/updateprofile?requestingUserOrgId={2}",
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					workspaceid, UserProfile.getUserOrgId());
				
				
				
				var body = { 'userName': this.username, 'userId': this.userid, 'userOrgId': this.userorgid, 'firstName': firstname, 'lastName': lastname, 'oldPw': oldpw, 'newPw': newpw, 
					'jobTitle': job, 'rank': rank, 'jobDesc': desc, 'sysRoleId' : sysRoleId};
				
				this.mediator.sendPostMessage(url,"nics.accountInfo.response",body);
				
			},
			
			accountInfoResponse: function(event, response){
				if(response == "Forbidden"){
					Ext.MessageBox.alert("NICS", "You do not have permission to edit this profile");
					return;
				}
				
				  	
				if(response.message == "ok"){
					
					UserProfile.setFirstName(response.userFirstname);
					UserProfile.setLastName(response.userLastname);
					UserProfile.setSystemRoleId(response.sysRoleId);
					
					UserProfile.setDesc(response.description);
					UserProfile.setJobTitle(response.jobTitle);
					UserProfile.setRank(response.rank);
	
					if(response.userId == UserProfile.getUserId()){
						this.getView().setButtonLabel(UserProfile.getNickName());
					}
					
					Ext.MessageBox.alert("NICS","User info has been updated.");
				}	  
				else{

					Ext.MessageBox.alert("NICS","Failed: " + response.message);
				}
				
				this.getView().setFormField('oldpw','');
				this.getView().setFormField('newpw','');
				this.getView().setFormField('confirmpw','');
				
			},
			
			setAccountInfo: function(profile){
				this.getView().setFormField('username', profile.username);
				this.getView().setFormField('org', profile.orgName);
				this.getView().setFormField('firstname',profile.userFirstname);
				this.getView().setFormField('lastname', profile.userLastname);
				this.getView().setFormField('rank', profile.rank);
				this.getView().setFormField('desc',profile.description);
				this.getView().setFormField('job',profile.jobTitle);
				
				var currentUser = (profile.username == UserProfile.getUsername());
				
				this.getView().userAccountTab.getForm().findField('oldpw').setDisabled(!currentUser);
				this.getView().userAccountTab.getForm().findField('newpw').setDisabled(!currentUser);
				this.getView().userAccountTab.getForm().findField('confirmpw').setDisabled(!currentUser);
				
				if(currentUser){
					this.getView().setFormField('oldpw','');
					this.getView().setFormField('newpw','');
					this.getView().setFormField('confirmpw','');
				}
				
				this.getView().userAccountTab.getForm().findField('sysrole').setValue(profile.sysRoleId);
				//Only a super user can modify a super user
				if(profile.sysRoleId == 0 && !UserProfile.isSuperUser()){
					this.getView().userAccountTab.getForm().findField('sysrole').disable();
				}else if(UserProfile.isAdminUser() || UserProfile.isSuperUser()){
					this.getView().userAccountTab.getForm().findField('sysrole').enable();
				}else{
					this.getView().userAccountTab.getForm().findField('sysrole').disable();
				}
			},
			
			onProfileLoaded: function(){
				this.setButtonLabel();
				//load the user roles
				var topic = Core.Util.generateUUID();
				//populate the system roles
				Core.EventManager.createCallbackHandler(topic, this, 
					function(UserProfile, evt, response){
						var roles = [];
						for(var i=0; i<response.length; i++){
							if(response[i].systemroleid == 0){
								if(UserProfile.getSystemRoleId() == 0){
									roles.push([response[i].systemroleid, response[i].rolename]);
								}
							}else{
								roles.push([response[i].systemroleid, response[i].rolename]);
							}
						}
						this.view.userAccountTab.add({
							xtype: 'combobox',
							width: '75%',
							store : roles,
							forceSelection: true,
							queryMode: 'local',
							fieldLabel: 'System Role',
							valueField: 'name',
							name: 'sysrole'
						});
					}, [UserProfile]
				);
				
				var url = Ext.String.format('{0}/users/{1}/systemroles', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId());
				
				this.mediator.sendRequestMessage(url, topic);
			},
			
			setButtonLabel: function(e){
				this.getView().setButtonLabel(UserProfile.getNickName());
			}
			
	});
});
