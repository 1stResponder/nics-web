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
			
			sysrole: ['Super User', 'NICS User', 'Read Only User', 'GIS User', 'Administrator'],
			
			init: function(){
				this.model = new AccountInfoModel();
				
				this.mediator = Core.Mediator.getInstance();
			
				this.bindEvents();
			},
			
			bindEvents: function(){
				
				this.getView().accountInfoButton.on("click", this.showAccountInfo, this);

				Core.EventManager.addListener("nics.user.profile.loaded", this.setButtonLabel.bind(this));
				Core.EventManager.addListener("nics.accountInfo.submit", this.submitAccountInfo.bind(this));	
				Core.EventManager.addListener("nics.accountInfo.response",this.accountInfoResponse.bind(this));	
			},
			
			showAccountInfo: function(){
				this.getView().accountWindow.show();
				this.setAccountInfo();
			},
			
			submitAccountInfo: function(e){
				
				var userid = UserProfile.getUserId();
				var username = UserProfile.getUsername();
				var userorgid = UserProfile.getUserOrgId();
				var workspaceid = UserProfile.getWorkspaceId();
				var firstname = this.getView().userAccountTab.getForm().findField('firstname').getValue();
				var lastname = this.getView().userAccountTab.getForm().findField('lastname').getValue();
				var rank = this.getView().userAccountTab.getForm().findField('rank').getValue();
				var job = this.getView().userAccountTab.getForm().findField('job').getValue();
				var desc = this.getView().userAccountTab.getForm().findField('desc').getValue();
				var oldpw = this.getView().userAccountTab.getForm().findField('oldpw').getValue();
				var newpw = this.getView().userAccountTab.getForm().findField('newpw').getValue();
				var confirmpw = this.getView().userAccountTab.getForm().findField('confirmpw').getValue();

				
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
			
				var url = Ext.String.format("{0}/users/{1}/updateprofile",
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					workspaceid);
				
				
				
				var body = { 'userName': username, 'userId': userid, 'userOrgId': userorgid, 'firstName': firstname, 'lastName': lastname, 'oldPw': oldpw, 'newPw': newpw, 
					'jobTitle': job, 'rank': rank, 'jobDesc': desc};
				
				this.mediator.sendPostMessage(url,"nics.accountInfo.response",body);
				
			},
			
			accountInfoResponse: function(event, response){
				  	
				if(response.message == "ok"){
					
					UserProfile.setFirstName(response.userFirstname);
					UserProfile.setLastName(response.userLastname);
					UserProfile.setSystemRoleId(response.sysRoleId);
					
					UserProfile.setDesc(response.description);
					UserProfile.setJobTitle(response.jobTitle);
					UserProfile.setRank(response.rank);
	
					this.getView().setButtonLabel(UserProfile.getNickName());
					
					Ext.MessageBox.alert("NICS","User info has been updated.");
				}	  
				else{
					Ext.MessageBox.alert("NICS","Failed: " + response.message);
				}
				
				this.getView().setFormField('oldpw','');
				this.getView().setFormField('newpw','');
				this.getView().setFormField('confirmpw','');
				
			},
			
			setAccountInfo: function(){
				
				this.getView().setButtonLabel(UserProfile.getNickName());
				this.getView().setFormField('username',UserProfile.getUsername());
				this.getView().setFormField('org',UserProfile.getOrgName());
				this.getView().setFormField('firstname',UserProfile.getFirstName());
				this.getView().setFormField('lastname',UserProfile.getLastName());
				this.getView().setFormField('rank',UserProfile.getRank());
				this.getView().setFormField('desc',UserProfile.getDesc());
				this.getView().setFormField('job',UserProfile.getJobTitle());
				this.getView().setFormField('sysrole',this.sysrole[UserProfile.getSystemRoleId()]);
				this.getView().setFormField('oldpw','');
				this.getView().setFormField('newpw','');
				this.getView().setFormField('confirmpw','');
			
			},
			
			setButtonLabel: function(e){
				this.getView().setButtonLabel(UserProfile.getNickName());
			},
			
	});
});
