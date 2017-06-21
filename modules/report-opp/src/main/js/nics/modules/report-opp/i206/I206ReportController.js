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
			'../AbstractReportController','./I206ReportView', './I206FormView','./I206InstructionsView'
			],

function(Core, UserProfile, AbstractReportController, I206ReportView, I206FormView,I206InstructionsView) {
	
	Ext.define('modules.report-opp.I206ReportController', {
		extend : 'modules.report-opp.AbstractReportController',
		alias : 'controller.i206reportcontroller',
		orgCapName: '206',
		orgIds: [],
		
		init : function(args) {
			this.mediator = Core.Mediator.getInstance();
			this.enableButton('create206');
			this.disableButton('view206');
			this.disableButton('update206');
			this.disableButton('final206');
			this.disableButton('print206');
			 
			 var oppInstructions = this.view.lookupReference('oppInstructions206');
			
			//Add new report
			var oppistr = new I206InstructionsView();
			oppInstructions.add(oppistr);		
			 
			var topic = "nics.report.reportType";
			Core.EventManager.createCallbackHandler(
					topic, this, function(evt, response){
						Ext.Array.each(response.types, function(type){
							if(type.formTypeName === '206'){
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

			this.title="206";
			
			//Bind UI Elements
			Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
			Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
			Core.EventManager.addListener("LoadReports206", this.onLoadReports.bind(this));
			Core.EventManager.addListener("PrintReport206", this.onReportReady.bind(this));
			Core.EventManager.addListener("CancelReport206", this.onCancel.bind(this));
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
					"/reports/" + this.incidentId + '/206', "LoadReports206");
			//Subscribe to New 206 report message on the bus
			this.newTopic = Ext.String.format(
					"iweb.NICS.incident.{0}.report.{1}.new", this.incidentId,
					'206');
			this.mediator.subscribe(this.newTopic);
			
			this.newHandler = this.onReportAdded.bind(this)
			Core.EventManager.addListener(this.newTopic, this.newHandler);
			
			
			
		},
		
		onCloseIncident: function(e, incidentId) {
			this.mediator.unsubscribe(this.newTopic);
			
			Core.EventManager.removeListener(this.newTopic, this.newHandler);
			Core.EventManager.removeListener("LoadReports206", this.onLoadReports);
			Core.EventManager.removeListener("PrintReport206", this.onReportReady);
			Core.EventManager.removeListener("CancelReport206", this.onCancel);
			
			var oppReportContainer = this.view.lookupReference('oppReport206');
			if(oppReportContainer)oppReportContainer.removeAll();
			
			var oppList = this.lookupReference('oppList206' );
			if (oppList)oppList.clearValue();
			if (oppList)oppList.getStore().removeAll()
			this.getView().disable();
			
			this.incidentId = null;
			this.incidentName = null;
			this.hasFinalForm = false;
		},
		
	onAdd: function(e) {
			var oppReportContainer = this.view.lookupReference('oppReport206');
			var username  = UserProfile.getFirstName() + " " + UserProfile.getLastName();
	           
			 var i206Form = new I206FormView({
            	incidentId: this.incidentId,
				incidentName: this.incidentName,
				formTypeId: this.formTypeId,
				
			});
            oppReportContainer.removeAll();
            oppReportContainer.add(i206Form);
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
			i206Form.viewModel.set(initialData);	
        	this.disableButton('create206');
			
		},
		
       
		
			
		
		displayCurrentRecord: function(displayOnly, status){

			var combo  = this.lookupReference('oppList206');
			var currentFormId=combo.getValue();
			
			 var record = combo.findRecordByValue(currentFormId); 
			
			
			if(record){
				this.disableButton('create206');
				
				var oppReportContainer = this.view.lookupReference('oppReport206');
				//Clear away any previous report
				oppReportContainer.removeAll();
				//Add new report
				var i206Form = new I206FormView({
					incidentId: this.incidentId,
					incidentName: this.incidentName,
					formTypeId: this.formTypeId
				
					
					
				});
				 ;
		        oppReportContainer.add(i206Form);
		           
		         //Pull data from the report, and add in the incidentName and Id
				var formData = (JSON.parse(record.data.message));
			    formData.report.incidentId = record.data.incidentId;
			    formData.report.incidentName = record.data.incidentName;
			    formData.report.formTypeId = this.formTypeId;
				   
			    //Convert date and starttime back to date objects so they will display properly on the forms
			    formData.report.date = new Date(formData.report.date);
				formData.report.starttime = new Date(formData.report.starttime);
				formData.report.enddate = new Date(formData.report.enddate);
				formData.report.endtime = new Date(formData.report.endtime);
				formData.report.prepdate = new Date(formData.report.prepdate);
				formData.report.preptime = new Date(formData.report.preptime);
				

				if (formData.report.soReviewdate) formData.report.soReviewdate = new Date(formData.report.soReviewdate);
				if (formData.report.soReviewtime)formData.report.soReviewtime = new Date(formData.report.soReviewtime);
				
				
				
				
				if (displayOnly){
					if (this.hasFinalForm){

						this.disableButton('update206');
						this.disableButton('final206');
					}
					else {
						this.enableButton('update206');
						this.enableButton('final206');
					}
					//Add the dynamic fields in based on the report data

					if (formData.report.medicalCount >4) i206Form.controller.addFieldContainer('206','medical', 5, (formData.report.medicalCount - 4));
					if (formData.report.transportCount >4) i206Form.controller.addFieldContainer('206','transport', 5, (formData.report.transportCount - 4));
					if (formData.report.hospitalCount >4) i206Form.controller.addFieldContainer('206','hospital', 5, (formData.report.hospitalCount - 4));

					i206Form.controller.setFormReadOnly();
					
					
				}
				else {
					if(status == 'UPDATE' || status == 'FINAL' )
					//this is an updated or finalized form, change report name to the current status
						formData.report.reportType =status;
					//increase the sequence number and set seqtime
					++formData.report.seqnum 
					if(status == 'FINAL' )this.hasFinalForm = true;
					this.disableButton('view206');
					this.disableButton('final206');
					this.disableButton('print206');
					
					
					//Add the dynamic fields in based on the report data

					if (formData.report.medicalCount >3) i206Form.controller.addFieldContainer('206','medical', 5, (formData.report.medicalCount - 3));
					if (formData.report.transportCount >3) i206Form.controller.addFieldContainer('206','transport', 5, (formData.report.transportCount - 3));
					if (formData.report.hospitalCount >3) i206Form.controller.addFieldContainer('206','hospital', 5, (formData.report.hospitalCount - 3));

					
					
				}
				if (i206Form.viewModel) i206Form.viewModel.set(formData.report);
				
			}
			
			
		},
		
		onLoadReports: function(e, response) {
			var newReports = [];
			var combo = this.lookupReference('oppList206');
			if(response) {
				if(response.reports && 
					response.reports.length > 0){
					//Add each report
					this.disableButton('create206');
					this.enableButton('print206');
					this.enableButton('view206');
					
					
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
						this.disableButton('update206');
						this.disableButton('final206');
					}
					else {
						 this.enableButton('update206');
						 this.enableButton('final206');
					}
					

				}
				else {
					 this.enableButton('create206');
					 this.disableButton('view206');
					this.disableButton('update206');
					this.disableButton('final206');
					this.disableButton('print206');
				}
				
			}
			
		},
		buildReportData: function(report){
			var message = JSON.parse(report.message);
			var reportTitle  = message.datecreated;
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
			this.disableButton('create206');
			 this.enableButton('view206');
			this.enableButton('update206');
			this.enableButton('final206');
			this.enableButton('print206');
			
			this.mediator.sendRequestMessage(Core.Config.getProperty(UserProfile.REST_ENDPOINT) +
					"/reports/" + this.incidentId + '/206', "LoadReports206");
			
		},


		onPrint: function(){
			 //Need to actually get the form from the dropdown
			this.displayCurrentRecord(true, 'select');	
			 var printMsg = null;
			var i206ReportForm = this.view.lookupReference('i206ReportForm');
			var data = i206ReportForm.viewModel.data;
			i206ReportForm.controller.buildReport(data, false, 'print');
	}
	
	});
});
