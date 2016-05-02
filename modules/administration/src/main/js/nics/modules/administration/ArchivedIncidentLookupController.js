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
define(['ext', 'iweb/CoreModule', 'nics/modules/UserProfileModule'],
         function(Ext, Core, UserProfile){
	
	return Ext.define('modules.administration.ArchivedIncidentLookupController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.archivedincidentlookupcontroller',
		
		lookupTopic: 'nics.admin.incident.lookup',

		init: function(){
			this.mediator = Core.Mediator.getInstance();
			this.lookupReference('lookupGrid').store.removeAll();
			Core.EventManager.addListener(this.lookupTopic, this.loadIncidents.bind(this));
		},
		
		findArchivedIncidents: function(evt){
			/** Add input validation **/
			var searchValue = this.lookupReference('searchInput').getValue();
			if(!Ext.isEmpty(searchValue)){
			
				var url = Ext.String.format('{0}/incidents/{1}/find', 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT), 
					UserProfile.getWorkspaceId());
			
				if(this.lookupReference('orgPrefix').getValue()){
					url = Ext.String.format("{0}?orgPrefix={1}", url, searchValue);
				}else{
					url = Ext.String.format("{0}?name={1}", url, searchValue);
				}
				
				this.mediator.sendRequestMessage(url, this.lookupTopic);
			}
		},
		
		loadIncidents: function(evt, response){
			if(!response.data || response.data.length == 0){
				Ext.MessageBox.alert("Incident Lookup", "No archived incidents where found that match the given criteria.");
				return;
			}
			
			var grid = this.lookupReference('lookupGrid');
			grid.getStore().removeAll()
			grid.getStore().loadData(response.data, true);
		},
		
		joinIncident: function(){
			var grid = this.lookupReference('lookupGrid');
			var selected = grid.getSelectionModel().getSelection();
			Core.EventManager.fireEvent("nics.archived.incident.join", { 
					name: selected[0].data.incidentname, 
					id: selected[0].data.incidentid, 
					archived: true
			});
		    this.view.close();
		},
		
		clearGrid: function(){
			this.lookupReference('lookupGrid').store.removeAll();
			this.lookupReference('lookupGrid').view.refresh();
		}
	});
});
