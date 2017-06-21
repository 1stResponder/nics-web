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
define(['ext', 'iweb/CoreModule', "./BroadcastModel",  "./NewBroadcastView", 'nics/modules/UserProfileModule'],
		function(Ext, Core, BroadcastModel, NewBroadcastView, UserProfile){
	
	return Ext.define('modules.broadcast.BroadcastController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.broadcastcontroller',
		
		incidentId: -1,

		init: function(){
			this.mediator = Core.Mediator.getInstance();

			this.onNewAlertCallback = this.onNewAlert.bind(this);
			Core.EventManager.addListener("NICS.alerts", this.onLoadAlerts.bind(this));
			Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
			Core.EventManager.addListener("nics.incident.close", this.removeAlertListener.bind(this));
			Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.updateDeleteButton.bind(this));
			Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
			
			this.newBroadcastView = new NewBroadcastView();
		},
		
		onDblClick: function(grid, record){
			Ext.MessageBox.alert("Alert", record.data.message);
		},
		
		updateDeleteButton: function(){
			if(!(UserProfile.isElevatedUser())){
				this.lookupReference('deleteAlertButton').setHidden(true);
			}
		},
		
		onJoinIncident: function(e, incident){
			this.getView().enable();

			this.removeAlertListener();
			
			this.lookupReference('newAlertButton').enable();
			
			this.disableDeleteButton(false);
			
			this.incidentId = incident.id;
			
			//request alerts for this incident
			var url = Ext.String.format("{0}/alert/{1}/{2}", 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					incident.id,
					UserProfile.getUserId());
			
			this.mediator.sendRequestMessage(url, "NICS.alerts");
			
			this.newAlertTopic = Ext.String.format("iweb.NICS.{0}.alert", this.incidentId);
			this.mediator.subscribe(this.newAlertTopic);
			
			this.newUserAlertTopic = Ext.String.format("iweb.NICS.{0}.{1}.alert", this.incidentId, UserProfile.getUserId());
			this.mediator.subscribe(this.newUserAlertTopic);
	
			Core.EventManager.addListener(this.newAlertTopic, this.onNewAlertCallback);
			Core.EventManager.addListener(this.newUserAlertTopic, this.onNewAlertCallback);
		},
		
		onCloseIncident: function(e, incidentId) {
				// Disables the panel
				this.getView().disable();
		},
		
		onLoadAlerts: function(e, response) {
			//load store with all alerts
			if(response.results && response.results.length > 0){
				this.view.store.loadRawData(response.results);
			}
		},
		
		onNewButtonClick: function() {
			if(this.incidentId != -1){
				this.newBroadcastView.setIncidentId(this.incidentId);
				this.newBroadcastView.show();
			}
		},
		
		onDeleteButtonClick: function(){
			var selected = this.view.getSelection();
			for(var i=0; i<selected.length; i++){
				var selectedRow = selected[i];
				var url = Ext.String.format("{0}/alert/{1}", Core.Config.getProperty(UserProfile.REST_ENDPOINT), selectedRow.data.alertid); 
	           	
	           	var topic = 'nics.broadcast.alert.delete.post.callback';
	           	Core.EventManager.createCallbackHandler(topic, this, 
						function(row, evt, response){
							if(response != "success"){
								Ext.MessageBox.alert("Alert", response);
							}else{
								this.view.getStore().remove(row);
							}
						}, [selectedRow]
				);
	           	
	           	this.mediator.sendDeleteMessage(url, topic);  
			}
		},
		
		onNewAlert: function(event, alert){
			this.view.store.loadRawData(alert, true);
			Ext.MessageBox.alert("New Alert", alert.message);
		},
		
		disableDeleteButton: function(disable){
			var deleteButton = this.lookupReference('deleteAlertButton');
			if(deleteButton && !deleteButton.isHidden()){
				if(disable){
					deleteButton.disable();
				}else{
					deleteButton.enable();
				}
			}
		},
		
		removeAlertListener: function(){
			if(this.newAlertTopic){
				this.disableDeleteButton(true);
				this.lookupReference('newAlertButton').disable();
				this.view.store.removeAll();
				this.incidentId = -1;
				Core.EventManager.removeListener(this.newAlertTopic, this.onNewAlertCallback);
				Core.EventManager.removeListener(this.newUserAlertTopic, this.onNewAlertCallback);
			}
		}
	});
});
