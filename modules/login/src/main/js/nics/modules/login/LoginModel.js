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

	var LoginModel = function(){};
	
	LoginModel.prototype.username = null;
	LoginModel.prototype.workspaceId = null;
	LoginModel.prototype.userId = null;
	LoginModel.prototype.userOrgId = null;
	LoginModel.prototype.usersessionId = null;
	LoginModel.prototype.systemRoleId = null;
	
	LoginModel.prototype.setUsername = function(username){
		this.username = username;
	};
	
	LoginModel.prototype.getUsername = function(){
		return this.username;
	};
	
	LoginModel.prototype.setWorkspaceId = function(workspaceId){
		this.workspaceId = workspaceId;
	};
	
	LoginModel.prototype.getWorkspaceId = function(){
		return this.workspaceId;
	};
	
	LoginModel.prototype.setUserOrgId = function(userOrgId){
		this.userOrgId = userOrgId;
	};
	
	LoginModel.prototype.getUserOrgId = function(){
		return this.userOrgId;
	};
	
	LoginModel.prototype.setUserId = function(userId){
		this.userId = userId;
	};
	
	LoginModel.prototype.getUserId = function(){
		return this.userId;
	};
	
	LoginModel.prototype.getSessionId = function(){
		return this.usersessionId;
	};
	
	LoginModel.prototype.setSessionId = function(usersessionId){
		this.usersessionId = usersessionId;
	};
	
	LoginModel.prototype.setSystemRoleId = function(systemRoleId){
		this.systemRoleId = systemRoleId;
	};
	
	LoginModel.prototype.getSystemRoleId = function(){
		return this.systemRoleId;
	};
	
	return LoginModel;
});
