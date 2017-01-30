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
define([  'iweb/CoreModule', 'nics/modules/UserProfileModule', "nics/modules/report/common/OrgChart",
			'../AbstractReportController','./I207ReportView', './I207FormView','./I207InstructionsView'
			],

function(Core, UserProfile, OrgChart,AbstractReportController, I207ReportView, I207FormView,I207InstructionsView) {
	
	Ext.define('modules.report-opp.I207ReportController', {
		extend : 'modules.report-opp.AbstractReportController',
		alias : 'controller.i207reportcontroller',
		orgCapName: '207',
		orgIds: [],
		
		init : function(args) {
			this.mediator = Core.Mediator.getInstance();
			this.endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT)
			//this.enableButton('create207');
			this.disableButton('view207');
			this.disableButton('update207');
			
			 
			 var oppInstructions = this.view.lookupReference('oppInstructions207');
			
			//Add new report
			var oppistr = new I207InstructionsView();
			oppInstructions.add(oppistr);		
			 //Grab the 203's.  We never actaully create a 207, just display 203s and 201s
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
			//Bind UI Elements
			Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
			Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
			Core.EventManager.addListener("LoadReports207", this.onLoadReports.bind(this));
			Core.EventManager.addListener("LoadReports203", this.onLoadReports.bind(this));
			Core.EventManager.addListener("Load207201Reports", this.onLoad201Reports.bind(this));
			Core.EventManager.addListener("CancelReport207", this.onCancel.bind(this));
			Core.EventManager.fireEvent("nics.report.add", {title: "207", component: this.getView()});
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
					"/reports/" + this.incidentId + '/203', "LoadReports207");
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
			Core.EventManager.removeListener("LoadReports207", this.onLoadReports);
			Core.EventManager.removeListener("LoadReports203", this.onLoadReports);
			Core.EventManager.removeListener("PrintReport207", this.onReportReady);
			Core.EventManager.removeListener("CancelReport207", this.onCancel);
			Core.EventManager.addListener("Load207201Reports", this.load201reports);
			Core.EventManager.addListener("Import207201", this.onImportReport.bind(this));
			
			
			
			var oppReportContainer = this.view.lookupReference('oppReport207');
			if(oppReportContainer)oppReportContainer.removeAll();
			
			var oppList = this.lookupReference('oppList207' );
			if (oppList)oppList.clearValue();
			if (oppList)oppList.getStore().removeAll()
			this.getView().disable();
			
			this.incidentId = null;
			this.incidentName = null;
			this.hasFinalForm = false;
		},
		
		displayCurrentRecord: function(horizonal, status){
            //Passing true and false into the 207 toggles the orientation of the org chart instead of setting the display property
			var combo  = this.lookupReference('oppList207');
			var currentFormId=combo.getValue();
			 var record = combo.findRecordByValue(currentFormId); 
			
			
			if(record){
				this.disableButton('create207');
				
				var oppReportContainer = this.view.lookupReference('oppReport207');
				//Clear away any previous report
				oppReportContainer.removeAll();
				//Add new report
				var i207Form = new I207FormView({
					incidentId: this.incidentId,
					incidentName: this.incidentName,
					formTypeId: this.formTypeId
				
					
					
				});
				 ;
		        oppReportContainer.add(i207Form);
		           
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
				
				formData.report.reportBy = UserProfile.getFirstName() + " " + UserProfile.getLastName();
					//Add the dynamic fields in based on the report data
				var orgChartData = this.orgChartTransform(formData);
				
				if (i207Form.lookupReference('orgchart'))i207Form.lookupReference('orgchart').setData(orgChartData, horizonal);
		    	
				i207Form.controller.setFormReadOnly();
				if (i207Form.viewModel) i207Form.viewModel.set(formData.report);
				
			}
			
			
		},
		

		onLoadReports: function(e, response) {
			var newReports = [];
			var combo = this.lookupReference('oppList207');
			if(response) {
				if(response.reports && 
					response.reports.length > 0){
					//Add each report
					this.enableButton('view207');
					this.enableButton('update207');
					
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
					
					
				
					
					
				}
				else {
					  this.disableButton('view207');
					  this.disableButton('update207');
					
					
				}
				 Core.EventManager.fireEvent("Load207201Reports");
				
			}
			
		},
		onLoad201Reports: function(e) {

			var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);	
			this.mediator.sendRequestMessage(endpoint +
					"/reports/" + this.incidentId + '/201', "Import207201");

			},
		onImportReport: function(e, response) {
            //add the 201's to the list of 203's
			var new201Reports = [];
			var combo = this.lookupReference('oppList207');
			if(response) {
				if(response.reports && 
					response.reports.length > 0){
					//Add each report
					for(var i=0; i<response.reports.length; i++){
						var report = response.reports[i];
					
						var newReport  = this.buildReportData(report);
					
							new201Reports.push(newReport);
							//combo.getStore().removeAll();
							combo.getStore().loadRawData(new201Reports, true);
							var latestForm = combo.getStore().getAt(0).data.formId;
							combo.setValue(latestForm);
						
							this.enableButton('update207');
							this.enableButton('view207');
							
						}
						
					}
					

				}
			else {
				//There are no 201 or 203 reports, so disable buttons
				this.disableButton('update207');
				this.disableButton('view207');
			}
				
			
			
			
		},
				
		orgChartTransform: function(data){
			//Convert 201/203 data into d3  treelayout format
			
			//var i203Data = (JSON.parse(data.message));
			var chartDataArray = this.buildChartArray(data.report);
			var chartDataObject = this.buildChartObject(chartDataArray);
			return chartDataObject;
    		
		},
    	buildChartArray: function(data){
    		var dataArray = [];
    		for (item in data){
    		var light  = "#f5f5f5";
			var dark = "#b3b3b3";
			
    		//add correct role and parent for each item
			//if ( /contactRep[0-9]+/.test(item) && data[item] != "")++agencyRepsCount;
    			if ( /contactRep[0-9]+/.test(item) && data[item] != ""){
    				light  = "#f5f5f5";
    				dark = "#b3b3b3";
					oldIndex = item.match(/[0-9]+$/);
					if (oldIndex == '1') {
						//this is the parent
						currentRole = "agencyChief";
						currentParent = "incidentCommander";
					}
					else{
						currentRole = "agencyStaff";
						currentParent = "agencyChief";
					}
					currentAgency="agencyRep" +oldIndex;
					dataArray.push( [currentRole,  (typeof(data[currentAgency]) != "undefined" ? data[currentAgency]:" "), " ", data[item], currentParent, light, dark]);
					
					
				}
				if ( /icContact[0-9]+/.test(item) && data[item] != ""){
					light  = "#f5f5f5";
    				dark = "#b3b3b3";
					oldIndex = item.match(/[0-9]+$/);
					if (oldIndex == '1') {
						//this is the parent
						currentRole = "incidentCommander";
						currentParent = "null";
					}
					else{
						currentRole = "icStaff";
						currentParent = "incidentCommander";
					}
					
					
					currentAgency="icAgency" + oldIndex;
					currentPosition="icPosition" + oldIndex;
					dataArray.push([currentRole, (typeof(data[currentAgency]) != "undefined" ? data[currentAgency]:" "),(typeof(data[currentPosition]) != "undefined" ? data[currentPosition]:" "), data[item], currentParent, light, dark]);
					
				}
				if ( /intelContact[0-9]+/.test(item) && data[item] != ""){
					light  = "#b0c4de";
    				dark = "#4682b4";
					oldIndex = item.match(/[0-9]+$/);
					if (oldIndex == '1') {
						//this is the parent
						currentRole = "intelChief";
						currentParent = "sectionChiefs";
					}
					else{
						currentRole = "intelStaff";
						currentParent = "intelChief";
					}
					currentAgency="intelAgency" + oldIndex;
					currentPosition="intelPosition" + oldIndex;
					dataArray.push([currentRole, (typeof(data[currentAgency]) != "undefined" ? data[currentAgency]:" "), (typeof(data[currentPosition]) != "undefined" ? data[currentPosition]:" "), data[item], currentParent, light, dark]);
				}
					
				if ( /logisticsContact[0-9]+/.test(item) && data[item] != ""){
					light  = "#fafad2";
    				dark = "#daa520";
					oldIndex = item.match(/[0-9]+$/);
					if (oldIndex == '1') {
						//this is the parent
						currentRole = "logsChief";
						currentParent = "sectionChiefs";
					}
					else{
						currentRole = "logsStaff";
						currentParent = "logsChief";
					}
					currentAgency="logisticsAgency" + oldIndex;
					currentPosition="logisticsPosition" + oldIndex;
					dataArray.push([currentRole, (typeof(data[currentAgency]) != "undefined" ? data[currentAgency]:" "), (typeof(data[currentPosition]) != "undefined" ? data[currentPosition]:" "), data[item], currentParent, light, dark]);
				}
				if ( /logisticsSptContact[0-9]+/.test(item) && data[item] != ""){
					light  = "#fafad2";
    				dark = "#daa520";
					oldIndex = item.match(/[0-9]+$/);
					if (oldIndex == '1') {
						//this is the parent
						currentRole = "logsSptChief";
						currentParent = "logsChiefs";
					}
					else{
						currentRole = "logsSptStaff";
						currentParent = "logsSptChief";
					}
					currentAgency="logisticsSptAgency" + oldIndex;
					currentPosition="logisticsSptPosition" + oldIndex;
					dataArray.push([currentRole, (typeof(data[currentAgency]) != "undefined" ? data[currentAgency]:" "), (typeof(data[currentPosition]) != "undefined" ? data[currentPosition]:" "), data[item], currentParent, light, dark]);
				}
				if ( /logisticsSrvContact[0-9]+/.test(item) && data[item] != ""){
					light  = "#fafad2";
    				dark = "#daa520";
					oldIndex = item.match(/[0-9]+$/);
					if (oldIndex == '1') {
						//this is the parent
						currentRole = "logsSrvChief";
						currentParent = "logsChiefs";
					}
					else{
						currentRole = "logsSrvStaff";
						currentParent = "logsSrvChief";
					}
					currentAgency="logisticsSrvAgency" + oldIndex;
					currentPosition="logisticsSrvPosition" + oldIndex;
					dataArray.push([currentRole, (typeof(data[currentAgency]) != "undefined" ? data[currentAgency]:" "), (typeof(data[currentPosition]) != "undefined" ? data[currentPosition]:" "), data[item], currentParent, light, dark]);
				}
				if ( /opsContact[0-9]+/.test(item) && data[item] != ""){
					light  = "#ffe6ea";
    				dark = "#ff8095";
					oldIndex = item.match(/[0-9]+$/);
					if (oldIndex == '1') {
						//this is the parent
						currentRole = "opsChief";
						currentParent = "sectionChiefs";
					}
					else{
						currentRole = "opsStaff";
						currentParent = "opsChief";
					}
					currentAgency="opsAgency" + oldIndex;
					currentPosition="opsPosition" + oldIndex;
					dataArray.push([currentRole, (typeof(data[currentAgency]) != "undefined" ? data[currentAgency]:" "), (typeof(data[currentPosition]) != "undefined" ? data[currentPosition]:" "), data[item], currentParent, light, dark]);
				}
				if ( /opsBranchContact[0-9]+/.test(item) && data[item] != ""){
					light  = "#ffe6ea";
    				dark = "#ff8095";
					oldIndex = item.match(/[0-9]+$/);
					if (oldIndex == '1') {
						//this is the parent
						currentRole = "opsBranchChief";
						currentParent = "opsBranchChiefs";
					}
					else{
						currentRole = "opsBranchStaff";
						currentParent = "opsBranchChief";
					}
					currentAgency="opsBranchAgency" + oldIndex;
					currentPosition="opsBranchPosition" + oldIndex;
					dataArray.push([currentRole,(typeof(data[currentAgency]) != "undefined" ? data[currentAgency]:" "), (typeof(data[currentPosition]) != "undefined" ? data[currentPosition]:" "), data[item], currentParent, light, dark]);
				}
				if ( /opsBBranchContact[0-9]+/.test(item) && data[item] != ""){
					light  = "#ffe6ea";
    				dark = "#ff8095";
					oldIndex = item.match(/[0-9]+$/);
					currentAgency="opsBBranchAgency" + oldIndex;
					if (oldIndex == '1') {
						//this is the parent
						currentRole = "opsBChief";
						currentParent = "opsBranchChiefs";
					}
					else{
						currentRole = "opsBStaff";
						currentParent = "opsBChief";
					}
					currentPosition="opsBBranchPosition" + oldIndex;
					dataArray.push([currentRole, (typeof(data[currentAgency]) != "undefined" ? data[currentAgency]:" "), (typeof(data[currentPosition]) != "undefined" ? data[currentPosition]:" "), data[item], currentParent, light, dark]);
				}
				if ( /opsCBranchContact[0-9]+/.test(item) && data[item] != ""){
					light  = "#ffe6ea";
    				dark = "#ff8095";
					oldIndex = item.match(/[0-9]+$/);
					if (oldIndex == '1') {
						//this is the parent
						currentRole = "opsCChief";
						currentParent = "opsBranchChiefs";
					}
					else{
						currentRole = "opsCStaff";
						currentParent = "opsCChief";
					}
					currentAgency="opsCBranchAgency" + oldIndex;
					currentPosition="opsCBranchPosition" + oldIndex;
					dataArray.push([currentRole, (typeof(data[currentAgency]) != "undefined" ? data[currentAgency]:" "), (typeof(data[currentPosition]) != "undefined" ? data[currentPosition]:" "), data[item], currentParent, light, dark]);
				}
				if ( /opsAirBranchContact[0-9]+/.test(item) && data[item] != ""){
					light  = "#ffe6ea";
    				dark = "#ff8095";
					oldIndex = item.match(/[0-9]+$/);
					if (oldIndex == '1') {
						//this is the parent
						currentRole = "opsAirChief";
						currentParent = "opsBranchChiefs";
					}
					else{
						currentRole = "opsAirStaff";
						currentParent = "opsAirChief";
					}
					currentAgency="opsAirBranchAgency" + oldIndex;
					currentPosition="opsAirBranchPosition" + oldIndex;
					dataArray.push([currentRole, (typeof(data[currentAgency]) != "undefined" ? data[currentAgency]:" "), (typeof(data[currentPosition]) != "undefined" ? data[currentPosition]:" "), data[item], currentParent, light, dark]);
				}
				if ( /financeContact[0-9]+/.test(item) && data[item] != ""){
					light  = "#90ee90";
    				dark = "#008000";
					oldIndex = item.match(/[0-9]+$/);
					if (oldIndex == '1') {
						//this is the parent
						currentRole = "finChief";
						currentParent = "sectionChiefs";
					}
					else{
						currentRole = "finStaff";
						currentParent = "finChief";
					}
					currentAgency="financeAgency" + oldIndex;
					currentPosition="financePosition" + oldIndex;
					dataArray.push([currentRole, (typeof(data[currentAgency]) != "undefined" ? data[currentAgency]:" "), (typeof(data[currentPosition]) != "undefined" ? data[currentPosition]:" "), data[item], currentParent, light, dark]);
					
					}
				
			
    		}
    	
		    return dataArray;
		},
    	buildChartObject: function(data){
			//Create the proper format for the d3 org chart:
			//{role: "incidentCommander", name: "Person 1",position:"Incident Commander",agency:"Agency",parent: "null"},
            //return({"role": role, "name": name});
    		var chartObject = [];
    		for (i = 0;i< data.length; i++){
    			rowData  = {role:data[i][0], name:data[i][3], position:data[i][2], agency:data[i][1], parent:data[i][4], light:data[i][5], dark:data[i][6]};
    			chartObject.push(rowData);
    		}
    		//Add in the dummy section chief sectionChiefs
    		chartObject.push({role:"sectionChiefs", name:"Sections", position:" ", agency:" ", parent:"incidentCommander", light:"#f5f5f5", dark:"#b3b3b3"});
    		chartObject.push({role:"logsChiefs", name:"Logistics", position:" ", agency:" ", parent:"logsChief", light:"#fafad2", dark:"#daa520"});
    		chartObject.push({role:"opsBranchChiefs", name:"Operations", position:" ", agency:" ", parent:"opsChief", light:"#ffe6ea", dark:"#ff8095"});
			return chartObject;
		},
		
		
		onReportAdded: function() {	
			this.disableButton('create207');
			 this.enableButton('view207');
			this.enableButton('update207');
			this.enableButton('final207');
			this.enableButton('print207');
			
			this.mediator.sendRequestMessage(Core.Config.getProperty(UserProfile.REST_ENDPOINT) +
					"/reports/" + this.incidentId + '/207', "LoadReports207");
			
		},
		
		
		
		onPrint: function(){
			 //Need to actually get the form from the dropdown
			this.displayCurrentRecord(true, 'select');	
			 var printMsg = null;
			var i207ReportForm = this.view.lookupReference('i207ReportForm');
			var data = i207ReportForm.viewModel.data;
			i207ReportForm.controller.buildReport(data, false, 'print');
	}
	
	});
});
