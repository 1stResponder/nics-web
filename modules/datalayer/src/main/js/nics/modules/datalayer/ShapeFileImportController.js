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
	
		return Ext.define('modules.datalayer.ShapeFileImportController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.datalayer.shapefileimportcontroller',
			
			init: function() {
				this.dataSourceType = this.getView().dataSourceType;
				this.workspaceId = this.getView().workspaceId;
				this.allowUrl = this.getView().allowUrl;
				this.url = this.getView().url;
				
				this.mediator = Core.Mediator.getInstance();
				
				this.bindEvents();
			},
			
			bindEvents: function(){
				this.control({
					'filefield':{
						change: this.fileChange
					}
				});
			},
			
			afterRender: function(component) {
				var panel = component.getFormPanel(),
						form = panel.getForm();
				
				//limit each file input to its type (if supported)
				panel.query('filefield').forEach(function(fileField){
					if (fileField.extension) {
						fileField.fileInputEl.set({
							accept: '.' + fileField.extension
						});
					}
				});
				
				//validate immediately to give user direction
				form.isValid();
			},
			
			fileChange: function(fileInput, value, eOpts){
				var fileInputDom = fileInput.fileInputEl.dom;
				
				//if this browser supports files attribute,
				//set the input to the selected filename
				if (fileInputDom.files) {
					var files = fileInputDom.files;
					if (files.length) {
						fileInput.setRawValue(files[0].name);
					}
				}
			},
			
			submitForm: function(b, e){
				var form = this.getView().getFormPanel().getForm();
				var url = Ext.String.format("/em-api/v1/datalayer/{0}/shapefile",
						UserProfile.getWorkspaceId());
				
				form.submit({
					url: url,
					waitMsg: 'Uploading files...',
					scope: this,
					success: function(fp, o) {
						Ext.Msg.show({
							title: 'File Import',
							message: ' Files uploaded successfully.',
							buttons: Ext.Msg.OK
						});
						
						form.reset();
						
						//reset all the field attributes
						this.afterRender(this.getView());
					},
					failure: function(fp, o) {
						Ext.Msg.show({
							title: 'File Import',
							message: 'Failed to upload your files.',
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
						
						//reset all the field attributes
						this.afterRender(this.getView());
					}
				});
			}
			
		});
});
