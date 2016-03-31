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
define(['ext', "iweb/CoreModule", 'nics/modules/UserProfileModule'], 
		function(Ext, Core, UserProfile){
		Ext.define('modules.datalayer.js.ExportController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.exportcontroller',
			
			init: function(){
				Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
				Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
				Core.EventManager.addListener("nics.collabroom.activate", this.onActivateCollabRoom.bind(this));
			},
	 
			onJoinIncident: function(e, incident){
				this.incidentId = incident.id;
			},
			
			onCloseIncident: function(e, incident){
				this.incidentId = null;
				this.collabRoomId = null;
			},
			
			onActivateCollabRoom: function(e, collabRoomId){
				if(collabRoomId != 'myMap'){
					this.collabRoomId = collabRoomId;
				}else{
					this.collabRoomId = null;
				}
			},
			
			exportRoom: function(){
				var format = this.getView().getFormat();
				var type = this.getView().getType();
				if(format && type){
					if(format == "wms" || format == "wfs"){
						this.exportCapabilities(format);
					}else{
						this.exportDatalayer(type, format);
					}
				}else{
					Ext.MessageBox.alert("Export Current Room", "The export format type is not valid.");
				}
			},

			//collabroomId}/incident/{incidentId}/user/{userId}/type/{exportType}/format/{exportFormat}
			exportDatalayer: function(type, format){
				if(this.collabRoomId && this.incidentId){
					var url = Ext.String.format('{0}/collab/export/{1}/incident/{2}/user/{3}/type/{4}/format/{5}',
							Core.Config.getProperty(UserProfile.REST_ENDPOINT),
							this.collabRoomId, this.incidentId, UserProfile.getUserId(), type, format);
					
					this.getView().hide();
					
					window.open(url);							
				}
				else{
					Ext.MessageBox.alert("Export Current Room", "You are not currently in a collaboration room.");
				}
			},

			//incident/{incidentId}/user/{userId}/format/{exportFormat}
			exportCapabilities: function(exportFormat){
				if(this.incidentId){
					var url = Ext.String.format('{0}/collab/export/incident/{1}/user/{2}/format/{3}',
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						this.incidentId, UserProfile.getUserId(), exportFormat);
						
					this.getView().hide();
					
					window.open(url);							
				}
				else{
					Ext.MessageBox.alert("Export Get Capabilities", "You are not currently in an incident.");
				}
			}
		});
});
