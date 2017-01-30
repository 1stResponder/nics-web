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
define(['iweb/CoreModule', "nics/modules/UserProfileModule", './RocReportView',  './RocFormView','./RocFormModel'],

	function(Core, UserProfile, RocReportView, RocFormView , RocFormModel ){
	
		
	
		Ext.define('modules.report-roc.RocFormController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.rocformcontroller',
			
			init : function(args) {
			
				this.mediator = Core.Mediator.getInstance();
				Core.EventManager.addListener("EmailROCReport", this.emailROC.bind(this));
				this.callParent();
				
			},
			onJoinIncident: function(e, incident) {
				
				this.getView().enable();		
			},
			clearForm: function () {
				
			 var username  = UserProfile.getFirstName() + " " + UserProfile.getLastName();	
			 this.view.getForm().getFields().each (function (field) {
				 if (field.fieldLabel != 'Incident Number*' && field.fieldLabel != 'Incident Name*' && field.fieldLabel != 'Report Type' && !(field.isHidden()) )
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
			    	
			    	Ext.getCmp('printROC').enable();
			    	Ext.getCmp('updateROC').enable();
			    	Ext.getCmp('finalizeROC').enable(); 
			    	Ext.getCmp('viewROC').enable(); 
			    },
			    enableForm: function () {
			    	this.view.getForm().getFields().each (function (field) {
			    		field.setReadOnly(false);
			    	});
			    	this.view.lookupReference('submitButton').show();
			    	this.view.lookupReference('cancelButton').show();
			    	this.view.lookupReference('resetButton').show();
			    },

			    
		    buildReport: function(data, simple, reportType){			    	
			
		    	var emailMessage=null;
				  
				if (simple){
					
					emailMessage  = "<html><body >Intel - for internal use only. Numbers subject to change<br/><br/";
					emailMessage  +=  "Location: " + data.location + "</br>";
					emailMessage  += "Jurisdiction: " + data.jurisdiction + "<br/>";
					emailMessage  += "Start Date/Time: " + this.formatDate(data.date) + " @ " + this.formatTime(data.starttime);
					
					
					emailMessage  += "<ul>";
					emailMessage  += "<li>Scope " + data.scope + " acres, "  + data.percentContained + "% contained</li>";
					emailMessage  += "<li>" + data.spreadRate  + "Rate of Spread </li>";
					emailMessage  += "<li>" + data.temperature  + "&deg;, " + data.relHumidity + "% RH, " + data.windSpeed +  " mph, " +  data.windDirection  + "  </li>";
						emailMessage  += "<li>" + data.evacuations + " Evacuated </li>";
					emailMessage  += "<li>" + data.structuresThreat  + " Structure Threat</li>";
					emailMessage  += "<li>" + data.infrastructuresThreat  + "Critical Infrastructure </li>";
				    if(typeof(data.comments) != "undefined" && data.comments != ""){emailMessage  += "<li>" + data.comments  + "</li>"}
					emailMessage   += "</ul>"; 
				}
				else { 
					
					try {
					emailMessage = "<html><body><h2>Report on Conditions - " + data.incidentType ;
					emailMessage += "<br/><br/>Incident Name/Number: " + data.incidentName + "/" + data.incidentId ;
					emailMessage += "<br/>Start Date/Time: " + this.formatDate(data.date) + " @ "  + this.formatTime(data.starttime);
					emailMessage += "<br/> Location: " + data.location + "</h2>";
					emailMessage += "<ul style='list-style-type: none;'>";
					emailMessage += "<li><strong>Report Type:</strong> " + data.reportType + "</li>";
					emailMessage += "<li><strong>ROC Display Name:</strong> " + data.rocDisplayName + "</li>";
					emailMessage += "<li><strong>County:</strong> " + data.county + "</li>";
					emailMessage += "<li><strong>Date:</strong> " + this.formatDate(data.date) + "</li>";
					emailMessage += "<li><strong>Time:</strong> " + this.formatTime(data.starttime) + "</li>";
					emailMessage += "<li><strong>Jurisdiction:</strong> " + data.jurisdiction + "</li>";
					emailMessage += "<li><strong>Type of Incident:</strong> " + data.incidentType + "</li>";
					if(typeof(data.incidentCause) != "undefined" && data.incidentCause != "")emailMessage += "<li><strong>Cause:</strong> " + data.incidentCause + "</li>";
					emailMessage += "<li><strong>Acres/Size/Area involved:</strong> " + data.scope + "</li>";
					emailMessage += "<li><strong>Rate of Spread:</strong> " + data.spreadRate + "</li>";
					if(typeof(data.fuelType) != "undefined" && data.fuelType != "")emailMessage += "<li><strong>Fuel Type</strong> " + data.fuelType + "</li>";
					if(typeof(data.potential) != "undefined" && data.potential != "")emailMessage += "<li><strong>Potential:</strong> " + data.potential + "</li>";
					emailMessage += "<li><strong> % contained:</strong> " + data.percentContained + "</li>";
					if(typeof(data.estimatedContainment) != "undefined" && data.estimatedContainment != "")emailMessage += "<li><strong>Estimated Containment:</strong> " + data.estimatedContainment + "</li>";
					if(typeof(data.estimatedControl) != "undefined" && data.estimatedControl != "")emailMessage += "<li><strong>Estimated Control:</strong> " + data.estimatedControl + "</li>";
					
					emailMessage += "<li><strong>Weather</strong> <ul style='list-style-type: none;'> ";
					emailMessage += "<li><strong>Temperature:</strong> " + data.temperature + "</li>";
					emailMessage += "<li><strong>Relative Humidity:</strong> " + data.relHumidity + "</li>";
					emailMessage += "<li><strong>Wind Speed mph:</strong> " + data.windSpeed + "</li>";
					emailMessage += "<li><strong>Wind Direction:</strong> " + data.windDirection + "</li>";
					emailMessage +="<li><strong>Predicted Weather:</strong> " + data.predictedWeather + "</li></ul></li>";
					emailMessage += "<li><strong>Evacuations:</strong> " + data.evacuations  + "</li>";
					emailMessage += "<li><strong>Structures Threatened:</strong> " + data.structuresThreat  + "</li>";
					emailMessage += "<li><strong>Critical Infrastructure Threatened:</strong> " + data.infrastructuresThreat  + "</li>";
					if(typeof(data.icpLocation) != "undefined" && data.icpLocation != "")emailMessage += "<li><strong>ICP Location:</strong> " + data.icpLocation  + "</li>";
					emailMessage += "<li><strong>Resources Committed</strong> <ul style='list-style-type: none;'> ";
					emailMessage += "<li><strong>Aircraft</strong> <ul style='list-style-type: none;'> ";
					if(typeof(data.airAttack) != "undefined" && data.airAttack != "")emailMessage +="<li><strong>Air Attack:</strong> " + data.airAttack + "</li>";
					if(typeof(data.airTankers) != "undefined" && data.airTankers != "")emailMessage +="<li><strong>Air Tankers:</strong> " + data.airTankers + "</li>";
					if(typeof(data.helicopters) != "undefined" && data.helicopters != "")emailMessage +="<li><strong>Helicopters:</strong> " + data.helicopters + "</li>";
					emailMessage +=	"</ul></li>";
					if(typeof(data.overhead) != "undefined" && data.overhead != "")emailMessage +="<li><strong>Overhead:</strong> " + data.overhead + "</li>";
					if(typeof(data.typeIEngine) != "undefined" && data.typeIEngine != "")emailMessage +="<li><strong>Type I Engine:</strong> " + data.typeIEngine + "</li>";
					if(typeof(data.typeIIEngine) != "undefined" && data.typeIIEngine != "")emailMessage +="<li><strong>Type II Engine:</strong> " + data.typeIIEngine + "</li>";
					if(typeof(data.typeIIIEngine) != "undefined" && data.typeIIIEngine != "")emailMessage +="<li><strong>Type III Engine:</strong> " + data.typeIIIEngine + "</li>";
					if(typeof(data.waterTender) != "undefined" && data.waterTender != "")emailMessage +="<li><strong>Water Tender:</strong> " + data.waterTender + "</li>";
					if(typeof(data.dozers) != "undefined" && data.dozers != "")emailMessage +="<li><strong>Dozers:</strong> " + data.dozers + "</li>";
					if(typeof(data.handcrews) != "undefined" && data.handcrews != "")emailMessage +="<li><strong>Hand Crews:</strong> " + data.handcrews + "</li>";
					if(typeof(data.comUnit) != "undefined" && data.comUnit != "")emailMessage +="<li><strong>Com Unit:</strong> " + data.comUnit + "</li>";
					emailMessage +=	"</ul></li>";
					
				    emailMessage += "</ul>"
				    if(typeof(data.comments) != "undefined" && data.comments != "")emailMessage +="<strong>General Comments:</strong> " + data.comments;
					 emailMessage += "<br/><strong>Reported By " + data.reportBy + "</strong>"; 
					}
					catch(e) {
						alert(e);
					}
				}
				
			    if (reportType == 'print'){
			    	 emailMessage += "</html></body >"; 
			    	Core.EventManager.fireEvent("PrintROCReport",emailMessage);
			    }
			  else if (reportType == 'email'){
				  	emailMessage += "<p style='font-size:.8em;'>This e-mail was sent automatically by the Next Generation Incident Command System (NICS).Do not reply.</p></html></body >";
				    var subject  = "Report on Conditions  - " + data.rocDisplayName + "," + data.incidentType + "," + data.county + "," + data.reportType;
				    var emailResponse = {emailList: data.email, subject: subject, emailBody: emailMessage};
			    	Core.EventManager.fireEvent("EmailROCReport",emailResponse);

				 
			    } 
			//	return emailMessage;
				
			},
	    	
	    	submitForm: function(){
	    		var form = {};
	    		var message = {};
	    		var report= {}
	    		
	    		
	    		var time = Core.Util.formatDateToString(new Date());
	    		 
	    		message.datecreated = time;
	    		
	    		var formView = this.view.viewModel;
	    		 		
	    		if (typeof(formView.data.simplifiedEmail) == "undefined" )  {formView.data.simplifiedEmail = true;}
    	
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
	    		form.formtypeid = formView.data.formTypeId; //this is always a ROC 
	    		form.usersessionid = UserProfile.getUserSessionId();
	    		form.distributed = false;
	    		form.message = JSON.stringify(message);
	    		
				var url = Ext.String.format('{0}/reports/{1}/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						formView.data.incidentId, 'ROC');
	    		
				
				var topic = Ext.String.format("iweb.NICS.incident.{0}.report.{1}.#", formView.data.incidentId, 'ROC');
				
				this.mediator.sendPostMessage(url, topic, form);
				this.setFormReadOnly();
				this.newTopic = Ext.String.format(
						"iweb.NICS.incident.{0}.report.{1}.new", form.incidentid,
						'ROC');
				Core.EventManager.fireEvent(this.newTopic);
				//Build  email message
	    		//Add incident Name and Id to pass to email/print report
	    		message.report.incidentId = formView.data.incidentId;
	    		message.report.incidentName = formView.data.incidentName;
	    		this.buildReport(message.report, formView.data.simplifiedEmail, 'email');
			
				
	    	},
	    	emailROC: function(e, response){
	    		//Now send the email 

	    		this.emailTopic = "iweb.nics.email.alert";
	    		var emailList = response.emailList;
	    		var subject  = response.subject;
	    		var msgBody= response.emailBody;
	    		
			var message = {
				      to: emailList,
				      from: UserProfile.getUsername(),
				      subject: subject,
				      body: msgBody
				}; 
			if (this.mediator && this.mediator.publishMessage)
			{
				this.mediator.publishMessage(this.emailTopic, message); 
			} 

		
    	},
	    	
	    	cancelForm: function(){
	    		Core.EventManager.fireEvent("CancelROCReport");
		    		
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
	        }
			
		});
});