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
	
	return Ext.define('modules.administration.ArchiveController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.archivecontroller',

		init: function(){
			this.mediator = Core.Mediator.getInstance();

			this.getView().getFirstGrid().getView().on('drop', this.activateIncident, this);
			this.getView().getSecondGrid().getView().on('drop', this.archiveIncident, this);
		},
		
		clearGrids: function(){
			this.getView().clearGrids();
		},
		
		loadIncidents: function(evt, orgId){
			this.currentOrgId = orgId;
			this.getView().clearGrids();
			
			this.loadIncidentData(this.getView().getFirstGrid(), 'active', orgId);
			this.loadIncidentData(this.getView().getSecondGrid(), 'archived', orgId);
		},
		
		loadIncidentData: function(grid, type, orgId){
			var topic = Core.Util.generateUUID();
			
			//populate the user grids
			Core.EventManager.createCallbackHandler(topic, this, 
					function(evt, response){
						if(response.data){
							var data = [];
							for(var i=0; i<response.data.length;i++){
								data.push({
									incidentid: response.data[i].incidentid,
									incidentname: response.data[i].incidentname
								});
							}
							grid.getStore().loadData(data);
						}
					}
			);
			
			var url = Ext.String.format('{0}/incidents/{1}/{2}/{3}', 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT), 
					UserProfile.getWorkspaceId(), type, orgId);
			
			this.mediator.sendRequestMessage(url, topic);
		},
		
		activateIncident: function(node, data, dropRec, dropPosition){
			this.updateIncident(node, data, dropRec, dropPosition, "activate");
		},
		
		archiveIncident: function(node, data, dropRec, dropPosition){
			this.updateIncident(node, data, dropRec, dropPosition, "archive");
		},
		
		updateIncident: function(node, data, dropRec, dropPosition, type){
			for(var i=0;i<data.records.length;i++){
				var record = data.records[i];
				
				var topic = Core.Util.generateUUID();
				
				var _this = this;
				///populate the user grids
				Core.EventManager.createCallbackHandler(topic, this, 
						function(evt, response){
							var test = "test";
						}
				);
				
				var url = Ext.String.format('{0}/incidents/{1}/{2}/{3}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId(), type, record.data.incidentid);
				
				this.mediator.sendPostMessage(url, topic, {});
			}
		}
	});
});
