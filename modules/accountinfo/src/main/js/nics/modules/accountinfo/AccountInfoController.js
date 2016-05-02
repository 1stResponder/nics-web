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
define(['iweb/CoreModule',  './AccountInfoModel','nics/modules/UserProfileModule', './ChangeOrgViewer'], 

	function(Core, AccountInfoModel, UserProfile, ChangeOrgViewer ){
	
		Ext.define('modules.accountinfo.AccountInfoController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.accountinfocontroller',
			
			contactList: ['Email', 'Home Phone', 'Cell Phone', 'Office Phone', 'Radio Number', 'Other Phone'],
			
			init: function(){
				this.model = new AccountInfoModel();
				
				this.mediator = Core.Mediator.getInstance();
			
				this.bindEvents();
			},
			
			bindEvents: function(){
				
				this.getView().accountInfoButton.on("click", this.showAccountInfo, this);
				this.getView().changeOrgButton.on("click", this.changeOrgInfo, this);
				
				var submitButton = this.getView().userAccountTab.lookupReference('submitButton');
				if(submitButton){
					submitButton.on('click', this.submitAccountInfo, this);
				}
				
				var addButton = this.getView().userContactTab.lookupReference('addButton');
				if(addButton){
					addButton.on('click', this.addContactInfo, this);
				}
				
				var deleteButton = this.getView().userContactTab.lookupReference('deleteButton');
				if(deleteButton){
					deleteButton.on('click', this.deleteContactInfo, this);
				}

				Core.EventManager.addListener("nics.user.profile.loaded", this.onProfileLoaded.bind(this));
				Core.EventManager.addListener("nics.user.contact.set", this.setContactInfo.bind(this));
				Core.EventManager.addListener("nics.user.contact.validate", this.validateContactInfo.bind(this));
				Core.EventManager.addListener("nics.user.contact.add", this.onAddContactInfo.bind(this));
				Core.EventManager.addListener("nics.user.contact.delete", this.onDeleteContactInfo.bind(this));
				Core.EventManager.addListener("nics.accountInfo.response",this.accountInfoResponse.bind(this));	
				
				
			},
			
			showAccountInfo: function(profile){
				if(profile == "Forbidden"){
					Ext.MessageBox.alert("Permissions Error", "You do not have permission to view this profile");
					return;
				}
				
				//show
				this.getView().accountInfoTabs.setActiveTab(0);
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
						description: UserProfile.getDesc(),
						jobTitle: UserProfile.getJobTitle(),
						sysRoleId: UserProfile.getSystemRoleId()
					});
				}
				
				this.enableButtons();
				
				this.getContactInfo(this.username);

				
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
						return Ext.MessageBox.alert("Input Error", "Please include your old password.");
					}
					
					
					if(newpw != confirmpw){
						return Ext.MessageBox.alert("Input Error", "New passwords do not match.");
					}
					
					if(oldpw && (!newpw || !confirmpw)){
						return Ext.MessageBox.alert("Input Error", "Please include a new password.");
					}
					
					if(oldpw == newpw){
						return Ext.MessageBox.alert("Input Error", "Password can not match old password. Please enter a new password.");
					}
					
					var numCheck = new RegExp("[0-9]");
					var lowerCaseCheck = new RegExp("[a-z]"); 
					var capCaseCheck = new RegExp("[A-Z]");
					var symbolCheck = new RegExp("[\\#\\-\\_\\!\\@]");
					
					if(newpw.length < 8 || newpw.length > 20 || !numCheck.test(newpw) || !lowerCaseCheck.test(newpw) || !capCaseCheck.test(newpw) || !symbolCheck.test(newpw)){
						return Ext.MessageBox.alert("Input Error", "Your password must be a minimum 8 characters long and a maximum of 20 with at least one digit, one upper case letter, one lower case letter and one special symbol (“#-_!@”)");
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
					Ext.MessageBox.alert("Permissions Error", "You do not have permission to edit this profile");
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
					
					Ext.MessageBox.alert("Status","User info has been updated.");
				}	  
				else{

					Ext.MessageBox.alert("Status","Failed: " + response.message);
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
						if (!this.view.userAccountTab.getForm().findField('sysrole')){
						this.view.userAccountTab.add({
							xtype: 'combobox',
							width: '75%',
							reference:'systemRole',
							store : roles,
							forceSelection: true,
							queryMode: 'local',
							fieldLabel: 'System Role',
							valueField: 'name',
							name: 'sysrole'
						});
				}
					}, [UserProfile]
				);
				
				
				var url = Ext.String.format('{0}/users/{1}/systemroles', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId());

				this.mediator.sendRequestMessage(url, topic);
				
				this.getContactInfo(UserProfile.getUsername());

				this.mediator.sendRequestMessage(url,topic);
				//Now get orgs for org drop down
				var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);
				var url = Ext.String.format("{0}/users/{1}/userOrgs?userName={2}",
						endpoint, UserProfile.getWorkspaceId(), UserProfile.getUsername());
				
				this.mediator.sendRequestMessage(url, "nics.userorg.loads");
				
			},
			
			
			setButtonLabel: function(event){
				this.getView().setButtonLabel(UserProfile.getNickName());
			},
			
			getContactInfo: function(username){

					
					this.getView().userContactTab.store.removeAll();
					
					var url = Ext.String.format("{0}/users/{1}/contactinfo?userName={2}",
						Core.Config.getProperty(UserProfile.REST_ENDPOINT), UserProfile.getWorkspaceId(), username);
				
					var topic = 'nics.user.contact.set';
				
					this.mediator.sendRequestMessage(url, topic);
					
			},
			
			setContactInfo: function(event, response){

				if(response.users && response.users[0] && response.users[0].contacts){
				
					this.getView().userContactTab.store.loadRawData(response.users[0].contacts);
				
				}

			},
			
			addContactInfo: function(event){
				
				var rowEdit = this.getView().userContactTab.getPlugin('rowediting');
				
				if(!rowEdit.editing){
				
					var record = { 
						contacttypeid: -1,
						value: ""
					
					};
					
					this.getView().userContactTab.store.insert(0,record);
					
					rowEdit.startEdit(0,0);
				
				}
			},
			
			deleteContactInfo: function(event){
				
				var selected = this.getView().userContactTab.getSelectionModel().getSelection()[0];
				
				if(selected != null){
					
					var contactId = selected.get('contactid');
					var value = selected.get('value');
				
					var topic = "nics.user.contact.delete";
				
					var url = Ext.String.format("{0}/users/{1}/deletecontactinfo?userName={2}&contactId={3}",
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId(),
						UserProfile.getUsername(),
						contactId
					);
					
					this.mediator.sendDeleteMessage(url,topic);	
					
				}
				
			},
			
			onDeleteContactInfo: function(event, response){
				if(response.message == "OK"){
					var selected = this.getView().userContactTab.getSelectionModel().getSelection()[0];
					this.view.userContactTab.store.remove(selected);
				}
			},
			
			validateContactInfo: function(event, context){
				
				if(context.newValues.contacttypeid == 'N/A'){
					this.getView().userContactTab.store.removeAt(0);
				}
				else{
				
					var topic = "nics.user.contact.add";
				
					var url = Ext.String.format("{0}/users/{1}/updatecontactinfo?userName={2}&contactTypeId={3}&value={4}",
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId(),
						UserProfile.getUsername(),
						context.newValues.contacttypeid,
						context.newValues.value
					);
					
					this.mediator.sendPostMessage(url,topic);
				
				}
			},
			
			onAddContactInfo: function(event, response){
				if(response.message == "OK"){
					var contact = this.getView().userContactTab.store.getAt(0);
					contact.set('contactid',response.users[0].contacts[0].contactid);
					this.getView().userContactTab.store.commitChanges();
				}else{
					Ext.MessageBox.alert("Status", response.message);
				}
			},
			
			changeOrgInfo: function(profile){
				if(profile == "Forbidden"){
					Ext.MessageBox.alert("Permission Error", "You do not have permission to view this profile");
					return;
				}
				
				//show tab
				this.getView().organizationWindow.show();
				
				
			},
			
			enableButtons: function(){
				this.getView().userContactTab.getAddButton().enable();
				this.getView().userContactTab.getDeleteButton().enable();
			},
			
			
			disableButtons: function(){
				this.getView().userContactTab.getAddButton().disable();
				this.getView().userContactTab.getDeleteButton().disable();

			}
	
		
			
	});
});
