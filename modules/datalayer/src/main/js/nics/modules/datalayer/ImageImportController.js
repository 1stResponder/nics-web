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
define(['ext', 'ol', "iweb/CoreModule", "iweb/modules/MapModule",
		"nics/modules/UserProfileModule", "./ImageLayerDetailRenderer"],
	function(Ext, ol, Core, MapModule, UserProfile, ImageLayerDetailRenderer){
	
		return Ext.define('modules.datalayer.ImageImportController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.datalayer.imageimportcontroller',
			
			init: function() {
				this.workspaceId = this.getView().workspaceId;
				this.url = this.getView().url;
				
				this.mediator = Core.Mediator.getInstance();
				
				var dataview = this.lookupReference('dataview');
				dataview.store.on('remove', this.onStoreRemove, this);
				dataview.store.on('clear', this.onStoreClear, this);
				
				MapModule.getClickListener().addRenderer(new ImageLayerDetailRenderer());
			},
			
			configureFileInput: function(fileField) {
				fileField.fileInputEl.set({
					accept: 'image/*',
					multiple: 'multiple'
				});
			},
			
			onFileRender: function(cmp){
				this.configureFileInput(cmp);
			},
			
			onNameChange: function(input) {
				this.checkEnableUpload();
			},
			
			onFileChange: function(fileinput) {
				var fileData = this.buildImageModels(fileinput.fileInputEl.dom.files);
				if (fileData && fileData.length) {
					this.addFileModels(fileData);
				}
				this.checkEnableUpload();
			},
			
			checkEnableUpload: function () {
				var dataview = this.lookupReference('dataview'),
						displayname = this.lookupReference('displayname'),
						uploadbutton = this.lookupReference('uploadbutton');
				
				var disabled = true;
				if (dataview.store.getCount() > 0 && displayname.isValid()) {
					disabled = false;
				}
				uploadbutton.setDisabled(disabled);
			},
			
			buildImageModels: function(files) {
				var fileType = 'image/';
				return Array.prototype.filter.call(files, function(file){
					return file.type.substr(0, fileType.length) === fileType;
				}).map(function(file){
					return {
						filename: file.name,
						src: URL.createObjectURL(file),
						file: file,
						progress: 0
					};
				});
			},
			
			addFileModels: function(fileData) {
				var dataview = this.lookupReference('dataview');
				dataview.store.loadData(fileData, true);
			},
			
			cleanupRecords: function(records) {
				//cleanup object urls
				records.forEach(function(file){
					URL.revokeObjectURL(file.data.src);
				});
			},
			
			resetForm: function() {
				var dataView = this.lookupReference('dataview'),
						form = this.lookupReference('formPanel'),
						file = this.lookupReference('fileName'),
						uploadbutton = this.lookupReference('uploadbutton'),
						store = dataView.store;
						
				store.removeAll();
				form.reset();
				uploadbutton.setDisabled(true);
				
				//reconfigure the file input after form reset
				this.configureFileInput(file);
			},
			
			onStoreRemove: function(store, records) {
				this.cleanupRecords(records);
			},
			
			onStoreClear: function(store, records) {
				this.cleanupRecords(records);
			},
			
			onUpload: function () {
				//ensure our UID always starts with a character, not number
				this.batchId = "B" + Core.Util.generateUUID();
				this.considerUpload();
			},
			
			onCancel: function () {
				this.resetForm();
				this.busy = false;
				
				if (this.activeUploadXHR) {
					this.activeUploadXHR.abort();
					this.activeUploadXHR = null;
				}
				
				if (this.batchId) { 
					this.uploadFinish(true, this.batchId)
						.then(function (response, opts) {
							Ext.Msg.show({
								title: 'File Import',
								message: ' Files uploaded canceled.',
								buttons: Ext.Msg.OK
							});
						}, function(response, opts) {
							Ext.Msg.show({
								title: 'File Import',
								message: ' Failed to cancel upload.',
								buttons: Ext.Msg.OK
							});
						});
					this.batchId = null;
				}
			},
			
			batchComplete: function() {
				var title = this.lookupReference('displayname').getValue();
				
				var me = this;
				this.uploadFinish(false, this.batchId, title)
					.then(function (response, opts) {
						me.resetForm();
						
						Ext.Msg.show({
							title: 'File Import',
							message: ' Files uploaded successfully.',
							buttons: Ext.Msg.OK
						});
					}, function(response, opts) {
						me.resetForm();
						
						Ext.Msg.show({
							title: 'File Import',
							message: ' Failed to complete upload.',
							buttons: Ext.Msg.OK
						});
					});
				this.batchId = null;
			},
			
			considerUpload: function() {
				var dataView = this.lookupReference('dataview'),
						store = dataView.store;
						
				var fileModel = store.findRecord('progress', 0);
				if (fileModel) {
					this.uploadImage(fileModel);
				} else {
					this.batchComplete();
				}
			},
			
			uploadFinish: function(canceled, id, title) {

				var url = Ext.String.format("/em-api/v1/datalayer/{0}/image/finish?{1}",
							UserProfile.getWorkspaceId(),
							Ext.Object.toQueryString({
								cancel: canceled,
								id: id,
								title: title,
								usersessionid: UserProfile.getUserSessionId(),
								username: UserProfile.getUsername()
							}));
				
				var username = UserProfile.getUsername();

				return Ext.Ajax.request({
					method: 'POST',
					url: url,
					headers: {
				        'username': username
				    }
				});
							
			},
			
			busy: false,
			uploadImage: function(fileModel) {
				if (!this.busy) {
					this.busy = true;
					
					var me = this,
						url = Ext.String.format("/em-api/v1/datalayer/{0}/image", this.workspaceId);
						
					var username = UserProfile.getUsername();
					
					var req = this.activeUploadXHR = new XMLHttpRequest();
					req.open("POST", url);
					req.setRequestHeader("Content-type", "multipart/form-data");
					req.setRequestHeader("CUSTOM-uid", username);
					
					req.onload = function(event) {
						if (event.target.status >= 200 &&  event.target.status < 300) {
							fileModel.set('progress', 100);
						} else {
							fileModel.set('progress', -1);
						}
						
						me.busy = false;
						me.activeUploadXHR = null;
						me.considerUpload();
					};
					
					req.onerror = function(event) {
						fileModel.set('progress', -1);
						
						me.busy = false;
						me.activeUploadXHR = null;
						me.considerUpload();
					};
					
					req.onprogress = function(pe) {
						if(pe.lengthComputable) {
							var percent = (pe.loaded / pe.total) * 100;
							fileModel.set('progress', 100);
						}
					};
					
					var formData = new FormData();
					formData.append('file', fileModel.get('file'));
					formData.append('id', this.batchId);
					
					req.send(formData);
				}
			}
		});
});
