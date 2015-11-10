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
define(["iweb/CoreModule"], 
	function(Core){
	
		return function() {
			
			var workspaceId;
			var username;
			var sessionId;
			var userOrgId;
			var userId;
			var systemRoleId;
			var orgName;
			var orgId;
			var orgPrefix;
			var orgState;
			var orgCountry;
			var incidentTypes;
			var userSessionId;
			var currentUserSessionId;
			var firstName;
			var lastName;
			var rank;
			var jobTitle;
			var description;
			
			var propertiesLoadedEvt = "nics.user.properties.loaded";
			var profileLoadedEvt = "nics.user.profile.loaded";
			
			function _init(){
				loadUserProperties();
				
				Core.EventManager.addListener("nics.userorg.change", requestUserProfile.bind(this));
				Core.EventManager.addListener("nics.user.profile.set", setUserProfile.bind(this));
			};
			
			function loadUserProperties(){
				var successHandler = setUserProperties.bind(this);
				
				$.ajax({
			      url:  'properties',
			      dataType: 'json',
			      success: successHandler,
			      error: function(param1, status, error){
			    	  alert("Error loading NICS Properties");
			      }
			   });
			};
			
			function setUserProperties(data){
				 workspaceId = data.workspaceId;
		    	 username = data.username;
		    	 sessionId = data.sessionId;
		    	 
		    	 Core.EventManager.fireEvent(propertiesLoadedEvt);
			};
			
			function requestUserProfile(event, userOrg){
				userOrgId = userOrg.userorgid;
				userId = userOrg.userId;
				orgName = userOrg.name;
				orgId = userOrg.orgid;
				orgCountry = userOrg.country;
				orgState = userOrg.state;
				systemRoleId = userOrg.systemroleid;
				userSessionId = userOrg.usersessionId;
				currentUserSessionId = userOrg.currentUsersessionId;
				
				var endpoint = Core.Config.getProperty("endpoint").rest;
				var url = Ext.String.format("{0}/users/{1}/username/{2}/userOrgId/{3}/orgName/{4}",
					endpoint,
					workspaceId,
					username,
					userOrgId,
					orgName.replace(/ /g, '%20'));
				
				Core.Mediator.getInstance().sendRequestMessage(url, "nics.user.profile.set");
			};
			
			function setUserProfile(e, data){
				incidentTypes = data.incidentTypes;
				orgPrefix = data.orgPrefix;
				firstName = data.userFirstname;
				lastName = data.userLastname;
				rank = data.rank;
				description = data.description;
				jobTitle = data.jobTitle
				
				Core.EventManager.fireEvent(profileLoadedEvt, data);
			};
			
			function _isReadOnly(){
				return systemRoleId == 2;//Fix this
			};
			
			return {
				
				PROFILE_LOADED: profileLoadedEvt,
				
				PROPERTIES_LOADED: propertiesLoadedEvt,
				
				REST_ENDPOINT: "endpoint.rest",
				
				GEOSERVER_ENDPOINT: "endpoint.geoserver",
			
				getWorkspaceId: function(){
					return workspaceId;
				},
				
				getUsername: function(){
					return username;
				},
				
				getSessionId: function(){
					return sessionId;
				},
				
				getUserOrgId: function(){
					return userOrgId;
				},
				
				getUserId: function(){
					return userId;
				},
				
				getSystemRoleId: function(){
					return systemRoleId;
				},
				
				isReadOnly: function(){
					return _isReadOnly();
				},
				
				setSystemRoleId: function(systemroleid){
					systemRoleId = systemroleid;
				},
				
				getOrgName: function(){
					return orgName;
				},
				
				getOrgId: function(){
					return orgId;
				},
				
				getOrgPrefix: function(){
					return orgPrefix;
				},
				
				getOrgCountry: function(){
					return orgCountry;
				},
				
				getOrgState: function(){
					return orgState;
				},
				
				getIncidentTypes: function(){
					return incidentTypes;
				},
				
				getUserSessionId: function(){
					return userSessionId;
				},
				
				getCurrentUserSessionId: function(){
					return currentUserSessionId;
				},
				
				getFirstName: function(){
					return firstName;
				},
				
				getLastName: function(){
					return lastName;
				},
				
				setFirstName: function(firstname){
					firstName = firstname;
				},
				
				setLastName: function(lastname){
					lastName = lastname;
				},
				
				getNickName: function(){
					return firstName + ' ' + lastName;
				},
				
				getRank: function(){
					return rank;
				},
				
				getDesc: function(){
					return description;
				},
				
				getJobTitle: function(){
					return jobTitle;
				},		
				
				setRank: function(Rank){
					rank = Rank;
				},
				
				setDesc: function(Description){
					description = Description;
				},
				
				setJobTitle: function(jobtitle){
					jobTitle = jobtitle;
				},			

				init: function(){
					_init();
				}
			}
		};
});
