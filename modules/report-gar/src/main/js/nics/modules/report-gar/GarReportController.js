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
			'nics/modules/UserProfileModule','./GarReportView', './GarFormView'
			],

function(Core, UserProfile, GarReportView, GarFormView) {
	
	Ext.define('modules.report-gar.GarReportController', {
		extend : 'Ext.app.ViewController',
		alias : 'controller.garreportcontroller',
		orgCapName: 'GAR',
		orgIds: [],
		
		init : function(args) {
			
			this.mediator = Core.Mediator.getInstance();
			this.lookupReference('createButton').enable();
			this.lookupReference('viewButton').disable();
			this.lookupReference('updateButton').disable();
			//this.lookupReference('finalButton').disable();
			this.lookupReference('printButton').disable();
			
			var topic = "nics.report.reportType";
			
			Core.EventManager.createCallbackHandler(
					topic, this, function(evt, response){
						Ext.Array.each(response.types, function(type){
							if(type.formTypeName === 'GAR'){
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

			this.title="GAR";

			//Bind UI Elements
			Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
			Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
			Core.EventManager.addListener("LoadGarReports", this.onLoadReports.bind(this));
			Core.EventManager.addListener("PrintGarReport", this.onReportReady.bind(this));
			Core.EventManager.addListener("CancelGarReport", this.onCancel.bind(this));
			Core.EventManager.fireEvent("nics.report.add", {title: this.title, component: this.getView()});
			Core.EventManager.addListener("nics.user.profile.loaded", this.updateOrgCapsListener.bind(this));
		},
	
		updateOrgCapsListener: function(evt, data){
		
			if(this.currentOrg){
				this.mediator.unsubscribe("iweb.nics.orgcaps." + this.currentOrg + "." + this.orgCapName);
				Core.EventManager.removeListener("iweb.nics.orgcaps." + this.currentOrg + "." + this.orgCapName, this.orgCapUpdate);
			}
			
			this.currentOrg = UserProfile.getOrgId();
			
			if(this.orgIds.indexOf(UserProfile.getOrgId()) == -1){
				Core.EventManager.addListener("iweb.nics.orgcaps." + this.currentOrg + "." + this.orgCapName, this.orgCapUpdate.bind(this));
				this.orgIds.push(this.currentOrg);
			}

			this.mediator.subscribe("iweb.nics.orgcaps." + this.currentOrg + "." + this.orgCapName);
			
		},
	
		orgCapUpdate: function(evt, orgcap){

			if(orgcap.activeWeb){
				this.getView().enable();
				this.getView().up('tabpanel').down('tab[text=' + this.title +']').enable();
			}
			else{
				this.getView().disable();
				this.getView().up('tabpanel').down('tab[text=' + this.title +']').disable();
			}
		
			UserProfile.setOrgCap(orgcap.cap.name,orgcap.activeWeb);
		
		},
	
		onJoinIncident: function(e, incident) {
			
			this.incidentName = incident.name;
			this.incidentId = incident.id;	

			if(UserProfile.isOrgCapEnabled(this.orgCapName)){
				this.getView().enable();
				this.getView().up('tabpanel').down('tab[text=' + this.title +']').enable();
			}
			else{
				this.getView().disable();
				this.getView().up('tabpanel').down('tab[text=' + this.title +']').disable();
			}

			var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);
			//Load reports
			this.hasFinalForm = false;
			this.mediator.sendRequestMessage(endpoint +
					"/reports/" + this.incidentId + '/GAR', "LoadGarReports");
			
			this.newTopic = Ext.String.format(
					"iweb.NICS.incident.{0}.report.{1}.new", this.incidentId,
					'GAR');
			this.mediator.subscribe(this.newTopic);
			
			this.newHandler = this.onReportAdded.bind(this)
			Core.EventManager.addListener(this.newTopic, this.newHandler);

		},
		onCloseIncident: function(e, incidentId) {
			this.mediator.unsubscribe(this.newTopic);
			
			Core.EventManager.removeListener(this.newTopic, this.newHandler);
			Core.EventManager.removeListener("PrintGarReport", this.onReportReady);
			Core.EventManager.removeListener("CancelGarReport", this.onReportReady);
			
			var garReportContainer = this.view.lookupReference('garReport');
			garReportContainer.removeAll();
			
			var garList = this.lookupReference('garList');
			garList.clearValue();
			garList.getStore().removeAll();
			this.getView().disable();
			
			this.incidentId = null;
			this.incidentName = null;
			this.hasFinalForm = false;
        
		},
		
		onAddGar: function(e) {
			var garReportContainer = this.view.lookupReference('garReport');
			var userfull  = UserProfile.getFirstName() + " " + UserProfile.getLastName();
            var garForm = Ext.create('modules.report-gar.GarFormView',{
            	incidentId: this.incidentId,
				incidentName: this.incidentName,
				formTypeId: this.formTypeId,
				reportType: 'NEW'
			
			});
			
			garReportContainer.removeAll();
			garReportContainer.show();
            garReportContainer.add(garForm);
            
        	var initialData= {incidentId: this.incidentId, 
        			incidentName: this.incidentName,
        			requestDate: new Date(),
        			formTypeId:this.formTypeId,
					user: UserProfile.getUsername(),
					userfull: userfull,
					seqtime: new Date().getTime()
				};
        			
			garForm.viewModel.set(initialData);
			garForm.controller.onSliderChange();
			garForm.controller.onGarResultChange();
			
			
		},
		
        onUpdateGar: function(){
        	this.view.lookupReference('garReport').removeAll();
        	this.displayCurrentRecord(false, 'UPDATE');
		},
		
		onFinalizeGar: function(){
			this.displayCurrentRecord(false, 'FINAL');
		},
		
		onReportSelect: function(){
			this.displayCurrentRecord(true, 'select');	
		},
		onViewGar: function(){
			this.displayCurrentRecord(true, 'select');	
		},
		onCancel: function(){
			var combo  = this.lookupReference('garList');
			var currentFormId=combo.getValue();
			if (currentFormId){
				this.displayCurrentRecord(true, 'select');
			}
			else{
				var garReportContainer = this.view.lookupReference('garReport');
				garReportContainer.removeAll();
				
			}
			
				
		},
		displayCurrentRecord: function(displayOnly, status){
			var combo  = this.lookupReference('garList');
			var currentFormId=combo.getValue();
			
			 var record = combo.findRecordByValue(currentFormId); 
			
			if(record){
				
				
				var garReportContainer = this.view.lookupReference('garReport');
				//Clear away any previous report
				garReportContainer.removeAll();
				//Add new report
				var garForm = Ext.create('modules.report-gar.GarFormView',{
					incidentId: this.incidentId,
					incidentName: this.incidentName,
					formTypeId: this.formTypeId
					
				});
				 garReportContainer.show();
		         garReportContainer.add(garForm);				//Pull data from the report, and add in the incidentName and Id
				var formData = (JSON.parse(record.data.message));
			    formData.report.incidentId = record.data.incidentId;
			    formData.report.incidentName = record.data.incidentName;
			    formData.report.formTypeId = this.formTypeId;
				   
			    //Mobile datetimes sometimes come back in the form "2016-07-29 09:40:05" instead of the javascript valid form: "2016-07-29T09:40:05". 
			    //Test for the missing T
			    
			    var checkMobileDate = formData.report.requestDate.match(/^\d{4}-\d{1,2}-\d{1,2}\s\d{2}:\d{2}:\d{2}$/);
			    if (checkMobileDate) {
			    	//make it a valid date by adding in the T
			    	formData.report.requestDate = mobileDate.replace(/(\s)/, "T");
			    }
			    //Convert date and starttime back to date objects so they will display properly on the forms
				   
			    formData.report.requestDate = new Date(formData.report.requestDate);
			    
				
				formData.report.fireDate = new Date(formData.report.fireDate);
				
				if (displayOnly){
					garForm.controller.setFormReadOnly();
					formData.report.preptime = new Date();
					this.lookupReference('updateButton').enable();
						
					
				}
				else {
					if(status == 'UPDATE'  )
					//this is an updated or finalized form, change report name to the current status
					 formData.report.reportType = status;
						this.lookupReference('viewButton').disable();
					  this.lookupReference('printButton').disable();
					 
				}
				garForm.viewModel.set(formData.report);
			}
			
			
		},
		
		onReportAdded: function() {	
			this.lookupReference('viewButton').enable();
			this.lookupReference('printButton').enable();
			
			this.mediator.sendRequestMessage(Core.Config.getProperty(UserProfile.REST_ENDPOINT) +
					"/reports/" + this.incidentId + '/GAR', "LoadGarReports");
			
		},
		
		onLoadReports: function(e, response) {
			var newReports = [];
			var isFinal = false;
			var combo = this.lookupReference('garList');
			if(response) {
				if(response.reports && 
					response.reports.length > 0){
					//Add each report
					this.lookupReference('printButton').enable();
					this.lookupReference('viewButton').enable();
					
					for(var i=0; i<response.reports.length; i++){
						var report = response.reports[i];
					
						var newReport  = this.buildReportData(report);
						newReports.push(newReport);
												
					}
					combo.getStore().removeAll();
					combo.getStore().loadRawData(newReports, true);
					var latestForm = combo.getStore().getAt(0).data.formId;
					combo.setValue(latestForm);
					//this.displayCurrentRecord(true, 'select');
					
					
				}
				else {
					this.lookupReference('viewButton').disable();
					this.lookupReference('updateButton').disable();
					//this.lookupReference('finalButton').disable();
					this.lookupReference('printButton').disable();
				}
			}
			
		},
		
		buildReportData: function(report){
			var message = JSON.parse(report.message);
			var reportTitle  = message.datecreated;
			if (message.report.divgroupstaging) reportTitle += " - " + message.report.divgroupstaging;
			
			var reportType = message.report.reportType;
			
			return {
				formId: report.formId,
				incidentId: this.incidentId,
				incidentName: this.incidentName,
				name: reportTitle,
				message: report.message,
				status: reportType,
				requestDate: report.requestDate
			};
		},
			
		onPrintGar: function(){
			
			this.displayCurrentRecord(true, 'select');
			var printMsg = null;
			var garReportForm = this.view.lookupReference('garReportForm');
			var data = garReportForm.viewModel.data;
			garReportForm.controller.buildReport(data, 'print');
			
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
			     printContent.print();
			
				}
				
		}
	

	});
});
