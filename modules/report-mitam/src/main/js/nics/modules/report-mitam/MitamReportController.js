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
define(['ol',
        'iweb/CoreModule',
 		'nics/modules/UserProfileModule',
 		'./MitamForm'], 

	function(ol, Core, UserProfile){
	
		Ext.define('modules.report-mitam.MitamReportController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.mitamreportcontroller',
			
			hasSentView: false,
			
			imageUploadUrl: null,
			
			selectedGridIndex: 0,
			
			init: function(){
				this.mediator = Core.Mediator.getInstance();
				
				var topic = "nics.report.reportType";
				Core.EventManager.createCallbackHandler(
						topic, this, function(evt, response){
							Ext.Array.each(response.types, function(type){
								if(type.formTypeName === 'MITAM'){
									this.formTypeId = type.formTypeId;
									return;
								}
							}, this);
							
							//Continue loading
							this.bindEvents();
				});
				this.mediator.sendRequestMessage(Core.Config.getProperty(UserProfile.REST_ENDPOINT) +
						"/reports/types", topic);
			},
	 
			bindEvents: function(){
				//Bind UI Elements
				Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
				Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
				Core.EventManager.addListener("LoadMitamReports", this.onLoadReports.bind(this));
				Core.EventManager.fireEvent("nics.report.add", {title: "MITAM", component: this.getView()});
			},
			
			onSelectionChange: function(grid, selected, eOpts) {
				var updateButton = this.lookupReference('updateButton');
				var closeButton = this.lookupReference('closeButton');
				
				var record = selected[0];
				if(record && record.data.status != "Closed"){
					updateButton.enable();
					closeButton.enable();
				}else{
					updateButton.disable();
					closeButton.disable();
				}
			},
			
			onNewButtonClick: function(e) {
				var mitamForm = Ext.create('modules.report-mitam.MitamForm',{
					incidentId: this.incidentId,
					incidentName: this.incidentName,
					formTypeId: this.formTypeId
				});
				
				this.showFormWindow(mitamForm, 'Create MITAM', 600);
				mitamForm.disableUpdateForm();
			},
			
			onEditReport: function(){
				var record = this.view.getSelectionModel().getSelection()[0];
				if(record){
					var editForm = Ext.create('modules.report-mitam.MitamForm',{
						incidentId: this.incidentId,
						incidentName: this.incidentName,
						formId: record.data.id,
						datecreated: record.data.datecreated,
						formTypeId: this.formTypeId
					});
					
					this.showFormWindow(editForm, 'Update MITAM', 800);
					
					editForm.controller.loadMessageData(JSON.parse(record.data.message));
				}
			},
			
			onCloseReport: function(){
				var record = this.view.getSelectionModel().getSelection()[0];
				
				if(record){
					var editForm = Ext.create('modules.report-mitam.MitamForm',{
						incidentId: this.incidentId,
						incidentName: this.incidentName,
						formId: record.data.id,
						datecreated: record.data.datecreated,
						formTypeId: this.formTypeId
					});
					
					this.showFormWindow(editForm, 'Close MITAM', 800);
					
					var message = JSON.parse(record.data.message);
					message.report.statusValue = "Closed";
					
					editForm.controller.loadMessageData(message);
				}
			},
			
			viewReport: function(grid, record, tr, rowIndex, e, eOpts){
				var viewForm = Ext.create('modules.report-mitam.MitamForm',{
					incidentId: this.incidentId,
					incidentName: this.incidentName,
					formId: record.data.id,
					datecreated: record.data.datecreated,
					listeners: {
						afterrender: function(form){
							form.setReadOnly();
						}
					}
				});
				
				this.showFormWindow(viewForm, 'View MITAM', 800);

				viewForm.controller.loadMessageData(JSON.parse(record.data.message));
			},
			
			showFormWindow: function(form, title, height){
				var mitamWindow = new Ext.Window({
		            closable: true,
		            closeAction: 'destroy',
		            scrollable: true,
		            title: title,
		            layout: 'fit',
		            width: 550,
		            height: height,
		            items:[ form ]
				});
				
				mitamWindow.show();
			},
			
			onJoinIncident: function(e, incident) {
				this.incidentName = incident.name;
				this.incidentId = incident.id;
				
				this.getView().enable();				
				
				this.mediator.sendRequestMessage(Core.Config.getProperty(UserProfile.REST_ENDPOINT) +
						"/reports/" + this.incidentId + '/MITAM', "LoadMitamReports");
				
				
				//Subscribe to New MITAM report message on the bus
				this.newTopic = Ext.String.format(
						"iweb.NICS.incident.{0}.report.{1}.new", this.incidentId,
						'MITAM');
				this.mediator.subscribe(this.newTopic);
				this.newHandler = this.onLoadReports.bind(this)
				Core.EventManager.addListener(this.newTopic, this.newHandler);
				this.view.getSelectionModel().clearSelections();
			},

			onCloseIncident: function(e, incidentId) {
				this.mediator.unsubscribe(this.newTopic);
				
				Core.EventManager.removeListener(this.newTopic, this.newHandler);

				this.view.store.removeAll();
				this.getView().disable();
				
				this.incidentId = null;
				this.incidentName = null;
			},
			
			onLoadReports: function(e, response) {
				var newReports = [];
				if(response) {
					if(response.formId){
						newReports.push(this.buildReportData(response));
					}else if(response.reports && 
						response.reports.length > 0){
						//Add each report
						for(var i=0; i<response.reports.length; i++){
							var report = response.reports[i];
							newReports.push(this.buildReportData(report));
						}
					}
					this.view.store.loadRawData(newReports, true);
				}
			},
			
			buildReportData: function(report){
				var message = JSON.parse(report.message);
				return {
					id: report.formId,
					name: message.report.name,
					destinations: message.destinations.length,
					categories: this.getCategories(message.report),
					message: report.message,
					datecreated: message.datecreated,
					dateupdated: message.dateupdated,
					status: message.report.statusValue
				};
			},
			
			getCategories: function(report){
				var categories = "";
				for(var prop in report){
					if(report[prop] == true){
						if(categories != ""){
							categories += ",";
						}
						if(prop == 'Other'){
							categories += report.otherValue;
						}else{
							categories += prop;
						}
					}
				}
				return categories;
			}
	});
});
