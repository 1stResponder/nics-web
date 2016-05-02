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
define(['iweb/CoreModule' ,'nics/modules/UserProfileModule'  ],
    function(Core, UserProfile){
	var OK_STATUS = "OK";
	return Ext.define('modules.administration.AnnouncementFormController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.announceformcontroller',

		init: function(){
			this.mediator = Core.Mediator.getInstance();
			this.logtypeid=0;
			
		},
		
		
		
		
		
		submitForm: function(){
	    		var form = {};
	    		var announcement = {};
	    		var vm = this.lookupReference('announceForm').getViewModel();
	    		
	    		announcement.usersessionid = UserProfile.getUserSessionId();
	    		announcement.logtypeid = this.logtypeid;
	    		announcement.message  = vm.get("message");
	    		
	    		
	    		
	    		var topic ="nics.announcement.new";
	    		Core.EventManager.createCallbackHandler(topic, this, 
						function(evt, response){
							if(response != OK_STATUS){
								Ext.MessageBox.alert("NICS", "There was an error updating the announcement");
							}
							else{
								Core.EventManager.fireEvent("nics.announcements.new");
							}
						}
				);
				var url = Ext.String.format('{0}/announcement/{1}/', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT), 
						UserProfile.getWorkspaceId());
				this.mediator.sendPostMessage(url, topic, announcement);
				this.cancelForm();
				
				
				
	    	},
			
		
		cancelForm: function() {
			this.lookupReference('announceForm').getForm().reset();
						
		},
		
		
		
		
	    
	    
	    
	   
	});
});
