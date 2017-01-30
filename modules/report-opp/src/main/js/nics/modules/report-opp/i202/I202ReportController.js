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
define([  'iweb/CoreModule', 'nics/modules/UserProfileModule',
			'../AbstractReportController','./I202ReportView', './I202FormView','./I202InstructionsView'
			],

function(Core, UserProfile, AbstractReportController, I202ReportView, I202FormView,I202InstructionsView) {
	
	Ext.define('modules.report-opp.I202ReportController', {
		extend : 'modules.report-opp.AbstractReportController',
		alias : 'controller.i202reportcontroller',
		orgCapName: '202', 
		orgIds: [],

		
		init : function(args) {
			this.mediator = Core.Mediator.getInstance();
			this.enableButton('create202');
			this.disableButton('view202');
			this.disableButton('update202');
			this.disableButton('final202');
			this.disableButton('print202');
			 
			 var oppInstructions = this.view.lookupReference('oppInstructions202');
			
			//Add new report
			var oppistr = new I202InstructionsView();
			oppInstructions.add(oppistr);		
			 
			var topic = "nics.report.reportType";
			Core.EventManager.createCallbackHandler(
					topic, this, function(evt, response){
						Ext.Array.each(response.types, function(type){
							if(type.formTypeName === '202'){
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
			Core.EventManager.addListener("LoadReports202", this.onLoadReports.bind(this));
			Core.EventManager.addListener("PrintReport202", this.onReportReady.bind(this));
			Core.EventManager.addListener("CancelReport202", this.onCancel.bind(this));
			Core.EventManager.fireEvent("nics.report.add", {title: "202", component: this.getView()});
			Core.EventManager.addListener("nics.user.profile.loaded", this.updateOrgCapsListener.bind(this));
			this.bindOrgCaps = this.orgCapUpdate.bind(this);
			
		},
		updateOrgCapsListener: function(evt, data){
			
			

            if(this.currentOrg){
                this.mediator.unsubscribe("iweb.nics.orgcaps." + this.currentOrg + "." + this.orgCapName); 
                Core.EventManager.removeListener("iweb.nics.orgcaps." + this.currentOrg  + "." + this.orgCapName, this.bindOrgCaps);
            }

            this.currentOrg = UserProfile.getOrgId();

            if(this.orgIds.indexOf(UserProfile.getOrgId()) == -1){
                Core.EventManager.addListener("iweb.nics.orgcaps." + this.currentOrg + "." + this.orgCapName, this.bindOrgCaps);
                this.orgIds.push(this.currentOrg);
            }

            this.mediator.subscribe("iweb.nics.orgcaps." + this.currentOrg + "." + this.orgCapName);
		},
	
		orgCapUpdate: function(evt, orgcap){

			if(orgcap.activeWeb){
				this.getView().enable();
			}
			else{
				this.getView().disable();
			}
		
			UserProfile.setOrgCap(orgcap.cap.name,orgcap.activeWeb);
		
		},	
	
		onJoinIncident: function(e, incident) {
			this.incidentName = incident.name;
			this.incidentId = incident.id;

			this.getView().enable();
			
			var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);
			this.hasFinalForm = false;
			//Load reports
			this.mediator.sendRequestMessage(endpoint +
					"/reports/" + this.incidentId + '/202', "LoadReports202");
			//Subscribe to New 202 report message on the bus
			this.newTopic = Ext.String.format(
					"iweb.NICS.incident.{0}.report.{1}.new", this.incidentId,
					'202');
			this.mediator.subscribe(this.newTopic);
			
			this.newHandler = this.onReportAdded.bind(this)
			Core.EventManager.addListener(this.newTopic, this.newHandler);
			
			
			
		},
		
		onCloseIncident: function(e, incidentId) {
			this.mediator.unsubscribe(this.newTopic);
			
			Core.EventManager.removeListener(this.newTopic, this.newHandler);
			Core.EventManager.removeListener("LoadReports202", this.onLoadReports);
			Core.EventManager.removeListener("PrintReport202", this.onReportReady);
			Core.EventManager.removeListener("CancelReport202", this.onCancel);
			
			var oppReportContainer = this.view.lookupReference('oppReport202');
			if(oppReportContainer)oppReportContainer.removeAll();
			
			var oppList = this.lookupReference('oppList202' );
			if (oppList)oppList.clearValue();
			if (oppList)oppList.getStore().removeAll()
			this.getView().disable();
			
			this.incidentId = null;
			this.incidentName = null;
			this.hasFinalForm = false;
		},
		
	onAdd: function(e) {
			var oppReportContainer = this.view.lookupReference('oppReport202');
			var username  = UserProfile.getFirstName() + " " + UserProfile.getLastName();
	           
			 var i202Form = new I202FormView({
            	incidentId: this.incidentId,
				incidentName: this.incidentName,
				formTypeId: this.formTypeId,
				
			});
            oppReportContainer.removeAll();
            oppReportContainer.add(i202Form);
        	var initialData= {incidentId: this.incidentId, 
        			incidentName: this.incidentName, 
        			reportType: 'NEW',
        			prepdate: new Date(),
        			preptime: new Date(),
        			formTypeId:this.formTypeId,
        			reportBy:  username,
    				seqnum: 1,
    				
    				
    				
        	}
			i202Form.viewModel.set(initialData);	
        	this.disableButton('create202');
			
		},
		
       
		
			
		
		displayCurrentRecord: function(displayOnly, status){

			var combo  = this.lookupReference('oppList202');
			var currentFormId=combo.getValue();
			
			 var record = combo.findRecordByValue(currentFormId); 
			
			
			if(record){
				this.disableButton('create202');
				
				var oppReportContainer = this.view.lookupReference('oppReport202');
				//Clear away any previous report
				oppReportContainer.removeAll();
				//Add new report
				var i202Form = new I202FormView({
					incidentId: this.incidentId,
					incidentName: this.incidentName,
					formTypeId: this.formTypeId
				
					
					
				});
				 ;
		        oppReportContainer.add(i202Form);
		           
		         //Pull data from the report, and add in the incidentName and Id
				var formData = (JSON.parse(record.data.message));
			    formData.report.incidentId = record.data.incidentId;
			    formData.report.incidentName = record.data.incidentName;
			    formData.report.formTypeId = this.formTypeId;
				   
			    //Convert date and starttime back to date objects so they will display properly on the forms
			    if (formData.report.date) formData.report.date = new Date(formData.report.date);
				if (formData.report.starttime)formData.report.starttime = new Date(formData.report.starttime);
				if (formData.report.enddate) formData.report.enddate = new Date(formData.report.enddate);
				if (formData.report.endtime)formData.report.endtime = new Date(formData.report.endtime);
				if (formData.report.prepdate) formData.report.prepdate = new Date(formData.report.prepdate);
				if (formData.report.preptime)formData.report.preptime = new Date(formData.report.preptime);
				
				formData.report.reportBy = UserProfile.getFirstName() + " " + UserProfile.getLastName();
				
				
				
				if (displayOnly){
					if (formData.report.prepdate) formData.report.prepdate = new Date(formData.report.prepdate);
					if (formData.report.preptime)formData.report.preptime = new Date(formData.report.preptime);
					
					if (this.hasFinalForm){

						this.disableButton('update202');
						this.disableButton('final202');
					}
					else {
						this.enableButton('update202');
						this.enableButton('final202');
					}
					i202Form.controller.setFormReadOnly();
					
					
				}
				else {
					if (formData.report.prepdate) formData.report.prepdate = new Date();
					if (formData.report.preptime)formData.report.preptime = new Date();
					
					if(status == 'UPDATE' || status == 'FINAL' )
					//this is an updated or finalized form, change report name to the current status
					 formData.report.reportType =status;
					formData.report.reportBy  = UserProfile.getFirstName() + " " + UserProfile.getLastName();
					//increase the sequence number and set seqtime
					++formData.report.seqnum 
					if(status == 'FINAL' )this.hasFinalForm = true;
					this.disableButton('view202');
					this.disableButton('final202');
					this.disableButton('print202');
					
					
				}
				if (i202Form.viewModel) i202Form.viewModel.set(formData.report);
				
			}
			
			
		},
		
		onLoadReports: function(e, response) {
			var newReports = [];
			var combo = this.lookupReference('oppList202');
			if(response) {
				if(response.reports && 
					response.reports.length > 0){
					//Add each report
					this.disableButton('create202');
					this.enableButton('print202');
					this.enableButton('view202');
					
					
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
					this.displayCurrentRecord(true, 'select');	
					if (this.hasFinalForm){
						this.disableButton('update202');
						this.disableButton('final202');
					}
					else {
						 this.enableButton('update202');
						 this.enableButton('final202');
					}
					
					
				}
				else {
					 this.enableButton('create202');
					 this.disableButton('view202');
					this.disableButton('update202');
					this.disableButton('final202');
					this.disableButton('print202');
				}
				
			}
			
		},
		
		
		onReportAdded: function() {	
			this.disableButton('create202');
			 this.enableButton('view202');
			this.enableButton('update202');
			this.enableButton('final202');
			this.enableButton('print202');
			
			this.mediator.sendRequestMessage(Core.Config.getProperty(UserProfile.REST_ENDPOINT) +
					"/reports/" + this.incidentId + '/202', "LoadReports202");
			
		},
		onPrint: function(){
			 //Need to actually get the form from the dropdown
			this.displayCurrentRecord(true, 'select');	
			 var printMsg = null;
			var i202ReportForm = this.view.lookupReference('i202ReportForm');
			var data = i202ReportForm.viewModel.data;
			i202ReportForm.controller.buildReport(data, false, 'print');
	}
	
	});
});
