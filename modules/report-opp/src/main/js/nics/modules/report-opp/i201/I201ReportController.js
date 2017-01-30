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
			'../AbstractReportController','./I201ReportView', './I201FormView','./I201InstructionsView'
			],

function(Core, UserProfile, AbstractReportController, I201ReportView, I201FormView,I201InstructionsView) {
	
	Ext.define('modules.report-opp.I201ReportController', {
		extend : 'modules.report-opp.AbstractReportController',
		alias : 'controller.i201reportcontroller',
		orgCapName: '201',
		orgIds: [],
		
		init : function(args) {
			this.mediator = Core.Mediator.getInstance();
			this.enableButton('create201');
			this.disableButton('view201');
			this.disableButton('update201');
			this.disableButton('final201');
			this.disableButton('print201');
			 
			 var oppInstructions = this.view.lookupReference('oppInstructions201');
			
			//Add new report
			var oppistr = new I201InstructionsView();
			oppInstructions.add(oppistr);		
			 
			var topic = "nics.report.reportType";
			Core.EventManager.createCallbackHandler(
					topic, this, function(evt, response){
						Ext.Array.each(response.types, function(type){
							if(type.formTypeName === '201'){
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
			Core.EventManager.addListener("LoadReports201", this.onLoadReports.bind(this));
			Core.EventManager.addListener("PrintReport201", this.onReportReady.bind(this));
			Core.EventManager.addListener("CancelReport201", this.onCancel.bind(this));
			Core.EventManager.fireEvent("nics.report.add", {title: "201", component: this.getView()});
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
					"/reports/" + this.incidentId + '/201', "LoadReports201");
			//Subscribe to New 201 report message on the bus
			this.newTopic = Ext.String.format(
					"iweb.NICS.incident.{0}.report.{1}.new", this.incidentId,
					'201');
			this.mediator.subscribe(this.newTopic);
			
			this.newHandler = this.onReportAdded.bind(this)
			Core.EventManager.addListener(this.newTopic, this.newHandler);
			
			
			
		},
		
		onCloseIncident: function(e, incidentId) {
			this.mediator.unsubscribe(this.newTopic);
			
			Core.EventManager.removeListener(this.newTopic, this.newHandler);
			Core.EventManager.removeListener("LoadReports201", this.onLoadReports);
			Core.EventManager.removeListener("PrintReport201", this.onReportReady);
			Core.EventManager.removeListener("CancelReport201", this.onCancel);
			
			var oppReportContainer = this.view.lookupReference('oppReport201');
			if(oppReportContainer)oppReportContainer.removeAll();
			
			var oppList = this.lookupReference('oppList201' );
			if (oppList)oppList.clearValue();
			if (oppList)oppList.getStore().removeAll()
			this.getView().disable();
			
			this.incidentId = null;
			this.incidentName = null;
			this.hasFinalForm = false;
		},
		
	onAdd: function(e) {
			var oppReportContainer = this.view.lookupReference('oppReport201');
			var username  = UserProfile.getFirstName() + " " + UserProfile.getLastName();
	           
			 var i201Form = new I201FormView({
            	incidentId: this.incidentId,
				incidentName: this.incidentName,
				formTypeId: this.formTypeId,
				
			});
            oppReportContainer.removeAll();
            oppReportContainer.add(i201Form);
        	var initialData= {incidentId: this.incidentId, 
        			incidentName: this.incidentName, 
        			reportType: 'NEW',
        			date: new Date(),
        			starttime: new Date(),
        			formTypeId:this.formTypeId,
        			reportBy:  username,
    				seqnum: 1,
    				
    				
    				
        	}
			i201Form.viewModel.set(initialData);	
        	this.disableButton('create201');
			
		},
		
       
		
			
		
		displayCurrentRecord: function(displayOnly, status){

			var combo  = this.lookupReference('oppList201');
			var currentFormId=combo.getValue();
			
			 var record = combo.findRecordByValue(currentFormId); 
			
			
			if(record){
				this.disableButton('create201');
				
				var oppReportContainer = this.view.lookupReference('oppReport201');
				//Clear away any previous report
				oppReportContainer.removeAll();
				//Add new report
				var i201Form = new I201FormView({
					incidentId: this.incidentId,
					incidentName: this.incidentName,
					formTypeId: this.formTypeId
				
					
					
				});
				 ;
		        oppReportContainer.add(i201Form);
		           
		         //Pull data from the report, and add in the incidentName and Id
				var formData = (JSON.parse(record.data.message));
			    formData.report.incidentId = record.data.incidentId;
			    formData.report.incidentName = record.data.incidentName;
			    formData.report.formTypeId = this.formTypeId;
				   
			    //Convert date and starttime back to date objects so they will display properly on the forms
				formData.report.date = new Date();
				formData.report.starttime = new Date();
				formData.report.reportBy = UserProfile.getFirstName() + " " + UserProfile.getLastName();
				
				
				
				if (displayOnly){
					if (this.hasFinalForm){

						this.disableButton('update201');
						this.disableButton('final201');
					}
					else {
						this.enableButton('update201');
						this.enableButton('final201');
					}
					//Add the dynamic fields in based on the report data
					if (formData.report.icStaffCount >5) i201Form.controller.addFieldContainer('201','icStaff', 6, (formData.report.icStaffCount - 5));
					if (formData.report.agencyRepsCount > 3) i201Form.controller.addFieldContainer('201','agencyRep', 4, (formData.report.agencyRepsCount - 3));
					i201Form.controller.addFieldContainer('201','intel', 2, (formData.report.intelCount - 1));
					i201Form.controller.addFieldContainer('201','logistics', 2, (formData.report.logisticsCount - 1));
					i201Form.controller.addFieldContainer('201','logisticsSpt', 2, (formData.report.logisticsSptCount - 1));
					i201Form.controller.addFieldContainer('201','logisticsSrv', 2, (formData.report.logisticsSrvCount - 1));
					if (formData.report.opsCount >5)i201Form.controller.addFieldContainer('201','ops', 6, (formData.report.opsCount - 5));
					((formData.report.opsBranchCount > 0)?
							i201Form.controller.addFieldContainer('201','opsBranch', 2, +formData.report.opsBranchCount-1) :
							i201Form.lookupReference('opsBranch201').hide());
					((formData.report.opsBBranchCount > 0)?
							i201Form.controller.addFieldContainer('201','opsBBranch', 2, +formData.report.opsBBranchCount-1) :
							i201Form.lookupReference('opsBBranch201').hide());
				    ((formData.report.opsCBranchCount > 0)?
							i201Form.controller.addFieldContainer('201','opsCBranch', 2, +formData.report.opsCBranchCount-1) :
							i201Form.lookupReference('opsCBranch201').hide());i201Form.controller.addFieldContainer('201','opsAirBranch', 2, (formData.report.opsAirBranchCount - 1));
					i201Form.controller.addFieldContainer('201','finance', 2, (formData.report.financeCount - 1));
					i201Form.controller.addFieldContainer('201','resource', 2, (formData.report.resourceCount - 1));
					i201Form.controller.setFormReadOnly();
					
					
				}
				else {
					if(status == 'UPDATE' || status == 'FINAL' )
					//this is an updated or finalized form, change report name to the current status
					 formData.report.reportType =status;
					formData.report.reportBy  = UserProfile.getFirstName() + " " + UserProfile.getLastName();
					//increase the sequence number and set seqtime
					++formData.report.seqnum 
					if(status == 'FINAL' )this.hasFinalForm = true;
					this.disableButton('view201');
					this.disableButton('final201');
					this.disableButton('print201');
					
					
					//Add the dynamic fields in based on the report data
					if (formData.report.icStaffCount >4) i201Form.controller.addFieldContainer('201','icStaff', 6, (formData.report.icStaffCount - 4));
					if (formData.report.agencyRepsCount > 2)i201Form.controller.addFieldContainer('201','agencyRep', 4, (formData.report.agencyRepsCount -2));
					i201Form.controller.addFieldContainer('201','intel', 2, +formData.report.intelCount);
					i201Form.controller.addFieldContainer('201','logistics', 2, +formData.report.logisticsCount);
					i201Form.controller.addFieldContainer('201','logisticsSpt', 2, +formData.report.logisticsSptCount);
					i201Form.controller.addFieldContainer('201','logisticsSrv', 2, +formData.report.logisticsSrvCount);
					if (formData.report.opsCount >4)i201Form.controller.addFieldContainer('201','ops', 6, + (formData.report.opsCount-4));
					i201Form.controller.addFieldContainer('201','opsBranch', 2, +formData.report.opsBranchCount);
					i201Form.controller.addFieldContainer('201','opsBBranch', 2, +formData.report.opsBBranchCount);
					i201Form.controller.addFieldContainer('201','opsCBranch', 2, +formData.report.opsCBranchCount);
					i201Form.controller.addFieldContainer('201','opsAirBranch', 2, +formData.report.opsAirBranchCount);
					i201Form.controller.addFieldContainer('201','finance', 2, +formData.report.financeCount);
					i201Form.controller.addFieldContainer('201','resource', 2, +formData.report.resourceCount);
					
				}
				if (i201Form.viewModel) i201Form.viewModel.set(formData.report);
				
			}
			
			
		},
		
		onLoadReports: function(e, response) {
			var newReports = [];
			var combo = this.lookupReference('oppList201');
			if(response) {
				if(response.reports && 
					response.reports.length > 0){
					//Add each report
					this.disableButton('create201');
					this.enableButton('print201');
					this.enableButton('view201');
					
					
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
						this.disableButton('update201');
						this.disableButton('final201');
					}
					else {
						 this.enableButton('update201');
						 this.enableButton('final201');
					}
					
					
				}
				else {
					 this.enableButton('create201');
					 this.disableButton('view201');
					this.disableButton('update201');
					this.disableButton('final201');
					this.disableButton('print201');
				}
				
			}
			
		},
		
		onReportAdded: function() {	
			this.disableButton('create201');
			 this.enableButton('view201');
			this.enableButton('update201');
			this.enableButton('final201');
			this.enableButton('print201');
			
			this.mediator.sendRequestMessage(Core.Config.getProperty(UserProfile.REST_ENDPOINT) +
					"/reports/" + this.incidentId + '/201', "LoadReports201");
			
		},
		onPrint: function(){
			 //Need to actually get the form from the dropdown
			this.displayCurrentRecord(true, 'select');	
			 var printMsg = null;
			var i201ReportForm = this.view.lookupReference('i201ReportForm');
			var data = i201ReportForm.viewModel.data;
			i201ReportForm.controller.buildReport(data, false, 'print');
	}
	
	});
});
