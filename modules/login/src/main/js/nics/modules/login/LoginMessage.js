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
define(["iweb/CoreModule"], function(Core){	
	var MessageBuilder = function(){
	    var USER_SESSION_CLASS = 'edu.mit.ll.nics.common.entity.Usersession';
	    var CURRENT_USER_SESSION_CLASS = 'edu.mit.ll.nics.common.entity.CurrentUserSession';
	    
		var getUserSessionMessage = function(model){
			return {
				userorgid: model.getUserOrgId(),
				sessionid: model.getSessionId(),
				loggedin: Core.Util.getUTCTimestamp(),
				className: USER_SESSION_CLASS
			};
		};
	
		var getCurrentUserSessionMessage = function(model){
			return {
				userid: model.getUserId(),
				displayname: model.getUsername(),
				loggedin: Core.Util.getUTCTimestamp(),
				lastseen: Core.Util.getUTCTimestamp(),
				systemroleid: model.getSystemRoleId(),
				workspaceid: model.getWorkspaceId(),
				className: CURRENT_USER_SESSION_CLASS
			};
		};
	
		
		return {
			build: function(model){
				var message = {
					user: "guest",//get out of model
					messageType: "createUserSession",
					topic: "NICS.newIncident",
					returnTopic: "NICS.direct.session." + model.getUsername(),
					data: [
						getUserSessionMessage(model),
						getCurrentUserSessionMessage(model)
					]
				}
				return message;
			}
		};
	};
		
	return MessageBuilder;
});
