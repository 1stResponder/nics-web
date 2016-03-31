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
define(['iweb/CoreModule', "nics/modules/UserProfileModule", './I215ReportView', './I215FormView','./I215FormViewModel'],

	function(Core, UserProfile, I215ReportView, I215FormView , I215FormViewModel ){
	
		
	
		Ext.define('modules.report-i215.I215FormController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.i215formcontroller',
			
			init : function(args) {
			
				this.mediator = Core.Mediator.getInstance();
				
				
			},
			 clearForm: function () {
			    
				
				 var username  = UserProfile.getFirstName() + " " + UserProfile.getLastName();	
				 this.view.getForm().getFields().each (function (field) {
						 field.setValue("");
			    	});
			    },
			   
			    setFormReadOnly: function () {
			    	this.view.getForm().getFields().each (function (field) {
			    		field.setReadOnly(true);
			    	});
			    	this.view.lookupReference('submitButton').hide();
			    	this.view.lookupReference('cancelButton').hide();
			    	this.view.lookupReference('resetButton').hide();
			    },
			    enableForm: function () {
			    	this.view.getForm().getFields().each (function (field) {
			    		field.setReadOnly(false);
			    	});
			    	this.view.lookupReference('submitButton').show();
			    	this.view.lookupReference('cancelButton').show();
			    	this.view.lookupReference('resetButton').show();
			    },
			    

	    	
	    	submitForm: function(){
	    		var form = {};
	    		var message = {};
	    		var report= {}
	    		
	    		
	    		var time = Core.Util.formatDateToString(new Date());
	    		 
	    		message.datecreated = time;
	  	    		var formView = this.view.viewModel;
	    		 		
	    		
	    		if (formView.get('report') === null){
	    			//create the report from the data
	    		   for (item in formView.data){
	    			   //Don't capture the buttons, or the incident name and id in the report
	    			   var buttonRE = /button$/i;
	    			  // var isButton = buttonRE.test(item);
	    			   if (item != 'incidentId' && item != 'incidentName' && !(buttonRE.test(item)) )
	    					report[item] = formView.data[item];
	    		  }
	    		   message.report = report;
	    		   
	    		}else {
	    			//report has already been created
	    			message.report = formView.get('report');
	    		
	    		}
	    		
	    	
	    		//Populate form properties
	    		form.incidentid = formView.data.incidentId;
	    		form.incidentname = formView.data.incidentName;
	    		form.formtypeid = formView.data.formTypeId; //this is always a 215 
	    		form.usersessionid = UserProfile.getUserSessionId();
	    		form.distributed = false;
	    		form.message = JSON.stringify(message);
	    		
				var url = Ext.String.format('{0}/reports/{1}/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						formView.data.incidentId, '215');
	    		
				
				var topic = Ext.String.format("iweb.NICS.incident.{0}.report.{1}.#", formView.data.incidentId, '215');
				
				this.mediator.sendPostMessage(url, topic, form);
				this.setFormReadOnly();
				this.newTopic = Ext.String.format(
						"iweb.NICS.incident.{0}.report.{1}.new", form.incidentid,
						'215');
				Core.EventManager.fireEvent(this.newTopic);
				
	    		
			
				
	    	},
	    	
	    	
	    	cancelForm: function(){
	    		this.setFormReadOnly();
	    		
	    	},
		    buildReport: function(data, simple, reportType){			    	
				
		    	var printMessage=null;
				try {
					printMessage = "<html><head>" +  " <link rel=\"stylesheet\" type=\"text/css\" href=\"styles/report/report.css\" /></head>" +
							"<body class=\"report\"><strong>NICS ICS 215 Worksheet </strong>";
							printMessage += "<br/><br/><strong>" + data.preptime + "-" + data.role ;
					printMessage += "</strong><br/><strong>Report Type:</strong> " + data.reportType;
						printMessage += "<br/><br/><strong>Incident Name:</strong> " + data.incidentName;
					printMessage += "<br/><strong>Time and Date Prepared:</strong> " + Core.Util.formatDateToString(data.preptime);
					printMessage += "<h3> For Operational Period</h3>";
					printMessage += "<strong>Date:</strong> " + this.formatDate(data.startdate) + "<br/>";
					printMessage += "<strong>Time:</strong> "  + this.formatTime(data.starttime) + "<br/>";
					printMessage += "<strong>Recommended Shift Length:</strong> ";
					if (this.isSet(data.shiftLength12)) printMessage += "12 hrs ";
					if (this.isSet(data.shiftLength16)) printMessage += "16 hrs ";
					if (this.isSet(data.shiftLength24)) printMessage += "24 hrs ";
					if (this.isSet(data.shiftLengthMixed)) printMessage += "Mixed ";
					
					printMessage += "<br/><strong>Submitted by IC/Operations/Branch/Division/Group/ or Function:</strong> " + data.role + "<br/>";
					printMessage += "<strong>Requested Arrival Time:</strong> " + data.requestArrival + "<br/>";
					printMessage += "<strong>Reporting Location: </strong>" + data.reportingLocation + "<br/>";
					printMessage += "<strong>Work Assignments:</strong> " + data.workAssignments + "<br/>";
					if(typeof(data.specialInstructions) != "undefined" && data.specialInstructions != "")printMessage += "<strong>Special Instructions: </strong> " + data.specialInstructions + "<br/>";
				
					printMessage += "<h3> Kinds and Types of Resources</h3>";
					printMessage += "<table><tr><th colspan='2'><strong> Overhead/Personnel</th></tr>";
				
					if (this.isSet(data.opbd)) printMessage += "<tr><td>Operations Branch Director (OPBD)</td><td>" + data.opbd + "</td></tr>";
					if (this.isSet(data.divs)) printMessage += "<tr><td>Divison or Group Supervisor (DIVS)</td><td>" + data.divs + "</td></tr>";
					if (this.isSet(data.tfld)) printMessage += "<tr><td>Taskforce Leader (TFLD)</td><td>" + data.tfld + "</td></tr>";
					if (this.isSet(data.stam)) printMessage += "<tr><td>Staging Area Manager (STAM)</td><td>" + data.stam + "</td></tr>";
					if (this.isSet(data.fobs)) printMessage += "<tr><td>Field Observer (FOBS)</td><td>" + data.fobs + "</td></tr>";
					if (this.isSet(data.dozb)) printMessage += "<tr><td>Dozer Supervisor (DOZB)</td><td>" + data.dozb + "</td></tr>";
					if (this.isSet(data.hqts)) printMessage += "<tr><td>Hired Equipment Supervisor (HQTS)&nbsp;&nbsp;</td><td>" + data.hqts + "</td></tr>";
					
					printMessage += "<tr><td><strong>Safety Officer</strong></td><td> </td></tr>";
					if (this.isSet(data.sof2)) printMessage += "<tr><td>Type 2 (SOF2) </td><td>" + data.sof2 + "</td></tr>";
					if (this.isSet(data.sof3)) printMessage += "<tr><td>Type 3 (SOF3) </td><td>" + data.sof3 + "</td></tr>";
				
					printMessage += "<tr><td><strong>Medical Support</strong></td><td> </td></tr>";
					if (this.isSet(data.femt)) printMessage += "<tr><td>Fire Line EMT (FEMT)   </td><td>" + data.femt + "</td></tr>";
					if (this.isSet(data.femp)) printMessage += "<tr><td>Fire Line Paramedic (FEMP) </td><td>" + data.femp + "</td></tr>";
					printMessage += "<tr><td><strong>Fallers</strong></td><td> </td></tr>";
					if (this.isSet(data.fela)) printMessage += "<tr><td>Class A (FELA) </td><td>" + data.fela + "</td></tr>";
					if (this.isSet(data.felb)) printMessage += "<tr><td>Class B (FELB) </td><td>" + data.felb + "</td></tr>";
					if (this.isSet(data.felc)) printMessage += "<tr><td>Class C (FELC) </td><td>" + data.felc + "</td></tr>";
					printMessage += "</table>";
					if (this.isSet(data.personnelPickup)) printMessage += "<strong>Requested Pick-Up time for 12 or 16 hr. resources:</strong> " + data.personnelPickup + "<br/>";
					if (this.isSet(data.personnelInfo)) printMessage += "<strong>Other Information: </strong> " + data.personnelInfo + "<br/>"; 
				
					printMessage += "<br/><br/><table class='report'><tr><td><strong>Engines</td></tr>"; 
					
					if  (this.isSet(data.engineT1Single)) printMessage += "<tr><td ><strong>Type 1 - Single </strong>" + data.engineT1Single + " </td>";
					if  (this.isSet(data.engineT1ST)) printMessage += "<td><strong>Strike Team </strong>" + data.engineT1ST + " </td></tr>"; 
					
					if (this.isSet(data.engineT2Single)) printMessage += "<td><strong>Type 2 - Single </strong>" + data.engineT2Single + " </td>";
		            if (this.isSet(data.engineT2ST)) printMessage += "<td><strong>Strike Team </strong>" + data.engineT2ST + " </td></tr>";
					
		            if (this.isSet(data.engineT3Single))  printMessage += "<tr><td><strong>Type 3 - Single </strong>" + data.engineT3Single + " </td>";
	                if (this.isSet(data.engineT3ST))  printMessage += "<td><strong>Strike Team </strong>" + data.engineT3ST + " </td>";
	                if (this.isSet(data.engineT3FedSingle)) printMessage += "<td><strong>Federal(16hr) - Single </strong>" + data.engineT3FedSingle + " </td>";
					if (this.isSet(data.engineT3FedST)) printMessage += "<td><strong>Strike Team </strong>" + data.engineT3FedST + " </td>";
					if (this.isSet(data.engine34x4)) printMessage += "<td><strong>4x4 </strong>" + data.engine34x4 + " </td></tr>";
					
					if (this.isSet(data.engineT4Single)) printMessage += "<tr><td><strong>Type 4 - Single </strong>" + data.engineT4Single + " </td>";
	                if (this.isSet(data.engineT4ST)) printMessage += "<td><strong>Strike Team </strong>" + data.engineT4ST + " </td>";
	                if (this.isSet(data.engineT4FedSingle)) printMessage += "<td><strong>Federal(16hr) - Single </strong>" + data.engineT4FedSingle + " </td>";
					if (this.isSet(data.engineT4FedST)) printMessage += "<td><strong>Strike Team </strong>" + data.engineT4FedST + " </td>";
					if (this.isSet(data.engine44x4)) printMessage += "<td><strong>4x4 </strong>" + data.engine44x4 + "</td></tr>";
					
					if (this.isSet(data.engineT5Single)) printMessage += "<tr><td><strong>Type 5 - Single </strong>" + data.engineT5Single + " </td>";
	                if (this.isSet(data.engineT5ST)) printMessage += "<td><strong>Strike Team </strong>" + data.engineT5ST + " </td>";
	                if (this.isSet(data.engineT5FedSingle)) printMessage += "<td><strong>Federal(16hr) - Single </strong>" + data.engineT5FedSingle + " </td>";
					if (this.isSet(data.engineT5FedST)) printMessage += "<td><strong>Strike Team </strong>" + data.engineT5FedST + " </td>";
					if (this.isSet(data.engine54x4)) printMessage += "<td><strong>4x4 </strong>" + data.engine54x4 + " </td></tr>";
					
					printMessage += "<tr><td><strong>Type 6 - Single </strong>" + this.checkEmpty(data.engineT6Single) + " </td>";
	                printMessage += "<td><strong>Strike Team </strong>" + this.checkEmpty(data.engineT6ST) + "</td>";
	                printMessage += "<td><strong>Federal(16hr) - Single </strong>" + this.checkEmpty(data.engineT6FedSingle) + " </td>";
					printMessage += "<td><strong>Strike Team </strong>" + this.checkEmpty(data.engineT6FedST) + " </td>";
					printMessage += "<td><strong>4x4 </strong>" + this.checkEmpty(data.engine64x4) + " </td></tr>";
					
					printMessage += "<tr><td><strong>Type 6 - Single </strong>" + this.checkEmpty(data.engineT7Single) + " </td>";
	                printMessage += "<td><strong>Strike Team </strong>" + this.checkEmpty(data.engineT7ST) + " </td>";
	                printMessage += "<td><strong>Federal(16hr) - Single </strong>" + this.checkEmpty(data.engineT7FedSingle) + " </td>";
					printMessage += "<td><strong>Strike Team </strong>" + this.checkEmpty(data.engineT7FedST) + " </td>";
					printMessage += "<td><strong>4x4 </strong>" + this.checkEmpty(data.engine74x4) + " </td></tr>";
					
					printMessage += "</table>";
				    printMessage += "<strong>Requested Pick-Up time for 12 or 16 hr. resources: </strong>" + this.checkEmpty(data.enginePickup) + "<br/>";
					printMessage += "<strong>Other Information: </strong> " + this.checkEmpty(data.engineInfo) + "<br/>";
		
						printMessage += "<br/><br/><table class='report'><tr><td><strong>Hand Crews</td></tr>";
					
					printMessage += "<tr><td><strong>Type 1 - Single </strong>" + this.checkEmpty(data.handCrewT1Single) + " </td>";
	                printMessage += "<td><strong>Strike Team </strong>" + this.checkEmpty(data.handCrewT1ST) + " </td>";
	                printMessage += "<td><strong>Federal(16hr) - Single </strong>" + this.checkEmpty(data.handCrewT1FedSingle) + " </td>";
					printMessage += "<td><strong>Strike Team </strong>" + this.checkEmpty(data.handCrewT1FedST) + " </td></tr>";
					
					printMessage += "<tr><td><strong>Type 2 IA - Single </strong>" + this.checkEmpty(data.handCrewT2IASingle) + " </td>";
	                printMessage += "<td><strong>Strike Team </strong>" +this.checkEmpty(data.handCrewT2IAST) + " </td>";
	                printMessage += "<td><strong>Federal(16hr) - Single </strong>" + this.checkEmpty(data.handCrewT2IAFedSingle) + " </td>";
					printMessage += "<td><strong>Strike Team </strong>" + this.checkEmpty(data.handCrewT2IAFedST) + " </td></tr>";
							
					printMessage += "<tr><td><strong>Type 2 - Single </strong>" +this.checkEmpty(data.handCrewT2Single) + " </td>";
		            printMessage += "<td><strong>Strike Team </strong>" + this.checkEmpty(data.handCrewT2ST) + " </td>";
	                printMessage += "<td><strong>Federal(16hr) - Single </strong>" + this.checkEmpty(data.handCrewT2FedSingle) + " </td>";
					printMessage += "<td><strong>Strike Team </strong>" + this.checkEmpty(data.handCrewT2FedST) + " </td></tr>";
					
					printMessage += "</table>";
					printMessage += "<strong>Requested Pick-Up time for 12 or 16 hr. resources: </strong>" + this.checkEmpty(data.handCrewPickup) + "<br/>";
					printMessage += "<strong>Other Information: </strong> " + this.checkEmpty(data.handCrewInfo) + "<br/>";
		
					
					printMessage += "<br/><br/><table class='report'><tr><td><strong>Bulldozers</td></tr>";
		
					printMessage += "<tr><td><strong>Type 1 - Single </strong>" + this.checkEmpty(data.dozerT1Single) + " </td>";
	                printMessage += "<td><strong>Six-way Blade</strong>" + this.checkEmpty(data.dozerT1ST) + " </td>";
	                printMessage += "<td><strong>Rippers </strong>" + this.checkEmpty(data.dozerT16Way) + " </td>";
					printMessage += "<td><strong>Strike Team </strong>" + this.checkEmpty(data.dozerT1Rippers) + " </td>";
					printMessage += "<td><strong>12hr </strong>" + this.checkEmpty(data.dozerT112) + "</td>";
					printMessage += "<td><strong>24hr </strong>" + this.checkEmpty(data.dozerT124) + "</td></tr>";
					
					printMessage += "<tr><td><strong>Type 2 - Single </strong>" + this.checkEmpty(data.dozerT2Single) + " </td>";
	                printMessage += "<td><strong>Six-way Blade</strong>" + this.checkEmpty(data.dozerT2ST) + " </td>";
	                printMessage += "<td><strong>Rippers </strong>" + this.checkEmpty(data.dozerT26Way) + " </td>";
					printMessage += "<td><strong>Strike Team </strong>" + this.checkEmpty(data.dozerT2Rippers) + " </td>";
					printMessage += "<td><strong>12hr </strong>" + this.checkEmpty(data.dozerT212) + "</td>";
					printMessage += "<td><strong>24hr </strong>" + this.checkEmpty(data.dozerT224) + "</td></tr>";
					
					printMessage += "<tr><td><strong>Type 3 - Single </strong>" + this.checkEmpty(data.dozerT3Single) + " </td>";
	                printMessage += "<td><strong>Six-way Blade</strong>" + this.checkEmpty(data.dozerT3ST) + " </td>";
	                printMessage += "<td><strong>Rippers </strong>" + this.checkEmpty(data.dozerT36Way) + " </td>";
					printMessage += "<td><strong>Strike Team </strong>" + this.checkEmpty(data.dozerT3Rippers) + " </td>";
					printMessage += "<td><strong>12hr </strong>" + this.checkEmpty(data.dozerT312) + "</td>";
					printMessage += "<td><strong>24hr </strong>" + this.checkEmpty(data.dozerT324) + "</td></tr>";
							
					printMessage += "</table>"; 
					printMessage += "<strong>Requested Pick-Up time for 12 or 16 hr. resources: </strong>" + this.checkEmpty(data.dozerPickup) + "<br/>";
					printMessage += "<strong>Other Information: </strong> " + this.checkEmpty(data.dozerInfo) + "<br/>";
		
					
					printMessage += "<br/><br/><table class='report'><tr><td colspan='7'><strong>Misc. Equipment/Taskforces</td></tr>";
					
					printMessage += "<tr><td colspan='7'><strong>Water Tenders - Tactical</td></tr>";
					
					printMessage += "<tr><td><strong>Type 1 </strong>" + this.checkEmpty(data.tacticalT1) + " </td>";
	                printMessage += "<td><strong>4x4 </strong>" + this.checkEmpty(data.tacticalT14x4) + " </td>";
	                printMessage += "<td><strong>CAFS </strong>" + this.checkEmpty(data.tacticalT1CAFS) + " </td>";
	                printMessage += "<td><strong>Spray Bars </strong>" + this.checkEmpty(data.tacticalT1SprayBars) + " </td>";
	                printMessage += "<td><strong>Short Wheel Base </strong>" + this.checkEmpty(data.tacticalT1Short) + " </td>";
					printMessage += "<td><strong>12hr </strong>" + this.checkEmpty(data.tacticalT112) + "</td>";
					printMessage += "<td><strong>24hr </strong>" + this.checkEmpty(data.tacticalT124) + "</td></tr>";
					
					printMessage += "<tr><td><strong>Type 2 </strong>" + this.checkEmpty(data.tacticalT2) + " </td>";
	                printMessage += "<td><strong>4x4 </strong>" + this.checkEmpty(data.tacticalT24x4) + " </td>";
	                printMessage += "<td><strong>CAFS </strong>" + this.checkEmpty(data.tacticalT2CAFS) + " </td>";
	                printMessage += "<td><strong>Spray Bars </strong>" + this.checkEmpty(data.tacticalT2SprayBars) + " </td>";
	                printMessage += "<td><strong>Short Wheel Base </strong>" + this.checkEmpty(data.tacticalT2Short) + " </td>";
					printMessage += "<td><strong>12hr </strong>" + this.checkEmpty(data.tacticalT212) + "</td>";
					printMessage += "<td><strong>24hr </strong>" + this.checkEmpty(data.tacticalT224) + "</td></tr>";
					
					printMessage += "<tr><td colspan='7'><strong>Water Tenders - Support</td></tr>";
					
					printMessage += "<tr><td><strong>Type 1 </strong>" + this.checkEmpty(data.supportT1) + " </td>";
	                printMessage += "<td><strong>4x4 </strong>" + this.checkEmpty(data.supportT14x4) + " </td>";
	                printMessage += "<td><strong>CAFS </strong>" + this.checkEmpty(data.supportT1CAFS) + " </td>";
	                printMessage += "<td><strong>Spray Bars </strong>" + this.checkEmpty(data.supportT1SprayBars) + " </td>";
	                printMessage += "<td><strong>Short Wheel Base </strong>" + this.checkEmpty(data.supportT1Short) + " </td>";
					printMessage += "<td><strong>12hr </strong>" + this.checkEmpty(data.supportT112) + "</td>";
					printMessage += "<td><strong>24hr </strong>" + this.checkEmpty(data.supportT124) + "</td></tr>";
					
					printMessage += "<tr><td><strong>Type 2 </strong>" + this.checkEmpty(data.supportT2) + " </td>";
	                printMessage += "<td><strong>4x4 </strong>" + this.checkEmpty(data.supportT24x4) + " </td>";
	                printMessage += "<td><strong>CAFS </strong>" + this.checkEmpty(data.supportT2CAFS) + " </td>";
	                printMessage += "<td><strong>Spray Bars </strong>" + this.checkEmpty(data.supportT2SprayBars) + " </td>";
	                printMessage += "<td><strong>Short Wheel Base </strong>" + this.checkEmpty(data.supportT2Short) + " </td>";
					printMessage += "<td><strong>12hr </strong>" + this.checkEmpty(data.supportT212) + "</td>";
					printMessage += "<td><strong>24hr </strong>" + this.checkEmpty(data.supportT224) + "</td></tr>";
					
					printMessage += "<tr><td><strong>Type 3 </strong>" + this.checkEmpty(data.supportT3) + " </td>";
	                printMessage += "<td><strong>4x4 </strong>" + this.checkEmpty(data.supportT34x4) + " </td>";
	                printMessage += "<td><strong>CAFS </strong>" + this.checkEmpty(data.supportT3CAFS) + " </td>";
	                printMessage += "<td><strong>Spray Bars </strong>" + this.checkEmpty(data.supportT3SprayBars) + " </td>";
	                printMessage += "<td><strong>Short Wheel Base </strong>" + this.checkEmpty(data.supportT3Short) + " </td>";
					printMessage += "<td><strong>12hr </strong>" + this.checkEmpty(data.supportT312) + "</td>";
					printMessage += "<td><strong>24hr </strong>" + this.checkEmpty(data.supportT324) + "</td></tr>";
					
					printMessage += "</table>"; 
					printMessage += "<strong>Other Specialized Equipment: </strong>" + this.checkEmpty(data.miscEquip) + "<br/>";
					printMessage += "<strong>Requested Pick-Up time for 12 or 16 hr. resources: </strong>" + this.checkEmpty(data.miscPickup) + "<br/>";
					printMessage += "<strong>Other Information: </strong> " + this.checkEmpty(data.miscInfo) + "<br/>";
					
					printMessage += "<h4>Supplies: </h4>";
					printMessage += "<strong>List Required Supplies: </strong>" + this.checkEmpty(data.requiredSupplies) + "<br/>";
					printMessage += "<strong>Deliver to Location: </strong> " + this.checkEmpty(data.deliverLocation) + "<br/>";
					
					printMessage += "<h4>Review &amp; Approval: </h4>";
					printMessage += "<strong>Name and Incident assignment of person submitting form: </strong>" + this.checkEmpty(data.submittedBy) + "<br/>";
					printMessage += "<strong>Name of Branch (OPBD) reviewer: </strong> " + this.checkEmpty(data.opbdReviewer) + "<br/>";
					printMessage += "<strong>Name of Operations (OSC) reviewer: </strong> " + this.checkEmpty(data.oscReviewer) + "<br/>";
					
					printMessage += "<h4>ICS-215AQ Identified Risks </h4>";
					printMessage += "<ul>";
					if  (data.rocks) printMessage += "<li>Rocks </li>" ;
					if  (data.mineShafts) printMessage += "<li>Mine Shafts </li>" ;
					if  (data.snakes) printMessage += "<li>Snakes </li>" ;
					if  (data.steep)printMessage += "<li>Steep Ground </li>" ;
					if  (data.dozersCB) printMessage += "<li>Dozers </li>" ;
					if  (data.bees)printMessage += "<li>Bees/Wasps </li>" ;
					if  (data.trees) printMessage += "<li>Trees/Snags </li>" ;
					if  (data.heavyEquip) printMessage += "<li>Other Heavy Equipment </li>" ;
					if  (data.bears) printMessage += "<li>Bears </li>" ;
					if  (data.stumps)printMessage += "<li>Tree Stumps </li>" ;
					if  (data.dustyRoads) printMessage += "<li>Dusty Roads </li>" ;
					printMessage += "</ul>";
					
					printMessage += "<strong>Other Animals List: </strong>" + this.checkEmpty(data.animals) + "<br/>";
					printMessage += "<strong>Other safety related concerns requiring mitigation: </strong>" + this.checkEmpty(data.safetyConcerns) + "<br/>";
					printMessage += "<strong>Recommended Mitigation Actions: </strong> " + this.checkEmpty(data.mitigationActions) + "<br/>";
					printMessage += "<strong>Submitted by: </strong> " + this.checkEmpty(data.riskSubmittedBy) + "<br/>";
					printMessage += "<strong>Name of Operations (OSC) reviewer: </strong> " + this.checkEmpty(data.oscRiskReviewer) + "<br/>";
					printMessage += "<strong>Name and Incident assignment of person submitting form: </strong> " + this.checkEmpty(data.riskSubmittedBy2) + "<br/>";
					printMessage += "<strong>Name of Branch (OPBD) reviewer: </strong> " + this.checkEmpty(data.opbdReviewer2) + "<br/>";
					printMessage += "<strong>Name of Operations (OSC) reviewer: </strong> " + this.checkEmpty(data.oscReviewer2) + "<br/>";
					printMessage += "<strong>Name of Safety (SOF1) reviewer: </strong> " + this.checkEmpty(data.otherSubmittedBy) + "<br/>";
				
					}
					catch(e) {
						alert(e);
					} 
				
				
				 printMessage += "</html></body >"; 
				 Core.EventManager.fireEvent("Print215Report",printMessage);
			},
	    	formatTime: function(date)
	        {
	            var str =  date.getHours() + ":" + Core.Util.pad(date.getMinutes()) ;

	            return str;
	        },
	        formatDate: function(date)
	        {
	            var str = (date.getMonth() + 1) + "/"
	            + date.getDate() + "/"
	            + date.getFullYear();

	            return str;
	        },
	        checkEmpty: function(item){
	        	
	        	if(typeof(item) != "undefined" && item != "") {
	        		return item;
	        	}
	        	else{
	        		return " ";
	        	}
	        	
	        	
	        },
	        
	        isSet: function(item){
	        	
	        	var hasValue = false;
	        	if (typeof(item) != "undefined" && item != "") {
	        		hasValue = true;
	        	}
	        	
	        	return hasValue;
	        	
	        }
	        
			
		});
});