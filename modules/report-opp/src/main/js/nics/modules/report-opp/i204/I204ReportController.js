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
			'../AbstractReportController','./I204ReportView', './I204FormView','./I204InstructionsView'
			],

function(Core, UserProfile, AbstractReportController, I204ReportView, I204FormView,I204InstructionsView) {
	
	Ext.define('modules.report-opp.I204ReportController', {
		extend : 'modules.report-opp.AbstractReportController',
		alias : 'controller.i204reportcontroller',
		orgCapName: '204',
		orgIds: [],
		
		init : function(args) {
			this.mediator = Core.Mediator.getInstance();
			this.enableButton('create204');
			this.disableButton('view204');
			this.disableButton('update204');
			this.disableButton('final204');
			this.disableButton('print204');
			 
			 var oppInstructions = this.view.lookupReference('oppInstructions204');
			
			//Add new report
			var oppistr = new I204InstructionsView();
			oppInstructions.add(oppistr);		
			 
			var topic = "nics.report.reportType";
			Core.EventManager.createCallbackHandler(
					topic, this, function(evt, response){
						Ext.Array.each(response.types, function(type){
							if(type.formTypeName === '204'){
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
			Core.EventManager.addListener("LoadReports204", this.onLoadReports.bind(this));
			Core.EventManager.addListener("PrintReport204", this.onReportReady.bind(this));
			Core.EventManager.addListener("CancelReport204", this.onCancel.bind(this));
			Core.EventManager.fireEvent("nics.report.add", {title: "204", component: this.getView()});
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
			//Load reports
			this.mediator.sendRequestMessage(endpoint +
					"/reports/" + this.incidentId + '/204', "LoadReports204");
			//Subscribe to New 204 report message on the bus
			this.newTopic = Ext.String.format(
					"iweb.NICS.incident.{0}.report.{1}.new", this.incidentId,
					'204');
			this.mediator.subscribe(this.newTopic);
			
			this.newHandler = this.onReportAdded.bind(this)
			Core.EventManager.addListener(this.newTopic, this.newHandler);
			
			
			
		},
		
		onCloseIncident: function(e, incidentId) {
			this.mediator.unsubscribe(this.newTopic);
			
			Core.EventManager.removeListener(this.newTopic, this.newHandler);
			Core.EventManager.removeListener("LoadReports204", this.onLoadReports);
			//Core.EventManager.removeListener("GetReports204", this.onGetLoadReports.bind(this));
			Core.EventManager.removeListener("PrintReport204", this.onReportReady);
			Core.EventManager.removeListener("CancelReport204", this.onCancel);
			
			var oppReportContainer = this.view.lookupReference('oppReport204');
			if(oppReportContainer)oppReportContainer.removeAll();
			
			var oppList = this.lookupReference('oppList204' );
			if (oppList)oppList.clearValue();
			if (oppList)oppList.getStore().removeAll()
			this.getView().disable();
			
			this.incidentId = null;
			this.incidentName = null;
			
		},
		
	onAdd: function(e) {
			var oppReportContainer = this.view.lookupReference('oppReport204');
			var username  = UserProfile.getFirstName() + " " + UserProfile.getLastName();
	           
			 var i204Form = new I204FormView({
            	incidentId: this.incidentId,
				incidentName: this.incidentName,
				formTypeId: this.formTypeId,
				
			});
            oppReportContainer.removeAll();
            oppReportContainer.add(i204Form);
        	var initialData= {incidentId: this.incidentId, 
        			incidentName: this.incidentName, 
        			reportType: 'NEW',
        			date: new Date(),
        			starttime: new Date(),
        			prepdate: new Date(),
        			preptime: new Date(),
        			formTypeId:this.formTypeId,
        			reportBy:  username,
    				seqnum: 1,
    				
    				
    				
        	}
			i204Form.viewModel.set(initialData);	
        	
			
		},
		
       
		
			
		
		displayCurrentRecord: function(displayOnly, status){

			var combo  = this.lookupReference('oppList204');
			var currentFormId=combo.getValue();
			
			 var record = combo.findRecordByValue(currentFormId); 
			
			
			if(record){
				var oppReportContainer = this.view.lookupReference('oppReport204');
				//Clear away any previous report
				oppReportContainer.removeAll();
				//Add new report
				var i204Form = new I204FormView({
					incidentId: this.incidentId,
					incidentName: this.incidentName,
					formTypeId: this.formTypeId
				
					
					
				});
				 
		        oppReportContainer.add(i204Form);
		           
		         //Pull data from the report, and add in the incidentName and Id
				var formData = (JSON.parse(record.data.message));
			    formData.report.incidentId = record.data.incidentId;
			    formData.report.incidentName = record.data.incidentName;
			    formData.report.formTypeId = this.formTypeId;
				   
			   
				//Convert date and starttime back to date objects so they will display properly on the forms
				formData.report.date = new Date(formData.report.date);
				formData.report.starttime = new Date(formData.report.starttime);

				if (formData.report.enddate) formData.report.enddate = new Date(formData.report.enddate);
				if (formData.report.endtime)formData.report.endtime = new Date(formData.report.endtime);
				if (formData.report.prepdate) formData.report.prepdate = new Date(formData.report.prepdate);
				if (formData.report.preptime)formData.report.preptime = new Date(formData.report.preptime);
				if (formData.report.pscReviewdate) formData.report.pscReviewdate = new Date(formData.report.pscReviewdate);
				if (formData.report.pscReviewtime)formData.report.pscReviewtime = new Date(formData.report.pscReviewtime);
				if (formData.report.opscReviewdate) formData.report.opscReviewdate = new Date(formData.report.opscReviewdate);
				if (formData.report.opscReviewtime)formData.report.opscReviewtime = new Date(formData.report.opscReviewtime);
				
				if (displayOnly){
					this.enableButton('update204');
					this.enableButton('final204');
					
					//Add the dynamic fields in based on the report data
					if (formData.report.taskCount >10) i204Form.controller.addFieldContainer('204','tasklist', 11, (formData.report.taskCount - 10));
					if (formData.report.commsCount > 5) i204Form.controller.addFieldContainer('204','comms', 6, (formData.report.commsCount - 5));
					i204Form.controller.setFormReadOnly();
					
					
				}
				else {
					if(status == 'UPDATE')
					//this is an updated or finalized form, change report name to the current status
					 formData.report.reportType =status;
					formData.report.reportBy  = UserProfile.getFirstName() + " " + UserProfile.getLastName();
					
					//increase the sequence number and set seqtime
					++formData.report.seqnum 
					this.disableButton('view204');
					this.disableButton('final204');
					this.disableButton('print204');
					
					
					//Add the dynamic fields in based on the report data
					if (formData.report.commsCount >4) i204Form.controller.addFieldContainer('204','comms', 6, (formData.report.commsCount - 4));
					if (formData.report.taskCount > 9)i204Form.controller.addFieldContainer('204','tasklist', 11, (formData.report.taskCount -9));
					
					
				}
				if (i204Form.viewModel) i204Form.viewModel.set(formData.report);
				
			}
			
			
		},
		
		onLoadReports: function(e, response) {
			var newReports = [];
			var combo = this.lookupReference('oppList204');
			if(response) {
				if(response.reports && 
					response.reports.length > 0){
					//Add each report
					this.enableButton('print204');
					this.enableButton('view204');
					
					
					for(var i=0; i<response.reports.length; i++){
						var report = response.reports[i];
					
						var newReport  = this.buildReportData(report);
						newReports.push(newReport);
											
					}
					combo.getStore().removeAll();
					combo.getStore().loadRawData(newReports, true);
					var latestForm = combo.getStore().getAt(0).data.formId;
					combo.setValue(latestForm);
					this.displayCurrentRecord(true, 'select');	
					
					
					
				}
				else {
					 this.disableButton('view204');
					this.disableButton('update204');
					this.disableButton('final204');
					this.disableButton('print204');
				}
				
			}
			
		},
		buildReportData: function(report){
			var message = JSON.parse(report.message);
			var reportTitle  = message.datecreated ;
			if (message.report.branch) reportTitle +=" - " + message.report.branch;
			reportTitle += " - " + message.report.divgroupstaging;
			var reportType = message.report.reportType;
		
			
			
			return {
				formId: report.formId,
				incidentId: this.incidentId,
				incidentName: this.incidentName,
				name: reportTitle,
				message: report.message,
				status: reportType,
				datecreated: report.datecreated
				
			};
		},
		
		onReportAdded: function() {	
			 this.enableButton('view204');
			this.enableButton('update204');
			this.enableButton('final204');
			this.enableButton('print204');
			
			this.mediator.sendRequestMessage(Core.Config.getProperty(UserProfile.REST_ENDPOINT) +
					"/reports/" + this.incidentId + '/204', "LoadReports204");
			
		},
		
	
		
		
		
		onPrint: function(){
			 //Need to actually get the form from the dropdown
			this.displayCurrentRecord(true, 'select');	
			 var printMsg = null;
			var i204ReportForm = this.view.lookupReference('i204ReportForm');
			var data = i204ReportForm.viewModel.data;
			i204ReportForm.controller.buildReport(data, false, 'print');
	}
	
	});
});
