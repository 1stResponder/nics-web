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
	
		var INCIDENT_CLASS = 'edu.mit.ll.nics.common.entity.Incident';
		var INCIDENT_TYPE_CLASS = 'edu.mit.ll.nics.common.entity.IncidentIncidentType';
	    var COLLABROOM_CLASS = 'edu.mit.ll.nics.common.entity.CollabRoom';
	    
		var getNewIncidentMessage = function(model){
			return {
				usersessionid: Core.Mediator.getInstance().getSessionId(),
				workspaceid: model.getWorkspaceId(), 
				description: model.getDescription(), //validate
				incidentname: model.getIncidentName(), //validate
				lat: 0,
				lon: 0,
				created: Core.Util.getUTCTimestamp(),
				folder: '',
				active: true,
				className: INCIDENT_CLASS
			}
		};
	
		var getNewCollabRoomsMessage = function(model){
			var newRooms = [];
			var automatedRooms = model.getAutomatedRooms();
			for(var i=0; i<automatedRooms.length; i++){
				var name = model.getIncidentName() + "-" + automatedRooms[i];
				newRooms.push({
					usersessionid: Core.Mediator.getInstance().getSessionId(),
					created: Core.Util.getUTCTimestamp(),
					name: name,
					className: COLLABROOM_CLASS	
				});
			}	
			return newRooms;
		};
	
		var getNewIncidentTypeMessage = function(model){
			var newIncidentTypes = [];
			var incidentTypes = model.getIncidentTypeIds();
			for(var i=0; i<incidentTypes.length; i++){
				newIncidentTypes.push({
					incidenttypeid: incidentTypes[i],
					className: INCIDENT_TYPE_CLASS	
				});
			}	
			return newIncidentTypes;
		};
		
		return {
			build: function(model){
				var message = {
					user: "guest",//get out of model
					messageType: "createIncident",
					topic: "NICS.newIncident",
					returnTopic: "NICS.direct.createIncident." + model.getUsername(), //get out of model
					data: [getNewIncidentMessage(model)]
				}
		
				//Add new entities multiple rooms and incident types
				jQuery.merge(message.data, getNewCollabRoomsMessage(model));
				jQuery.merge(message.data, getNewIncidentTypeMessage(model));
		
				//add collabroom permission	
				return message;
			}
		};
	}
	
	return MessageBuilder;
});
