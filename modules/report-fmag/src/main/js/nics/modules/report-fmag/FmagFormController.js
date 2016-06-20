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
define(['iweb/CoreModule', "nics/modules/UserProfileModule", './FmagReportView', './FmagFormView','./FmagFormModel'],

	function(Core, UserProfile, FmagReportView, FmagFormView , FmagFormModel ){
	
		Ext.define('modules.report-fmag.FmagFormController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.fmagformcontroller',
			
			init : function(args) {
			
				this.mediator = Core.Mediator.getInstance();
				
				
			},
			
			 buildReport: function(data, reportType){			    	
			
		    	var doc = null;
				
				doc = "<html><body><h2>NICS - " + data.incidentName; 
				doc += "<br/><br/><br/>" + this.formatDate(data.requestDate) + "<h2><br/><br/>";
				doc += "<strong>Report Type:</strong> " + data.reportType + "<br/>";
				doc += "<ul style='list-style-type: none; border: 1px solid black'>";
				doc += "<li><strong>Agency Making Request*:</strong> " + data.agencyRequest + "</li>";
				doc += "<li><strong>Date/Time of Request*:</strong> " + this.formatDate(data.requestDate) + "</li>";
				doc += "<li><strong>Fire Incident Name*:</strong> " + data.incidentName + "</li>";
				doc += "<li><strong>Inc. Number*:</strong> " + data.incidentId + "</li>";
				doc += "<li><strong>City/County*:</strong> " + data.cityCounty + "</li>";
				doc += "<li><strong>Acreage*:</strong> " + data.acreage + "</li>";
				doc += "<li><strong>Cause*:</strong> " + data.cause + "</li>";
				doc += "<li><strong>Date/Time Fire Started*:</strong> " + this.formatDate(data.fireDate) + "</li>";
				doc += "<li><strong>IC*:</strong> " + data.ic + "</li>";
				doc += "<li><strong>Agency Making Request*:</strong> " + data.agencyRequest + "</li>";
				doc += "<li><strong>Contact Name*:</strong> " + data.contactName + "</li>";
				doc += "<li><strong>Phone*:</strong> " + data.phone + "</li></ul>";
				
				doc += "<ul style='list-style-type: none; border: 1px solid black'>FACTORS";
				doc += "<li><strong>Community Threatened*:</strong> " + data.threat + "</li>";
				doc += "<li><strong>Population*:</strong> " + data.population + "</li>";
				
				doc += "<ul style='list-style-type: none; border: 1px solid black'>Persons Evacuated";
				doc += "<li><strong>Mandatory*:</strong> " + data.mandatory + "</li>";
				doc += "<li><strong>Volunteer*:</strong> " + data.volunteer + "</li></ul>";
				
				doc += "<ul style='list-style-type: none ;border: 1px solid black'>Shelters";
				doc += "<li><strong>Shelters Open? (Y/N)*:</strong> " + data.sheltersOpen + "</li>";
				doc += "<li><strong>How Many?*:</strong> " + data.sheltersCount + "</li>";
				doc += "<li><strong>Where?*:</strong> " + data.sheltersLocal + "</li></ul>";
				
				doc += "<ul style='list-style-type: none; border: 1px solid black'>Structures";
				doc += "<li><strong># of Structures Threatened*:</strong> " + data.threatStructs + "</li>";
				doc += "<li><strong>Residential*:</strong> " + data.resStructs + "</li>";
				doc += "<li><strong>Business*:</strong> " + data.busStructs + "</li>";
				doc += "<li><strong>Fire Proximity to Structures*:</strong> " + data.fireProxStructs + "</li>";
				doc += "<li><strong>Structures Vacation or Residential*:</strong> " + data.vacaResStructs + "</li>";
				doc += "<li><strong>Subdivision or Rural*:</strong> " + data.subRuralStructs + "</li>";
				doc += "<li><strong>Natural/Man Made Barriers*:</strong> " + data.natManBarriers + "</li>";
				doc += "<li><strong>Infrastructure/Facilities/Equipment/Resources Threatened*:</strong> " + data.infFacEquResThreat + "</li></ul>";
				
				doc += "<ul style='list-style-type: none; border: 1px solid black'>Resources Committed In %";
				doc += "<li><strong>% of all Engine types*:</strong> " + data.percEngTypes + "</li>";
				doc += "<li><strong>Local %*:</strong> " + data.percLocal + "</li>";
				doc += "<li><strong>Operational Area %*:</strong> " + data.percOpArea + "</li>";
				doc += "<li><strong>Region to Region Ordering %*:</strong> " + data.percRegOrder + "</li></ul>";
				
				doc += "<li><strong>County EOC Activated (Y/N)*:</strong> " + data.countyEocActive + "</li>";
				doc += "<li><strong>Full*:</strong> " + data.full + "</li>";
				doc += "<li><strong>Limited*:</strong> " + data.limited + "</li>";
				doc += "<li><strong>Fual & Terrain Type*:</strong> " + data.fuelTerType + "</li>";
				doc += "<li><strong>Fire Containment %*:</strong> " + data.percFireCont + "</li>";
				doc += "<li><strong>Other critical considerations*:</strong> " + data.criticalCon + "</li></ul>";
				
				doc += "<ul style='list-style-type: none; border: 1px solid black'>PROGNOSIS";
				doc += "<ul style='list-style-type: none; border: 1px solid black'>Weather";
				doc += "<li><strong>Temp./Relative Humidity*:</strong> " + data.tempRelHum + "</li></ul>";
				
				doc += "<ul style='list-style-type: none; border: 1px solid black'>Fire Behavior";
				doc += "<li><strong>Fire Behavior Current*:</strong> " + data.fireBehCurrent + "</li>";
				doc += "<ul style='list-style-type: none; border: 1px solid black'>Fire Behavior Growth/Behavior Potential (next burning period)";
				doc += "<li><strong>LRA*:</strong> " + data.lra + "</li>";
				doc += "<li><strong>SRA*:</strong> " + data.sra + "</li>";
				doc += "<li><strong>FRA*:</strong> " + data.fra + "</li></ul></ul>";
				
				doc += "<li><strong>Current 209*:</strong> " + data.current209 + "</li>";
				doc += "<li><strong>Incident Map*:</strong> " + data.incidentMap + "</li>";
				doc += "<li><strong>Weather*:</strong> " + data.weather + "</li>";
				doc += "<li><strong>Other Docs*:</strong> " + data.otherDocs + "</li>";
				
		    	console.log(doc);
		    	Core.EventManager.fireEvent("PrintFmagReport",doc);
				
			},
			
			clearForm: function () {
				
				 var username  = UserProfile.getFirstName() + " " + UserProfile.getLastName();	
				 this.view.getForm().getFields().each (function (field) {
					 if (field.fieldLabel != 'Inc. Number*' && field.fieldLabel != 'Fire Incident Name*' && field.fieldLabel != 'Report Type' && !(field.isHidden()) )
					    	
						 field.setValue("");
				 
			     });
			    	
			},
			   
		    setFormReadOnly: function () {
		    	this.view.getForm().getFields().each (function (field) {
		    		field.setReadOnly(true);
		    	});
		    	this.view.lookupReference('submitButton').hide();
		    	this.view.lookupReference('resetButton').hide();
		    	this.view.lookupReference('cancelButton').hide();
		    	Ext.getCmp('printFmag').enable();
		    	Ext.getCmp('updateFmag').enable();
		    	Ext.getCmp('finalizeFmag').enable(); 
		    	Ext.getCmp('viewFmag').enable(); 
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
	    		form.formtypeid = formView.data.formTypeId; //this is always a ABC
	    		form.usersessionid = UserProfile.getUserSessionId();
	    		form.distributed = false;
	    		form.message = JSON.stringify(message);
	    		
				var url = Ext.String.format('{0}/reports/{1}/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						formView.data.incidentId, 'ABC');
				
				var topic = Ext.String.format("iweb.NICS.incident.{0}.report.{1}.#", formView.data.incidentId, 'ABC');
				
				this.mediator.sendPostMessage(url, topic, form);
				this.setFormReadOnly();
				this.newTopic = Ext.String.format(
						"iweb.NICS.incident.{0}.report.{1}.new", form.incidentid,
						'ABC');
				Core.EventManager.fireEvent(this.newTopic);
				
	    	},
	    	
	    	cancelForm: function(){
	    		Core.EventManager.fireEvent("CancelFmagReport");
	    	},
	    	
	    	formatDate: function(date)
	        {
	            var str = (date.getMonth() + 1) + "-"
	            + date.getDate() + "-"
	            + date.getFullYear() + " "
	            + date.getHours() + ':' 
	            + date.getMinutes() + 
	            ':' + date.getSeconds();

	            return str;
	        }
			
		});
});