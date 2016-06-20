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
define([  'iweb/CoreModule', 
			'nics/modules/UserProfileModule','./I215ReportView', './I215FormView'
			],

function(Core, UserProfile, I215ReportView, I215FormView) {
	
	Ext.define('modules.report-i215.I215ReportController', {
		extend : 'Ext.app.ViewController',
		alias : 'controller.I215reportcontroller',
		
		
		init : function(args) {
		
			this.mediator = Core.Mediator.getInstance();
			this.lookupReference('createButton').enable();
			this.lookupReference('viewButton').disable();
			this.lookupReference('updateButton').disable();
			this.lookupReference('finalButton').disable();
			this.lookupReference('printButton').disable();
		
			
			var topic = "nics.report.reportType";
			Core.EventManager.createCallbackHandler(
					topic, this, function(evt, response){
						Ext.Array.each(response.types, function(type){
							if(type.formTypeName === '215'){
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
			Core.EventManager.addListener("Load215Reports", this.onLoadReports.bind(this));
			Core.EventManager.addListener("Print215Report", this.onReportReady.bind(this));
			Core.EventManager.addListener("Cancel215Report", this.onCancel.bind(this));
			Core.EventManager.fireEvent("nics.report.add", {title: "215", component: this.getView()});
		},
	
		onJoinIncident: function(e, incident) {
			this.incidentName = incident.name;
			this.incidentId = incident.id;
			
			
			this.getView().enable();				
			
			var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);
			//Load reports
			this.hasFinalForm = false;
			this.mediator.sendRequestMessage(endpoint +
					"/reports/" + this.incidentId + '/215', "Load215Reports");
			
			//Subscribe to New I215 report message on the bus
			this.newTopic = Ext.String.format(
					"iweb.NICS.incident.{0}.report.{1}.new", this.incidentId,
					'215');
			this.mediator.subscribe(this.newTopic);
			
			this.newHandler = this.onReportAdded.bind(this)
			Core.EventManager.addListener(this.newTopic, this.newHandler);
		
		},
		onCloseIncident: function(e, incidentId) {
			this.mediator.unsubscribe(this.newTopic);
			
			Core.EventManager.removeListener(this.newTopic, this.newHandler);
			Core.EventManager.removeListener("Print215Report", this.onReportReady);
			Core.EventManager.removeListener("Cancel215Report", this.onReportReady);
			
			
			var I215ReportContainer = this.view.lookupReference('I215Report');
			I215ReportContainer.removeAll();
			var I215List = this.lookupReference('I215List');
			I215List.clearValue();
			I215List.getStore().removeAll()
			this.getView().disable();
			this.incidentId = null;
			this.incidentName = null;
			this.emailList = null;
			this.hasFinalForm = false;
			        
		},
		
	onAdd: function(e) {
			var I215ReportContainer = this.view.lookupReference('I215Report');
			var username  = UserProfile.getFirstName() + " " + UserProfile.getLastName();
            var I215Form = Ext.create('modules.report-i215.I215FormView',{
            	incidentId: this.incidentId,
				incidentName: this.incidentName,
				formTypeId: this.formTypeId
			});
            I215ReportContainer.removeAll();
            I215ReportContainer.add(I215Form);
        	var initialData= {incidentId: this.incidentId, 
        			incidentName: this.incidentName, 
        			reportType: 'NEW',
        			preptime: new Date(),
        			formTypeId:this.formTypeId,
        			reportBy:  username};
			I215Form.viewModel.set(initialData);
			this.lookupReference('createButton').disable();
		},
		
        onUpdate: function(){
        	this.displayCurrentRecord(false, 'UPDATE');
		},
		
		onFinalize: function(){
			this.displayCurrentRecord(false, 'FINAL');
		},
		
		onView: function(){
			this.displayCurrentRecord(true, 'select');	
		},
		onCancel: function(){
			var combo  = this.lookupReference('I215List');
			var currentFormId=combo.getValue();
			if (currentFormId){
				this.hasFinalForm = false;
				this.displayCurrentRecord(true, 'select');
			}
			else{
				var i215ReportContainer = this.view.lookupReference('I215Report');
				i215ReportContainer.removeAll();
				this.lookupReference('createButton').enable();
				
			}
			
				
		},
		onReportSelect: function(){
			this.displayCurrentRecord(true, 'select');	
		},
		displayCurrentRecord: function(displayOnly, status){
			var combo  = this.lookupReference('I215List');
			var currentFormId=combo.getValue();
			
			 var record = combo.findRecordByValue(currentFormId); 
			
			
			if(record){
		
				var I215ReportContainer = this.view.lookupReference('I215Report');
				//Clear away any previous report
				I215ReportContainer.removeAll();
				
				//Add new report
				var I215Form = Ext.create('modules.report-i215.I215FormView',{
					incidentId: this.incidentId,
					incidentName: this.incidentName,
					formTypeId: this.formTypeId
				
					
					
				});
				 //I215ReportContainer.show();
		         I215ReportContainer.add(I215Form);				//Pull data from the report, and add in the incidentName and Id
				var formData = (JSON.parse(record.data.message));
			    formData.report.incidentId = record.data.incidentId;
			    formData.report.incidentName = record.data.incidentName;
			    formData.report.formTypeId = this.formTypeId;
				//Convert request date, requestArrival date and starttime back to date objects so they will display properly on the forms
				formData.report.startdate = new Date(formData.report.startdate);
				formData.report.starttime = new Date(formData.report.starttime);
				formData.report.requestArrival = new Date(formData.report.requestArrival);
				
				if (displayOnly){
					I215Form.controller.setFormReadOnly();
					formData.report.preptime = new Date(formData.report.preptime);
					
					if (this.hasFinalForm){
						this.lookupReference('updateButton').disable();
						this.lookupReference('finalButton').disable();
					}
					else {
						
						this.lookupReference('updateButton').enable();
						this.lookupReference('finalButton').enable();
					}
				}
				else {
					if(status == 'UPDATE' || status == 'FINAL' )
						formData.report.preptime = new Date();
					//this is an updated or finalized form, change report name to the current status
					 formData.report.reportType =status;
					formData.report.preptime = new Date();
					if(status == 'FINAL' )this.hasFinalForm = true;
					
					this.lookupReference('viewButton').disable();
					this.lookupReference('finalButton').disable();
					this.lookupReference('printButton').disable();
					
				}
				I215Form.viewModel.set(formData.report);
			}
			
			
		},
		

		
		onReportAdded: function() {	
			this.lookupReference('createButton').disable();
			this.lookupReference('viewButton').enable();
			this.lookupReference('printButton').enable();
			
			if (this.hasFinalForm){
				this.lookupReference('updateButton').disable();
				this.lookupReference('finalButton').disable();
			}
			else {
				this.lookupReference('updateButton').enable();
				this.lookupReference('finalButton').enable();
			}
			this.mediator.sendRequestMessage(Core.Config.getProperty(UserProfile.REST_ENDPOINT) +
					"/reports/" + this.incidentId + '/215', "Load215Reports");
			
		},
		
		onLoadReports: function(e, response) {
			var newReports = [];
			//var isFinal = false;
			var combo = this.lookupReference('I215List');
			if(response) {
				if(response.reports && 
					response.reports.length > 0){
					//Add each report
					this.lookupReference('createButton').disable();
					this.lookupReference('printButton').enable();
					this.lookupReference('viewButton').enable();
					
					for(var i=0; i<response.reports.length; i++){
						var report = response.reports[i];
					
						var newReport  = this.buildReportData(report);
						newReports.push(newReport);
						if (newReport.status == 'FINAL') {
							this.hasFinalForm = true;	
						}						
					}
					combo.getStore().removeAll();
					combo.getStore().loadRawData(newReports, true);
					var latestForm = combo.getStore().getAt(0).data.formId;
					combo.setValue(latestForm);
					//this.displayCurrentRecord(true, 'select');
					if (this.hasFinalForm){
						this.lookupReference('updateButton').disable();
						this.lookupReference('finalButton').disable();
					}
					else {
						this.lookupReference('updateButton').enable();
						this.lookupReference('finalButton').enable();
					}
					
				}
				else {
					this.lookupReference('createButton').enable();
					this.lookupReference('viewButton').disable();
					this.lookupReference('updateButton').disable();
					this.lookupReference('finalButton').disable();
					this.lookupReference('printButton').disable();
				}
			}
		},
		
		buildReportData: function(report){
			var message = JSON.parse(report.message);
			var reportTitle  = message.datecreated + "-" + message.report.role;
			var reportType = message.report.reportType;
		
			
			
			return {
				formId: report.formId,
				incidentId: this.incidentId,
				incidentName: this.incidentName,
				name: reportTitle,
				message: report.message,
				status: reportType,
				datecreated: report.datecreated,
				dateupdated: report.dateupdated
			};
		},
		
	
	onPrint: function(){
			 //Need to actually get the form from the dropdown
			this.displayCurrentRecord(true, 'select');	
			 var printMsg = null;
			var I215ReportForm = this.view.lookupReference('I215ReportForm');
			var data = I215ReportForm.viewModel.data;
			I215ReportForm.controller.buildReport(data, false, 'print');
	},

	onReportReady: function(e, response) {
		if (response){
			 var iFrameId = "printerFrame";
			 var printFrame = Ext.get(iFrameId);
			 if (printFrame == null) {
		     printFrame = Ext.getBody().appendChild({
		                id: iFrameId,
		                tag: 'iframe',
		                cls: 'x-hidden',  style: {
		                    display: "none"
		                }
		            });
		        }
		     var printContent = printFrame.dom.contentWindow;
			  // output to the iframe
		     printContent.document.open();
		     printContent.document.write(response);
		     printContent.document.close();
		  // print the iframe
		     printContent.print();
		
			}
			
	}
	
		
		

	});
});
