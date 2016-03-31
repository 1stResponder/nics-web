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
define([], function() {

	var CollabRoomModel = function(){};
	
	var myMap = { name: 'Workspace', id: 0 };
	
	CollabRoomModel.prototype.openCollabRooms = {
		//incident name: { roomName: whiteboard }
	};
	
	CollabRoomModel.prototype.currentCollabRoom = myMap;
	CollabRoomModel.prototype.currentIncidentId = -1;
	CollabRoomModel.prototype.currentIncidentTopic = null;
	CollabRoomModel.prototype.workspaceId = -1;
	CollabRoomModel.prototype.usersessionId = -1;
	CollabRoomModel.prototype.userId = -1;
	CollabRoomModel.prototype.userOrgId = -1;
	CollabRoomModel.prototype.username = null;

	CollabRoomModel.prototype.addCollabRoom = function(name, whiteboard){
		if(!this.openCollabRooms[this.currentIncidentId]){
			this.openCollabRooms[this.currentIncidentId] = {};
		}
		this.openCollabRooms[this.currentIncidentId][name] = whiteboard;
	};

	CollabRoomModel.prototype.getCollabRoom = function(collabRoomName){
		return this.openCollabRooms[this.currentIncidentId][collabRoomName];
	};
	
	CollabRoomModel.prototype.hasOpenRooms = function(incidentName){
		return (this.openCollabRooms[incidentName] != null);
	};
	
	CollabRoomModel.prototype.setUsersessionId = function(id){
		this.usersessionId = id;
	};

	CollabRoomModel.prototype.getUsersessionId = function(){
		return this.usersessionId;
	};
	
	CollabRoomModel.prototype.setUserId = function(id){
		this.userId = id;
	};

	CollabRoomModel.prototype.getUserId = function(){
		return this.userId;
	};

	CollabRoomModel.prototype.setUserOrgId = function(id){
		this.userOrgId = id;
	};

	CollabRoomModel.prototype.getUserOrgId = function(){
		return this.userOrgId;
	};
	
	CollabRoomModel.prototype.setCurrentIncidentId = function(id){
		this.currentIncidentId = id;
	};

	CollabRoomModel.prototype.getCurrentIncidentId = function(){
		return this.currentIncidentId;
	};
	
	CollabRoomModel.prototype.setCurrentIncidentTopic = function(topic){
		this.currentIncidentTopic = topic;
	};

	CollabRoomModel.prototype.getCurrentIncidentTopic = function(){
		return this.currentIncidentTopic;
	};
	
	CollabRoomModel.prototype.setCurrentCollabRoom = function(room){
		this.currentCollabRoom = room;
	};

	CollabRoomModel.prototype.getCurrentCollabRoom = function(){
		return this.currentCollabRoom;
	};
	
	CollabRoomModel.prototype.setWorkspaceId = function(workspaceId){
		this.workspaceId = workspaceId;
	};
	
	CollabRoomModel.prototype.getWorkspaceId = function(){
		return this.workspaceId;
	};
	
	CollabRoomModel.prototype.setUsername = function(username){
		this.username = username;
	};
	
	CollabRoomModel.prototype.getUsername = function(){
		return this.username;
	};

	return CollabRoomModel;
});
