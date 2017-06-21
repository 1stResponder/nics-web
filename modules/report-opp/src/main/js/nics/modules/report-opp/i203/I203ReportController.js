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
define([  'iweb/CoreModule','nics/modules/UserProfileModule','../AbstractReportController','./I203ReportView', './I203FormView','./I203InstructionsView'
			],

function(Core, UserProfile, AbstractReportController, I203ReportView, I203FormView,I203InstructionsView) {
	
	Ext.define('modules.report-opp.I203ReportController', {
		extend : 'modules.report-opp.AbstractReportController',
		alias : 'controller.i203reportcontroller',

		orgCapName: '203',
		orgIds: [],
		
		
		init : function(args) {
			this.mediator = Core.Mediator.getInstance();
			
			
			var oppInstructions = this.view.lookupReference('oppInstructions203');
		
			//Add new report
			var oppistr = new I203InstructionsView();
			 
	         oppInstructions.add(oppistr);		
	            
			var topic = "nics.report.reportType";
			Core.EventManager.createCallbackHandler(
					topic, this, function(evt, response){
						Ext.Array.each(response.types, function(type){
							if(type.formTypeName === '203'){
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

			this.title="203";
			
			//Bind UI Elements
			Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
			Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
			Core.EventManager.addListener("LoadReports203", this.onLoadReports.bind(this));
			Core.EventManager.addListener("Import201", this.onImportReport.bind(this));
			Core.EventManager.addListener("PrintReport203", this.onReportReady.bind(this));
			Core.EventManager.addListener("CancelReport203", this.onCancel.bind(this));
			Core.EventManager.fireEvent("nics.report.add", {title: this.title, component: this.getView()});
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
			this.hasFinalForm = false;
			//Load reports
			this.mediator.sendRequestMessage(endpoint +
					"/reports/" + this.incidentId + '/203', "LoadReports203");
			
			

			
			//Subscribe to New 203 report message on the bus
			this.newTopic = Ext.String.format(
					"iweb.NICS.incident.{0}.report.{1}.new", this.incidentId,
					'203');
			this.mediator.subscribe(this.newTopic);
			
			this.newHandler = this.onReportAdded.bind(this)
			Core.EventManager.addListener(this.newTopic, this.newHandler);
		},
		
		onCloseIncident: function(e, incidentId) {
			this.mediator.unsubscribe(this.newTopic);
			
			Core.EventManager.removeListener(this.newTopic, this.newHandler);
			Core.EventManager.removeListener("LoadReports203", this.onLoadReports);
			//Core.EventManager.removeListener("GetReports203", this.onGetLoadReports);
			Core.EventManager.removeListener("PrintReport203", this.onReportReady);
			Core.EventManager.removeListener("CancelReport203", this.onCancel);
			Core.EventManager.removeListener("Import201", this.onImportReport);
			
			
			var oppReportContainer = this.view.lookupReference('oppReport203');
			if ( oppReportContainer)oppReportContainer.removeAll();
			
			var oppList = this.lookupReference('oppList203');
			if (oppList)oppList.clearValue();
			if (oppList)oppList.getStore().removeAll();
			this.getView().disable();
			
			this.incidentId = null;
			this.incidentName = null;
			this.hasFinalForm = false;
			
			
		},
		
		
	onImport: function(e) {

		var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);	
		this.mediator.sendRequestMessage(endpoint +
				"/reports/" + this.incidentId + '/201', "Import201");

		},
		
       
		onImportReport: function(e, response) {

			var newReports = [];
			var hasFinal = false;
			var combo = this.lookupReference('oppList203');
			if(response) {
				if(response.reports && 
					response.reports.length > 0){
					//Add each report
					for(var i=0; i<response.reports.length; i++){
						var report = response.reports[i];
					
						var newReport  = this.buildReportData(report);
						if (newReport.status == 'FINAL') {
							hasFinal = true;
							
							newReports.push(newReport);
							combo.getStore().removeAll();
							combo.getStore().loadRawData(newReports, true);
							var latestForm = combo.getStore().getAt(0).data.formId;
							combo.setValue(latestForm);
							this.displayCurrentRecord(false, 'IMPORTED');	
							this.disableButton('create203');
							this.enableButton('update203');
							this.enableButton('final203');
							
						}
						
					}
					if (!hasFinal) {
						Ext.MessageBox.alert("Message","ICS 201 must be finalized before import");
					}

				}
				
			}
			
			
		},
			
		
		displayCurrentRecord: function(displayOnly, status){
			var combo  = this.lookupReference(this.view.comboRef);
			var currentFormId=combo.getValue();
			
			 var record = combo.findRecordByValue(currentFormId); 
			
			
			if(record){
				this.disableButton('create203');
				var oppReportContainer = this.view.lookupReference('oppReport203');
				//Clear away any previous report
				oppReportContainer.removeAll();
				//Add new report
				var i203Form = new I203FormView({
					incidentId: this.incidentId,
					incidentName: this.incidentName,
					formTypeId: this.formTypeId
				});
				 ;
		        oppReportContainer.add(i203Form);
		           
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
				
				
				if (displayOnly){
					if (this.hasFinalForm){
						this.disableButton('update203');
						this.disableButton('final203');
					}
					else {
						this.enableButton('update203');
						this.enableButton('final203');
					}
					//Add the dynamic fields in based on the report data
					
					if (formData.report.icStaffCount >5) i203Form.controller.addFieldContainer('203','icStaff', 6, (+formData.report.icStaffCount - 5));
					if (formData.report.agencyRepsCount > 3)i203Form.controller.addFieldContainer('203','agencyRep', 4, (+formData.report.agencyRepsCount - 3));
					i203Form.controller.addFieldContainer('203','intel', 2, (+formData.report.intelCount - 1));
					i203Form.controller.addFieldContainer('203','logistics', 2, (+formData.report.logisticsCount - 1));
					i203Form.controller.addFieldContainer('203','logisticsSpt', 2, (+formData.report.logisticsSptCount - 1));
					i203Form.controller.addFieldContainer('203','logisticsSrv', 2, (+formData.report.logisticsSrvCount - 1));
					
					if (formData.report.opsCount >5)i203Form.controller.addFieldContainer('203','ops', 6, (+formData.report.opsCount - 5));
					((formData.report.opsBBranchCount > 0)?
								i203Form.controller.addFieldContainer('203','opsBBranch', 2, +formData.report.opsCBranchCount-1) :
								i203Form.lookupReference('opsBBranch203').hide());
					((formData.report.opsCBranchCount > 0)?
								i203Form.controller.addFieldContainer('203','opsCBranch', 2, +formData.report.opsCBranchCount-1) :
								i203Form.lookupReference('opsCBranch203').hide());
				
					
					i203Form.controller.addFieldContainer('203','opsAirBranch', 2, (+formData.report.opsAirBranchCount - 1));
					i203Form.controller.addFieldContainer('203','finance', 2, (+formData.report.financeCount - 1));
					i203Form.controller.setFormReadOnly();
					
			}	
					
				
				else {
					if(status == 'UPDATE' || status == 'FINAL' || status == 'IMPORTED' )
					//this is an updated or finalized form, change report name to the current status
					formData.report.reportType =status;

					//formData.report.reportBy  = UserProfile.getFirstName() + " " + UserProfile.getLastName();
					formData.report.reportBy = UserProfile.getFirstName() + " " + UserProfile.getLastName();
					formData.report.prepdate = new Date();
					formData.report.preptime = new Date();
					
					  
					if (status === 'IMPORTED')i203Form.lookupReference('cancelButton203').handler = 'cancelImport'	
					//increase the sequence number and set seqtime
					++formData.report.seqnum 
					if(status == 'FINAL' )this.hasFinalForm = true;
					
					this.disableButton('view203');
					this.disableButton('final203');
					this.disableButton('print203');
					
					//Add the dynamic fields in based on the report data
					if (formData.report.icStaffCount > 4)i203Form.controller.addFieldContainer('203','icStaff', 6, (formData.report.icStaffCount - 4));
					if (formData.report.agencyRepsCount > 2)i203Form.controller.addFieldContainer('203','agencyRep', 4, (formData.report.agencyRepsCount - 2));
					i203Form.controller.addFieldContainer('203','intel', 2, +formData.report.intelCount);
					i203Form.controller.addFieldContainer('203','logistics', 2, +formData.report.logisticsCount);
					i203Form.controller.addFieldContainer('203','logisticsSpt', 2, +formData.report.logisticsSptCount);
					i203Form.controller.addFieldContainer('203','logisticsSrv', 2, +formData.report.logisticsSrvCount);
					if (formData.report.opsCount >4)i203Form.controller.addFieldContainer('203','ops', 6, (formData.report.opsCount - 4));
					i203Form.controller.addFieldContainer('203','opsBranch', 2, +formData.report.opsBranchCount);
					i203Form.controller.addFieldContainer('203','opsBBranch', 2, +formData.report.opsBBranchCount);
					i203Form.controller.addFieldContainer('203','opsCBranch', 2, +formData.report.opsCBranchCount);
					i203Form.controller.addFieldContainer('203','opsAirBranch', 2, +formData.report.opsAirBranchCount);
					i203Form.controller.addFieldContainer('203','finance', 2, +formData.report.financeCount);
					
					
					
					
					
				}
				if (i203Form.viewModel) i203Form.viewModel.set(formData.report);
				
			}
			
			
		},
		

		
		onReportAdded: function() {	
			this.mediator.sendRequestMessage(Core.Config.getProperty(UserProfile.REST_ENDPOINT) +
					"/reports/" + this.incidentId + '/203', "LoadReports203");
			
			
		},
		

		onLoadReports: function(e, response) {
			var newReports = [];
			var combo = this.lookupReference(this.view.comboRef);
			if(response) {
				if(response.reports && 
					response.reports.length > 0){
					//Add each report
					this.disableButton('create203');
					this.enableButton('print203');
					this.enableButton('view203');
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
						this.disableButton('update203');
						this.disableButton('final203');
					}
					else {
						 this.enableButton('update203');
						 this.enableButton('final203');
					}
					
					
				}
				else {
					this.enableButton('create203');
					 this.disableButton('view203');
					this.disableButton('update203');
					this.disableButton('final203');
					this.disableButton('print203');
				}
			}
		},
	onPrint: function(){
			 //Need to actually get the form from the dropdown
			this.displayCurrentRecord(true, 'select');	
			 var printMsg = null;
			var i203ReportForm = this.view.lookupReference('i203ReportForm');
			var data = i203ReportForm.viewModel.data;
			i203ReportForm.controller.buildReport(data, false, 'print');
	}
	
	});
});
