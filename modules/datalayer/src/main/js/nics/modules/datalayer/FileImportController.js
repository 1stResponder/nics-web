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
define(['ext', 'ol', "iweb/CoreModule", "nics/modules/UserProfileModule"],
	function(Ext, ol, Core, UserProfile){
	
		return Ext.define('modules.datalayer.FileImportController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.datalayer.fileimportcontroller',
			
			init: function() {
				this.dataSourceType = this.getView().dataSourceType;
				this.workspaceId = this.getView().workspaceId;
				this.allowUrl = this.getView().allowUrl;
				this.url = this.getView().url;
				
				this.mediator = Core.Mediator.getInstance();
				
				this.updatePanelTitle();
				this.bindEvents();
			},
			
			bindEvents: function(){
				
				Core.EventManager.addListener("nics.data.onFileUploadSuccess", this.onFileImportSuccess.bind(this));
			},
			
			updatePanelTitle: function() {
				var panelTitle = this.getView().getTitle();
				
				var formPanel = this.getView().getFormPanel();
				var formPanelTitle = formPanel.getTitle();
				formPanel.setTitle(panelTitle + ' ' + formPanelTitle);
				
				formPanel.getForm().findField('fileName').setFieldLabel("Choose a " + panelTitle + " file to load as a data layer");
				
			},
			
			submitForm: function(b, e){
				
				var form = this.getView().getFormPanel().getForm();
				var fileType = this.dataSourceType;
				var fileName = form.findField('fileName').getValue();
				var url = this.url;
				var displayname = form.findField('displayname').getValue();
				
				if(fileType == 'kmz'){
				
					if(!fileName || !fileName.endsWith('.kmz')){
						return Ext.Msg.show({
							title: 'File Import',
							message: 'Please include a KMZ file.',
							buttons: Ext.Msg.OK
						});
					}
				
				}
				else if(fileType == 'kml'){
				
					if(!fileName || !fileName.endsWith('.kml')){
						return Ext.Msg.show({
							title: 'File Import',
							message: 'Please include a KML file.',
							buttons: Ext.Msg.OK
						});
					}
				
				}
				else if(fileType == 'gpx'){
				
					if(!fileName || !fileName.endsWith('.gpx')){
						return Ext.Msg.show({
							title: 'File Import',
							message: 'Please include a GPX file.',
							buttons: Ext.Msg.OK
						});
					}
				
				}
				else if(fileType == 'json'){
				
					if(!fileName || !fileName.endsWith('.json')){
						return Ext.Msg.show({
							title: 'File Import',
							message: 'Please include a JSON file.',
							buttons: Ext.Msg.OK
						});
					}
				
				}
				
				
				if(!displayname){
					return Ext.Msg.show({
						title: 'File Import',
						message: 'Please include a display name.',
						buttons: Ext.Msg.OK
					});
				}
				
				form.submit({
					url: url,
					params: {
					
						'usersessionid': UserProfile.getUserSessionId(),
						'baselayer': true,
						'fileType': fileType
					
					},
					waitMsg: 'Uploading file...',
					success: function(fp, o) {
						 Core.EventManager.fireEvent('nics.data.onFileUploadSuccess');
					},
					failure: function(fp, o) {
						Ext.Msg.show({
							title: 'File Import',
							message: 'Failed to upload your file.',
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
				});
				
			},
			
			onFileImportSuccess: function(e, obj){
				
				this.getView().getFormPanel().getForm().findField('displayname').setValue('');
				
				Ext.Msg.show({
					title: 'File Import',
					message: ' File uploaded successfully.',
					buttons: Ext.Msg.OK
				});
			
			}
			
		});
});
