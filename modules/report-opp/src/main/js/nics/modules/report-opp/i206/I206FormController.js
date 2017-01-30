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
define(['iweb/CoreModule', "nics/modules/UserProfileModule",'../AbstractFormController', './I206ReportView',  './I206FormView','./I206FormViewModel'],

	function(Core, UserProfile, AbstractFormController, I206ReportView, I206FormView , I206FormViewModel ){
	
		
	
		Ext.define('modules.report-opp.I206FormController', {
			extend : 'modules.report-opp.AbstractFormController',
			
			alias: 'controller.i206formcontroller',
			init : function(args) {
				
				this.mediator = Core.Mediator.getInstance();
				this.callParent();
				
				
			},
				
			onJoinIncident: function(e, incident) {
				
				this.getView().enable();		
			},
			
			

			setFormReadOnly: function () {
				    var allowUpdate = true;
			    	this.view.getForm().getFields().each (function (field) {
			    		field.setReadOnly(true);
			    		
			    			
			    	});
			    	this.view.lookupReference('submitButton206').hide();
			    	this.view.lookupReference('cancelButton206').hide();
			    	this.view.lookupReference('resetButton206').hide();
			    	Ext.ComponentQuery.query('checkbox[cls=i206]').forEach(function(checkbox) {
			    		checkbox.hide();
			    	});
			    	
			    		if (Ext.getCmp('print206'))  Ext.getCmp('print206').enable();
			    		if (Ext.getCmp('final206'))  Ext.getCmp('final206').enable(); 
			    		if (Ext.getCmp('view206'))   Ext.getCmp('view206').enable(); 
			    },
	    	cancelForm: function(){
	    		Core.EventManager.fireEvent("CancelReport206", 'cancelForm');
		    		
	    	},
	    	
	    	
		    addRows: function (e, t, eOpts, args) {
		    	addCheckbox = this.view.lookupReference(args.section + '206Chbx');
				if (addCheckbox.getValue()){
					//Stop all events so that we can change the state of the checkbox without triggering the change event
					//Be careful with it. Don't forget resume events!
					addCheckbox.suspendEvents(false);    
					addCheckbox.setValue(false); 
					addCheckbox.resumeEvents();
								
					var currentFieldset = this.view.lookupReference(args.section + '206');
					//Get the count of the current items.  This is one greater than the number of actual items, 
					//because of the 'add' box, so use this for the first new item  
					var firstNewItem = currentFieldset.items.length;
					this.addFieldContainer('206',args.section, firstNewItem, 1);
					
				} 
				 
			},
			addFieldContainer: function (form, prefix, startIndex, count) {
				
				var currentFieldset = this.view.lookupReference(prefix + form);
				if (count === "") count = "1";
				var endIndex   = startIndex + parseInt(count);
				for (i = startIndex; i < endIndex; i++){
					var bindItems = [];
					switch(prefix){
					 case "medical":
						  bindItems = ['{medName' + i + '}', '{medLocation' + i + '}', '{medContact' + i + '}', '{medParamedic' + i + '}' ];
					      break;
				     case "transport":
						  bindItems = ['{trspName' + i + '}', '{trspLocation' + i + '}', '{trspContact' + i + '}', '{trspParamedic' + i + '}' ];
					      break;
					  
					  case "hospital":
						  bindItems = ['{hospName' + i + '}', '{hospLocation' + i + '}', '{hospContact' + i + '}','{hospAirTime' + i + '}', '{hospGndTime' + i + '}', '{hospBurn' + i + '}', '{hospHeli' + i + '}'];

				      break;
						
					}
					
					
					if ((prefix == 'medical') || (prefix == 'transport')){
						var newContainer = new Ext.form.FieldContainer({
							layout:'hbox',defaultType: 'textfield', defaults: {vtype:'simplealphanum',flex:4},

	    	  	    	  	items:[ {bind:bindItems[0]},
	    	  	    	  	        {bind:bindItems[1]},
		    	  	    	  	    {bind:bindItems[2]},
	    	  	    	  	        {bind:bindItems[3]}
	    	  	    	    	  ]
						});
						
					}
					else if (prefix == 'hospital'){
						var newContainer = new Ext.form.FieldContainer({
							layout:'hbox',defaultType: 'textfield', defaults: {vtype:'simplealphanum',flex:6},
	    	  	    	  	items:[ {bind:bindItems[0]},
	    	  	    	  	        {bind:bindItems[1]},
	    	  	    	  	        {bind:bindItems[2]},
	    	  	    	  	        {bind:bindItems[3]},
	    	  	    	  	        {bind:bindItems[4]},
    	  	    	  	            {bind:bindItems[5]},
	    	  	    	  	        {bind:bindItems[6]}

	    	  	    	    	  ]
						});
						
					}
					
					
					
				
					currentFieldset.add(newContainer);
				}
		
			return;
		}, 
	    	submitForm: function(){
	    		var form = {};
	    		var message = {};
	    		var report= {};
	    		
	    		var taskCount = 0;
	    		var commsCount = 0;
	    		
	    		
	    		var formView = this.view.viewModel;
	    		
	    		var reportDataObject = this.build206DataArray(formView.data);
	    		//create the report from the data
	    		for (item in formView.data){
	    			   //Don't capture the buttons, checkboxes or the incident name and id in the report
	    			   var buttonRE = /button$/i;
	    			   var checkboxRE = /Chbx$/i;
		    			  
	    			   if (item != 'incidentId' && item != 'incidentName' && !(buttonRE.test(item)) &&  !(checkboxRE.test(item)) )
	    					{
		    					//Figure out how many values have been added for the various contact list fields
		    					if ( /.*([0-9]+)$/.test(item)){
		    			   //don't do anything
		    					}
		    					else {
		    						report[item] = formView.data[item];
		    					}
	    						
	    					}
	    					
	    		  }
	    		/* Data Object returned:
	    					medical:{array:medicalArray, count:medicalCount},
				    		transport:{array:transportArray, count:transportCount},
				    		hospital:{array:hospitalArray, count:hospitalCount},*/
	    		
	     		   report.medicalCount = reportDataObject.medical.count;
	    		   this.setMedTransportData(reportDataObject.medical.array, report.medicalCount, 'med', report);
	    		   
	    		   report.transportCount = reportDataObject.transport.count;
	    		   this.setMedTransportData(reportDataObject.transport.array, report.transportCount, 'trsp', report);
	    		   
	    		   report.hospitalCount = reportDataObject.hospital.count;
	    		   this.setHospitalData(reportDataObject.hospital.array, report.hospitalCount, report);              

	    		   
	    		   message.report = report;
	    	
	    		   var time = Core.Util.formatDateToString(new Date());
		    	   message.datecreated = time;
	    		   //Populate form properties
		    	   form.seqtime = new Date().getTime()
	    		   form.incidentid = formView.data.incidentId;
	    		   form.incidentname = formView.data.incidentName;
	    		   form.formtypeid = formView.data.formTypeId; //this is always a ROC 
	    		   form.usersessionid = UserProfile.getUserSessionId();
	    		   form.distributed = false;
	    		   form.seqnum = formView.data.seqnum;
	    		   form.message = JSON.stringify(message);
	    		
	    		   var url = Ext.String.format('{0}/reports/{1}/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						formView.data.incidentId, '206');
	    		
				
	    		   var topic = Ext.String.format("iweb.NICS.incident.{0}.report.{1}.#", formView.data.incidentId, '206');
				
	    		   this.mediator.sendPostMessage(url, topic, form);
	    		   this.setFormReadOnly();
	    		   this.newTopic = Ext.String.format(
						"iweb.NICS.incident.{0}.report.{1}.new", form.incidentid,
						'206');
	    		   Core.EventManager.fireEvent(this.newTopic);
				
	    		   message.report.incidentId = formView.data.incidentId;
	    		   message.report.incidentName = formView.data.incidentName;
		    	},
		    	build206DataArray: function(data){
		    		//dataObject
		    		var dataObject = {};
		    		//build the arrays
		    		var medicalArray = [];
		    		var transportArray = [];
		    		var hospitalArray = [];
		    		
		    		var medicalCount = 0;
		    		var transportCount = 0;
		    		var hospitalCount = 0;
		    		

		    		var oldIndex
		    		
		    		for (item in data){
		    			
		    		//Figure out how many values have been added for the various contact list fields
		    			if ( /medName[0-9]+/.test(item) && data[item] != ""){
							++medicalCount;
							oldIndex = item.match(/[0-9]+$/);
							currentLocation="medLocation" + oldIndex;
							currentContact="medContact" + oldIndex;
							currentParamedic="medParamedic" + oldIndex;
							medicalArray.push([data[item], data[currentLocation], data[currentContact],   data[currentParamedic]]);
						
							
						}
		    			if ( /trspName[0-9]+/.test(item) && data[item] != ""){
							++transportCount;
							oldIndex = item.match(/[0-9]+$/);
							currentLocation="trspLocation" + oldIndex;
							currentContact="trspContact" + oldIndex;
							currentParamedic="trspParamedic" + oldIndex;
							transportArray.push([data[item], data[currentLocation], data[currentContact],   data[currentParamedic]]);
						
							
						}
		    			if ( /hospName[0-9]+/.test(item) && data[item] != ""){
							++hospitalCount;
							oldIndex = item.match(/[0-9]+$/);
							currentLocation="hospLocation" + oldIndex;
							currentContact="hospContact" + oldIndex;
							currentAirTime="hospAirTime" + oldIndex;
							currentGndTime="hospGndTime" + oldIndex;
							currentBurn="hospBurn" + oldIndex;
							currentHeli="hospHeli" + oldIndex;
							hospitalArray.push([data[item], data[currentLocation], data[currentContact], data[currentAirTime], data[currentGndTime], data[currentBurn], data[currentHeli]]);
						

							
						}
						
					
		    		}
			    	
				    dataObject =  {
				    		medical:{array:medicalArray, count:medicalCount},
				    		transport:{array:transportArray, count:transportCount},
				    		hospital:{array:hospitalArray, count:hospitalCount},

				    		
				    }
				    return dataObject;
				},

				setMedTransportData: function(array, count, prefix, report){
					if (array.length > 0){
			    		   for(var i=1; i<=array.length; i++){
			                	 currentRow  = array[i-1];
			                	 if (currentRow[0]) report[prefix + 'Name' + i] = currentRow[0];
			                	 if (currentRow[1]) report[prefix + 'Location' + i] = currentRow[1];
								 if (currentRow[2]) report[prefix + 'Contact' + i] = currentRow[2];
								 if (currentRow[3]) report[prefix + 'Paramedic' + i] = currentRow[3];
									
			                }
			    		   }
			    		
		    		
		    	},
		    	setHospitalData: function(array, count, report){
		    		if (array.length > 0){
		    		   for(var i=1; i<=array.length; i++){
		                	 currentRow  = array[i-1];
		                	 if (currentRow[0]) report['hospName' + i] = currentRow[0];
		                	 if (currentRow[1]) report['hospLocation' + i] = currentRow[1];
							 if (currentRow[2]) report['hospContact' + i] = currentRow[2];
							 if (currentRow[3]) report['hospAirTime' + i] = currentRow[3];
		                	 if (currentRow[4]) report['hospGndTime' + i] = currentRow[4];
							 if (currentRow[5]) report['hospBurn' + i] = currentRow[5];
							 if (currentRow[6]) report['hospHeli' + i] = currentRow[6];

		                }
		    		   }
		    		
		    	},
		    	buildReport: function(data){	
		    	
		    		var report = this.build206DataArray(data);
			    	var reportText=null;
			    	reportText  = '<table width="1000" border="3" cellpadding="0" cellspacing="0"><tbody> <tr><td>';
					reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0"><tbody><tr><td>';
					reportText += '<table width="250" border="0"> <tbody>';
					reportText += '<tr><td  >1. Incident Name</td> </tr>';
					reportText += '<tr><td>' + data.incidentName + '</td></tr> </tbody></table></td>';
					reportText += '<td><table width="500" border="0"><tbody><tr> <td width="230" colspan="2">2. Operational Period</td></tr>';
	                reportText += '<tr><td width="230">From: ' + this.formatDate(data.date) + " " + this.formatTime(data.starttime) + '</td>';
	                reportText += '<td width="230">To: ' + this.formatDate(data.enddate) + " " + this.formatTime(data.endtime) + '</td>';
	                reportText += '</tr></tbody></table></td>';
	                 reportText += '<td><table width="250" border="0"><tbody> <tr>';
	                reportText += '<td  align="right">MEDICAL PLAN</td></tr>';
	                reportText += '<tr> <td align="right" >ICS 206-CG</td>';
	                reportText += '</tr></tbody></table></td>';
	                reportText += ' </tr></tbody></table>';
	                  // Start of the Current Org list tables 
	               reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0"><tbody><tr>';
	                reportText += '<td colspan = "4">3. Medical Aid Stations</td></tr>';
	                reportText += '<tr valign="top"><td>Name</td><td>Location</td><td>Contact #</td>';
	                reportText += '<td>Paramedics On site (Y/N)</td></tr>';
	                if (report.medical.array.length > 0)reportText += this.printConstantRows(report.medical.array,4 );   
	                reportText += '</tbody></table>';
	                reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0"><tbody><tr>';
	                reportText += '<td colspan="4">4. Transportation</td></tr>';
	                reportText += '<tr valign="top"><td>Name</td><td>Location</td><td>Contact #</td>';
	                reportText += '<td>Paramedics On board (Y/N)</td></tr>';
	                if (report.transport.array.length > 0)reportText += this.printConstantRows(report.transport.array,4 );   
	                reportText += '</tbody></table>';
	                reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0"><tbody><tr>';
	                reportText += '<td colspan="7">5. Hospitals</td></tr>';
	                reportText += '<tr valign="top"><td>Hospital</td><td>Address</td><td>Contact #</td>';
	                reportText += '<td>Travel Time (Air)</td><td>Travel Time (Ground)</td><td>Burn Center</td><td>Helipad</td></tr>';
	                if (report.hospital.array.length > 0)reportText += this.printConstantRows(report.hospital.array,7 );   
	                reportText += '</tbody></table>';
	                
	                reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0"><tbody>';
		            reportText += '<tr><td align="left" valign="top">6. Special Medical Emergency Procedures</td></tr>';
		            reportText += '<tr><td  valign="top">';
		            if (data.procedures )reportText +=  data.procedures ;
		            reportText += '</td></tr>';
		            reportText += '</tbody> </table>';
	                reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0">';
	                reportText += '<tbody><tr>';
		            reportText += '<td><table width="100%" border="0"><tbody>';
	                reportText += '<tr><td  >10. Prepared By:</td></tr>';
	                reportText += '<tr><td>' + data.reportBy + '</td></tr>';
	                reportText += '</tbody></table></td>';
	                reportText += '<td><table border="0"><tbody>';
	                reportText += '<tr><td >Date/Time:</td></tr>';
	                reportText += '<tr><td>' + this.formatDate(data.prepdate) + ' ' +  this.formatTime(data.preptime) + '</td></tr>';
	                reportText += '</tbody></table></td>';
		            reportText += '<td><table width="100%" border="0"><tbody>';
	                reportText += '<tr><td  >11. Reviewed By (PSC)</td></tr>';
	                reportText += '<tr><td>';
	                if (data.soReviewBy)  reportText += data.soReviewBy ;
	                reportText += '</td></tr>'; 
	                reportText += '</tbody></table></td>';
	                reportText += '<td><table border="0"><tbody>';
	                reportText += '<tr><td >Date/Time:</td></tr>';
	                reportText += '<tr><td>';
		            if (data.soReviewdate && data.soReviewtime )  reportText += this.formatDate(data.soReviewdate) + ' ' +  this.formatTime(data.soReviewtime);
	                reportText += '</td></tr>';
	                reportText += '</tbody></table>';
		            reportText += '</tr></tbody></table>';
	                reportText += '	</td></tr></tbody></table>'; //end of outer table
	                Core.EventManager.fireEvent("PrintReport206",reportText);


				    
				},
				
		
			
		});
});