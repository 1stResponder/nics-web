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
define(['iweb/CoreModule', "nics/modules/UserProfileModule",'../AbstractFormController', './I205ReportView',  './I205FormView','./I205FormViewModel'],

	function(Core, UserProfile, AbstractFormController, I205ReportView, I205FormView , I205FormViewModel ){
	
		
	
		Ext.define('modules.report-opp.I205FormController', {
			extend : 'modules.report-opp.AbstractFormController',
			
			alias: 'controller.i205formcontroller',
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
			    	this.view.lookupReference('submitButton205').hide();
			    	this.view.lookupReference('cancelButton205').hide();
			    	this.view.lookupReference('resetButton205').hide();
			    	Ext.ComponentQuery.query('checkbox[cls=i205]').forEach(function(checkbox) {
			    		checkbox.hide();
			    	});
			    	
			    		if (Ext.getCmp('print205'))  Ext.getCmp('print205').enable();
			    		if (Ext.getCmp('final205'))  Ext.getCmp('final205').enable(); 
			    		if (Ext.getCmp('view205'))   Ext.getCmp('view205').enable(); 
			    },
	    	cancelForm: function(){
	    		Core.EventManager.fireEvent("CancelReport205", 'cancelForm');
		    		
	    	},
	    	
	    	
		    addRows: function (e, t, eOpts, args) {
		    	addCheckbox = this.view.lookupReference(args.section + '205Chbx');
				if (addCheckbox.getValue()){
					//Stop all events so that we can change the state of the checkbox without triggering the change event
					//Be careful with it. Don't forget resume events!
					addCheckbox.suspendEvents(false);    
					addCheckbox.setValue(false); 
					addCheckbox.resumeEvents();
								
					var currentFieldset = this.view.lookupReference(args.section + '205');
					//Get the count of the current items.  This is one greater than the number of actual items, 
					//because of the 'add' box, so use this for the first new item  
					var firstNewItem = currentFieldset.items.length;
					this.addFieldContainer('205',args.section, firstNewItem, 1);
					
				} 
				 
			},
			addFieldContainer: function (form, prefix, startIndex, count) {
				
				var currentFieldset = this.view.lookupReference(prefix + form);
				if (count === "") count = "1";
				var endIndex   = startIndex + parseInt(count);
				for (i = startIndex; i < endIndex; i++){
					var bindItems = [];
					switch(prefix){
					   case "commlist":
						  bindItems = ['{commsAssignment' + i + '}', '{commsName' + i + '}', '{commsPhone' + i + '}' ];
					      break;
					  
					  case "channels":
						  bindItems = ['{channel' + i + '}', '{function' + i + '}', '{chName' + i + '}','{assignment' + i + '}', '{rxFreq' + i + '}', '{rxTone' + i + '}', '{txFreq' + i + '}', '{txTone' + i + '}', '{mode' + i + '}', '{remarks' + i + '}'];
				      break;
						
					}
					
					
					if (prefix == 'commlist'){
						var newContainer = new Ext.form.FieldContainer({
							layout:'hbox',defaultType: 'textfield', defaults: {vtype:'simplealphanum',flex:2},
	    	  	    	  	items:[ {bind:bindItems[0]},
	    	  	    	  	        {bind:bindItems[1]},
		    	  	    	  	    {bind:bindItems[2]}
	    	  	    	    	  ]
						});
						
					}
					else if (prefix == 'channels'){
						var newContainer = new Ext.form.FieldContainer({
							layout:'hbox',defaultType: 'textfield', defaults: {vtype:'simplealphanum',flex:10},
	    	  	    	  	items:[ {bind:bindItems[0] },
	    	  	    	  	        {bind:bindItems[1]},
	    	  	    	  	        {bind:bindItems[2]},
	    	  	    	  	        {bind:bindItems[3]},
	    	  	    	  	        {bind:bindItems[4]},
    	  	    	  	            {bind:bindItems[5]},
	    	  	    	  	        {bind:bindItems[6]},
    	  	    	  	            {bind:bindItems[7]},
    	  	    	  	            {bind:bindItems[8]},
    	  	    	  	            {bind:bindItems[9]}
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
	    		
	    		var channelsCount = 0;
	    		var commlistCount = 0;
	    		
	    		
	    		var formView = this.view.viewModel;
	    		
	    		var reportDataObject = this.build205DataArray(formView.data);
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
	    		/* Data object Returns:
	    					channels:{array:channelsArray, count:channelsCount},
				    		commlist:{array:commlistArray, count:commlistCount},*/
	    		
	     		   report.channelsCount = reportDataObject.channels.count;
	    		   this.setChannelsData(reportDataObject.channels.array,  report.channelsCount, report);
	    		   
	    		   report.commlistCount = reportDataObject.commlist.count;
	    		   this.setCommsData(reportDataObject.commlist.array, report.commlistCount, report);              

	    		       
		    	         
			    	  
		    	 
	    		  
	    		   
	    		   
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
						formView.data.incidentId, '205');
	    		
				
	    		   var topic = Ext.String.format("iweb.NICS.incident.{0}.report.{1}.#", formView.data.incidentId, '205');
				
	    		   this.mediator.sendPostMessage(url, topic, form);
	    		   this.setFormReadOnly();
	    		   this.newTopic = Ext.String.format(
						"iweb.NICS.incident.{0}.report.{1}.new", form.incidentid,
						'205');
	    		   Core.EventManager.fireEvent(this.newTopic);
				
	    		   message.report.incidentId = formView.data.incidentId;
	    		   message.report.incidentName = formView.data.incidentName;
		    	},
		    	build205DataArray: function(data){
		    		//dataObject
		    		var dataObject = {};
		    		//build the arrays
		    		var channelsArray = [];
		    		var commlistArray = [];
		    		
		    		
		    		var channelsCount = 0;
		    		var commlistCount = 0;
		    		var oldIndex
		    		
		    		for (item in data){
		    			
		    		//Figure out how many values have been added for the various contact list fields
						if ( /function[0-9]+/.test(item) && data[item] != ""){
							++channelsCount;
							oldIndex = item.match(/[0-9]+$/);
							currentChannel="channel" + oldIndex;
							//currentChannel=channelsCount;
							currentChName="chName" + oldIndex;
							currentAssignment="assignment" + oldIndex;
							currentRXFreq="rxFreq" + oldIndex;
							currentRXTone="rxTone" + oldIndex;
							currentTXFreq="txFreq" + oldIndex;
							currentTXTone="txTone" + oldIndex;
							currentMode="mode" + oldIndex;
							currentRemarks="remarks" + oldIndex;
							
							channelsArray.push([data[currentChannel],  data[item], data[currentChName],  data[currentAssignment], data[currentRXFreq],  data[currentRXTone], data[currentTXFreq],  
							                   data[currentTXTone], data[currentMode],  data[currentRemarks]]);

						
							
						}
						if ( /commsAssignment[0-9]+/.test(item) && data[item] != ""){
							++commlistCount;
							oldIndex = item.match(/[0-9]+$/);
							currentChannel="commsName" + oldIndex;
							currentPhone="commsPhone" + oldIndex;
							commlistArray.push([data[item], data[currentChannel], data[currentPhone]]);

							
						}
						
					
		    		}
			    	
				    dataObject =  {
				    		channels:{array:channelsArray, count:channelsCount},
				    		commlist:{array:commlistArray, count:commlistCount},
				    		
				    }
				    return dataObject;
				},
				setChannelsData: function(array, count, report){
		    		if (array.length > 0){
		    		   for(var i=1; i<=array.length; i++){
		                	 currentRow  = array[i-1];
		                	 if (currentRow[0]) report['channel' + i] = currentRow[0];
		                	 if (currentRow[1]) report['function' + i] = currentRow[1];
							 if (currentRow[2]) report['chName' + i] = currentRow[2];
							 if (currentRow[3]) report['assignment' + i] = currentRow[3];
							 if (currentRow[4]) report['rxFreq' + i] = currentRow[4];
		                	 if (currentRow[5]) report['rxTone' + i] = currentRow[5];
		                	 if (currentRow[6]) report['txFreq' + i] = currentRow[6];
		                	 if (currentRow[7]) report['txTone' + i] = currentRow[7];
							 if (currentRow[8]) report['mode' + i] = currentRow[8];
							 if (currentRow[9]) report['remarks' + i] = currentRow[9];
							 
								
		                }
		    		   }
		    		
		    	},
		    	setCommsData: function(array, count, report){
		    		if (array.length > 0){
		    		   for(var i=1; i<=array.length; i++){
		                	 currentRow  = array[i-1];
		                	 if (currentRow[0]) report['commsAssignment' + i] = currentRow[0];
		                	 if (currentRow[1]) report['commsName' + i] = currentRow[1];
							 if (currentRow[2]) report['commsPhone' + i] = currentRow[2];
							
							 

								
		                }
		    		   }
		    		
		    	},
		    	buildReport: function(data){	
		    	
		    		var report = this.build205DataArray(data);
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
	                reportText += '<td  align="right">INCIDENT RADIO COMMUNICATIONS PLAN</td></tr>';
	                reportText += '<tr> <td align="right" >ICS 205-CG</td>';
	                reportText += '</tr></tbody></table></td>';
	                reportText += ' </tr></tbody></table>';
	                  // Start of the Current Org list tables 
	                reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0"><tbody><tr>';
	                reportText += '<td colspan="10">3. Basic Radio Channel Use</td></tr>';
	                reportText += '<tr valign="top"><td>Ch#</td><td>Function</td><td>Channel Name/Trunked Radio System Talkgroup</td><td>Assignment</td>';
	                reportText += '<td>RX Freq N or W</td><td>RX Tone/NAC</td><td>TX Freq N or W</td><td>TX Tone/NAC</td><td>Mode  A, D or M</td><td>Remarks</td></tr>';
	                if (report.channels.array.length > 0)reportText += this.printConstantRows(report.channels.array,10 );   
	                reportText += '</tbody></table>';
	                reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0">';
	                reportText += '<tbody><tr><td><table width="750" border="0"><tbody>';
	                reportText += '<tr><td  >4. Prepared By:</td></tr>';
	                reportText += '<tr><td>' + data.reportBy + '</td></tr>';
	                reportText += '</tbody></table></td>';
	                reportText += '<td><table width="250" border="0"><tbody>';
	                reportText += '<tr><td >5. Date/Time:</td></tr>';
	                reportText += '<tr><td>' + this.formatDate(data.prepdate) +  this.formatTime(data.preptime) + '</td></tr>';
	                reportText += '</tbody></table></td>';
	                reportText += '</tr></tbody></table>';
	                reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0">';
	                reportText += '<tbody><tr width="100%">';
	                reportText += '<td>The convention calls for frequency lists to show four digits after the decimal place, followed by either an â€œNâ€? or a â€œWâ€?, depending on ';
	                reportText += 'whether the frequency is narrow or wide band. Mode refers to either â€œAâ€? or â€œDâ€? indicating analog or digital (e.g. Project 25) or "M" indicating ';
	                reportText += 'mixed mode. All channels are shown as if programmed in a control station, mobile or portable radio. Repeater and base stations must be programmed ';
	                reportText += 'with the Rx and Tx reversed.</td>';
	                reportText += '</tr></tbody></table>';
	                reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0"><tbody><tr>';
	                reportText += '<td colspan="3">3a. Basic Local Communications Information</td></tr>';
	                reportText += '<tr><td align="center" colspan="3" >COMMUNICATIONS LIST</td></tr>';
	                reportText += '<tr><td align="center" colspan="3">ICS 205A-CG (ICS 205 Supplement A)</td></tr>';
	                reportText += '<tr><td >Assignment</td><td>Name</td><td>Method(s) of contact (radio frequency, phone, pager, cell #(s), etc.)</td></tr>';
	                if (report.channels.array.length > 0)reportText += this.printConstantRows(report.commlist.array,3 );   
	                reportText += '</tbody></table>';
	                reportText += '	</td></tr></tbody></table>'; //end of outer table
	                
				    Core.EventManager.fireEvent("PrintReport205",reportText);
				    
				},
				
		
			
		});
});