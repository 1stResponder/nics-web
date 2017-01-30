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
define(['iweb/CoreModule', "nics/modules/UserProfileModule", './GarReportView', './GarFormView','./GarFormModel'],

	function(Core, UserProfile, GarReportView, GarFormView , GarFormModel ){
	
		Ext.define('modules.report-gar.GarFormController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.garformcontroller',
			
			init : function(args) {
			
				this.mediator = Core.Mediator.getInstance();
				
			},
			
			onSliderChange: function(slider, newValue){
				
				var garValue = 0;
				this.view.getForm().getFields().each(function (field) {
		    		if(field.xtype == 'slider'){
		    			garValue += field.getValue();
		    		}
		    		else if(field.xtype == 'displayfield' && field.fieldLabel == 'GAR Result'){
		    			
		    			if(garValue > 43 && garValue <= 60){
		    				field.setValue(garValue + ' - High Risk');
		    			}
		    			else if(garValue > 22 && garValue <= 43){
		    				field.setValue(garValue + ' - Caution');
		    			}
		    			else{
		    				field.setValue(garValue + ' - Low Risk');
		    			}
		    			
		    		}
		    	});
				
				
			},
			
			onGarResultChange: function(slider, newValue){
				
				var field = this.lookupReference('garResult');
				var array = field.getValue().split(' ');
				
				if(array[0] > 43 && array[0] <= 60){
					field.setStyle('background-color', '#ff0000');
				}
				else if(array[0] > 22 && array[0] <= 43){
    				field.setStyle('background-color', '#ffa500');
    			}
    			else{
    				field.setStyle('background-color', '#00ff00');
    			}
			},
			
			buildReport: function(data, reportType){			    	
			
		    	var doc = null;
				
				doc = "<html><body><h2>NICS - " + data.incidentName; 
				doc += "<br/><br/><br/>" + this.formatDate(data.requestDate) + "<h2><br/><br/>";
				doc += "<strong>Report Type:</strong> " + data.reportType + "<br/>";
				doc += "<ul style='list-style-type: none; border: 1px solid black'>";
				doc += "<li><strong>Division/Staging/Group*:</strong> " + data.divgroupstaging + "</li>";
				doc += "<li><strong>Physical Location*:</strong> " + data.physicalLocation + "</li>";
				doc += "<li><strong>Date/Time of Request*:</strong> " + this.formatDate(data.requestDate) + "</li>";
				doc += "<li><strong>Latitude*:</strong> " + data.lat + "</li>";
				doc += "<li><strong>Longitude*:</strong> " + data.lon + "</li>";
				doc += "<li><strong>Supervision*:</strong> " + data.supervision + "</li>";
				doc += "<li><strong>Planning*:</strong> " + data.planning + "</li>";
				doc += "<li><strong>Team Selection*:</strong> " + data.teamSelect + "</li>";
				doc += "<li><strong>Team Fitness*:</strong> " + data.teamFit + "</li>";
				doc += "<li><strong>Environment*:</strong> " + data.environment + "</li>";
				doc += "<li><strong>Event/Evolution Complexity*:</strong> " + data.eventEvoComplex + "</li>";
				doc += "<li><strong>GAR Result*:</strong> " + data.garResult + "</li></ul>";
				
		    	Core.EventManager.fireEvent("PrintGarReport",doc);
				
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
		    	Ext.getCmp('printGar').enable();
		    	Ext.getCmp('updateGar').enable();
		    //	Ext.getCmp('finalizeGar').enable(); 
		    	Ext.getCmp('viewGar').enable(); 
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
	    		form.formtypeid = formView.data.formTypeId; 
	    		form.usersessionid = UserProfile.getUserSessionId();
	    		form.distributed = false;
	    		form.seqtime = formView.data.seqtime;
	    		form.message = JSON.stringify(message);
	    		
				var url = Ext.String.format('{0}/reports/{1}/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						formView.data.incidentId, 'GAR');
				
				var topic = Ext.String.format("iweb.NICS.incident.{0}.report.{1}.#", formView.data.incidentId, 'GAR');
				
				this.mediator.sendPostMessage(url, topic, form);
				this.setFormReadOnly();
				this.newTopic = Ext.String.format(
						"iweb.NICS.incident.{0}.report.{1}.new", form.incidentid,
						'GAR');
				Core.EventManager.fireEvent(this.newTopic);
				
	    	},
	    	
	    	cancelForm: function(){
	    		Core.EventManager.fireEvent("CancelGarReport");
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