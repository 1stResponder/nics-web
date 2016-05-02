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
define(['ext', 'iweb/CoreModule','nics/modules/UserProfileModule'],
         function(Ext, Core, UserProfile){
	
	var OK_STATUS = "OK";
	return Ext.define('modules.administration.AnnouncementController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.announcementcontroller',
		
		

		init : function(args) {
			
			this.mediator = Core.Mediator.getInstance();
			this.bindEvents();
			this.logType = 0; //Announcement
			
		},
		bindEvents: function(){
			//Bind UI Elements
			Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.loadAnnouncements.bind(this));
			 Core.EventManager.addListener("nics.announcement.new", this.loadAnnouncements.bind(this));
			Core.EventManager.addListener("nics.announcement.delete", this.loadAnnouncements.bind(this));
		    Core.EventManager.addListener("onLoadAnnouncements", this.onLoadAnnouncements.bind(this));
		
			
		},
		
		loadAnnouncements: function(evt){
			this.url = Ext.String.format('{0}/announcement/{1}/', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT), 
						UserProfile.getWorkspaceId());
				this.mediator.sendRequestMessage(this.url, "onLoadAnnouncements");
				
			
		},
		onLoadAnnouncements: function(e, response) {
			
			if(response && response.results){
				this.lookupReference('announceGrid').store.loadRawData(response.results);
			}
			
					
					
				
			
		},
		onSelectionChange: function(grid, selected, eOpts) {
			if(selected[0]){
				this.lookupReference('deleteButton').show();
				this.lookupReference('clearButton').show();
				
				
				
			}
		}, 
		addMessage: function(eOpts) {
			var panel = this.lookupReference('announceFormPanel');
			var announceForm = panel.lookupReference('announceForm');
			this.resetMessage();
			panel.lookupReference('createButton').show();
			//panel.lookupReference('updateButton').hide();
			var initialData= {created: new Date()};
			announceForm.getViewModel().set(initialData);
			
			panel.show();
				
		},
		resetMessage: function() {
			var panel = this.lookupReference('announceFormPanel');
			var announceForm = panel.lookupReference('announceForm').getForm();
			announceForm.reset();
			
				
		},
		
		clearSelection: function(){
			this.lookupReference('announceGrid').getSelectionModel().deselectAll();
			//this.resetMessage();
			//this.lookupReference('announceFormPanel').hide();
			this.lookupReference('deleteButton').hide();
			this.lookupReference('clearButton').hide();
			
		},
		deleteSelection: function(){
			var announcement  = this.lookupReference('announceGrid').getSelectionModel().getSelection()[0].getData()
			var topic ="nics.announcement.delete";
    		Core.EventManager.createCallbackHandler(topic, this, 
					function(evt, response){
						if(response != OK_STATUS){
							Ext.MessageBox.alert("Announcement Error", "There was an error deleting the announcement");
						}
						else{
							Core.EventManager.fireEvent("nics.announcement.delete");
						}
					}
			);
			var url = Ext.String.format('{0}/announcement/{1}/{2}/', 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT), 
					UserProfile.getWorkspaceId(), announcement.logid);
			this.mediator.sendDeleteMessage(url, topic);
		},
    	
	});
});
