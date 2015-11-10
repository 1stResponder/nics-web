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
define(['ext', 'iweb/CoreModule', 'nics/modules/UserProfileModule'],
         function(Ext, Core, UserProfile){
	
	return Ext.define('modules.administration.AdminController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.admincontroller',

		init: function(){
			Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.loadUserProfile.bind(this));
			
			this.mediator = Core.Mediator.getInstance();
		},
		
		loadUserProfile: function(evt){
			//Check if user is an admin
			var topic = Core.Util.generateUUID();
			
			//populate the workspace dropdown
			Core.EventManager.createCallbackHandler(topic, this, this.addAdminView);
			
			var url = Ext.String.format('{0}/users/{1}/admin/{2}', 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId(), UserProfile.getUserOrgId());
			this.mediator.sendRequestMessage(url, topic);
		},
		
		addAdminView: function(evt, data){
			if(data.count == 1){ //Found Admin user
				var view = this.getView();
				view.setTitle("Manage Settings - " + UserProfile.getOrgName());
				
				//Add Item to Tools Menu
				Core.Ext.ToolsMenu.add({
						text: 'Administration',
						handler: function(){
							 view.show();
						}
					}
				);
			}
		}
	});
});
