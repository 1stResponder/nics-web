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
define(["iweb/CoreModule", 'nics/modules/UserProfileModule'], 
	function(Core, UserProfile){
	
		var tokenManager = new function() {
			
			var tokens = {};
			
			function _addToken(datasourceid, tokenObj){
				if(tokenObj.token && tokenObj.expires){
					tokens[datasourceid] = tokenObj;
				}
			};
			
			function _getToken(datasourceid, callback){
				if(tokens[datasourceid] && !expired(tokens[datasourceid].expires)){
					return tokens[datasourceid].token;
				}else{
					requestToken(datasourceid, callback)
				}
				return null;
			};
			
			function _getExpired(datasourceid){
				if(tokens[datasourceid]){
					return tokens[datasourceid].expires;
				}
				return null;
			};
			
			function expired(expirationTime){
				return ((new Date()).getTime() > expirationTime);
			};
			
			function requestToken(datasourceid, callback){
				var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);
				var url = Ext.String.format("{0}/datalayer/{1}/token/{2}",
					endpoint,
					UserProfile.getWorkspaceId(),
					datasourceid);
				
				var topic = Core.Util.generateUUID();
				Core.EventManager.createCallbackHandler(topic, this, handleTokenResponse, [datasourceid, callback]);
				Core.Mediator.getInstance().sendRequestMessage(url, topic);
			};
			
			function handleTokenResponse(datasourceid, callback, evt, response){
				if(response.token){
					_addToken(datasourceid, response);
					//callback.fnc.apply(callback.scope, callback.params);
					Core.EventManager.fireEvent(callback.topic, callback.params);
				}else{
					Ext.MessageBox.alert("Authentication Error", "Unable to authenticate source.");
				}
			};
			
			return {
				
				getToken: function(datasourceid, callback){
					return _getToken(datasourceid, callback);
				},
				
				addToken: function(datasourceid, token, expires){
					_addToken(datasourceid, token, expires);
				},
				
				getExpired: function(datasourceid){
					_getExpired(datasourceid);
				}
			}
		};
		
		return tokenManager;
});
