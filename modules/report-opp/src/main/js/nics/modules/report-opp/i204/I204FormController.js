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
define(['iweb/CoreModule', "nics/modules/UserProfileModule",'../AbstractFormController', './I204ReportView',  './I204FormView','./I204FormViewModel'],

	function(Core, UserProfile, AbstractFormController, I204ReportView, I204FormView , I204FormViewModel ){
	
		
	
		Ext.define('modules.report-opp.I204FormController', {
			extend : 'modules.report-opp.AbstractFormController',
			
			alias: 'controller.i204formcontroller',
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
			    	this.view.lookupReference('submitButton204').hide();
			    	this.view.lookupReference('cancelButton204').hide();
			    	this.view.lookupReference('resetButton204').hide();
			    	Ext.ComponentQuery.query('checkbox[cls=i204]').forEach(function(checkbox) {
			    		checkbox.hide();
			    	});
			    	
			    		if (Ext.getCmp('print204'))  Ext.getCmp('print204').enable();
			    		if (Ext.getCmp('final204'))  Ext.getCmp('final204').enable(); 
			    		if (Ext.getCmp('view204'))   Ext.getCmp('view204').enable(); 
			    },
	    	cancelForm: function(){
	    		Core.EventManager.fireEvent("CancelReport204", 'cancelForm');
		    		
	    	},
	    	
	    	
		    addRows: function (e, t, eOpts, args) {
		    	addCheckbox = this.view.lookupReference(args.section + '204Chbx');
				if (addCheckbox.getValue()){
					//Stop all events so that we can change the state of the checkbox without triggering the change event
					//Be careful with it. Don't forget resume events!
					addCheckbox.suspendEvents(false);    
					addCheckbox.setValue(false); 
					addCheckbox.resumeEvents();
								
					var currentFieldset = this.view.lookupReference(args.section + '204');
					//Get the count of the current items.  This is one greater than the number of actual items, 
					//because of the 'add' box, so use this for the first new item  
					var firstNewItem = currentFieldset.items.length;
					this.addFieldContainer('204',args.section, firstNewItem, 1);
					
				} 
				 
			},
			addFieldContainer: function (form, prefix, startIndex, count) {
				
				var currentFieldset = this.view.lookupReference(prefix + form);
				if (count === "") count = "1";
				var endIndex   = startIndex + parseInt(count);
				for (i = startIndex; i < endIndex; i++){
					var bindItems = [];
					switch(prefix){
					   case "comms":
						  bindItems = ['{commsAssignment' + i + '}', '{commsChannel' + i + '}', '{commsFreq' + i + '}', '{commsPhone' + i + '}' ];
					      break;
					  
					  case "tasklist":
						  bindItems = ['{resourceId' + i + '}', '{leader' + i + '}', '{contactInfo' + i + '}','{numPersons' + i + '}', '{notes' + i + '}', '{hasMato' + i + '}', '{matoId' + i + '}'];
				      break;
						
					}
					
					
					if (prefix == 'comms'){
						var newContainer = new Ext.form.FieldContainer({
							layout:'hbox',defaultType: 'textfield', defaults: {vtype:'simplealphanum',flex:4},
	    	  	    	  	items:[ {bind:bindItems[0]},
	    	  	    	  	        {bind:bindItems[1]},
		    	  	    	  	    {bind:bindItems[2]},
	    	  	    	  	        {bind:bindItems[3]}
	    	  	    	    	  ]
						});
						
					}
					else if (prefix == 'tasklist'){
						var newContainer = new Ext.form.FieldContainer({
							layout:'hbox',defaultType: 'textfield', defaults: {vtype:'simplealphanum'},
	    	  	    	  	items:[ {bind:bindItems[0],flex:6},
	    	  	    	  	        {bind:bindItems[1],flex:6},
	    	  	    	  	        {bind:bindItems[2],flex:6},
	    	  	    	  	        {bind:bindItems[3],flex:6},
	    	  	    	  	        {bind:bindItems[4],flex:6},
    	  	    	  	            {bind:bindItems[5],xtype:'checkbox',width:'61px' },
	    	  	    	  	        {bind:bindItems[6],xtype:'hiddenfield'}
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
	    		
	    		
	    		//dataObject =  {tasklist:{array:taskArray, count:taskCount},
	    		//comms:{array:commsArray, count:commsCount},
	    		var reportDataObject = this.build204DataArray(formView.data);
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
	     		   report.taskCount = reportDataObject.tasklist.count;
	    		   this.setTaskData(reportDataObject.tasklist.array, report.taskCount, report);
	    		   
	    		   report.commsCount = reportDataObject.comms.count;
	    		   this.setCommsData(reportDataObject.comms.array, report.commsCount,report);              
		    	  
	    		  
	    		  
	    		   
	    		   
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
						formView.data.incidentId, '204');
	    		
				
	    		   var topic = Ext.String.format("iweb.NICS.incident.{0}.report.{1}.#", formView.data.incidentId, '204');
				
	    		   this.mediator.sendPostMessage(url, topic, form);
	    		   this.setFormReadOnly();
	    		   this.newTopic = Ext.String.format(
						"iweb.NICS.incident.{0}.report.{1}.new", form.incidentid,
						'204');
	    		   Core.EventManager.fireEvent(this.newTopic);
				
	    		   message.report.incidentId = formView.data.incidentId;
	    		   message.report.incidentName = formView.data.incidentName;
		    	},
		    	build204DataArray: function(data){
		    		//dataObject
		    		var dataObject = {};
		    		//build the arrays
		    		var taskArray = [];
		    		var commsArray = [];
		    		
		    		
		    		var taskCount = 0;
		    		var commsCount = 0;
		    		var oldIndex
		    		
		    		for (item in data){
		    			
		    		//Figure out how many values have been added for the various contact list fields
						if ( /leader[0-9]+/.test(item) && data[item] != ""){
							++taskCount;
							oldIndex = item.match(/[0-9]+$/);
							currentResourceId="resourceId" + oldIndex;
							currentContactInfo="contactInfo" + oldIndex;
							currentNumPersons="numPersons" + oldIndex;
							currentNotes="notes" + oldIndex;
							currentHasMato="hasMato" + oldIndex;
							currentMatoId="matoId" + oldIndex;
							taskArray.push([data[currentResourceId], data[item],  data[currentContactInfo], data[currentNumPersons],  data[currentNotes], data[currentHasMato],  "0"]);
						
							
						}
						if ( /commsAssignment[0-9]+/.test(item) && data[item] != ""){
							++commsCount;
							oldIndex = item.match(/[0-9]+$/);
							currentChannel="commsChannel" + oldIndex;
							currentFreq="commsFreq" + oldIndex;
							currentPhone="commsPhone" + oldIndex;
							commsArray.push([data[item], data[currentChannel], data[currentFreq], data[currentPhone]]);
							
						}
						
					
		    		}
			    	
				    dataObject =  {
				    		tasklist:{array:taskArray, count:taskCount},
				    		comms:{array:commsArray, count:commsCount},
				    		
				    }
				    return dataObject;
				},
				setTaskData: function(array, count, report){
		    		if (array.length > 0){
		    		   for(var i=1; i<=array.length; i++){
		                	 currentRow  = array[i-1];
		                	 if (currentRow[0]) report['resourceId' + i] = currentRow[0];
		                	 if (currentRow[1]) report['leader' + i] = currentRow[1];
			                 if (currentRow[2]) report['contactInfo' + i] = currentRow[2];
			                 if (currentRow[3]) report['numPersons' + i] = currentRow[3];
							 if (currentRow[4]) report['notes' + i] = currentRow[4];
							 if (currentRow[5]) report['hasMato' + i] = currentRow[5];
							 if (currentRow[6]) report['matoId' + i] = currentRow[6];
							
								
		                }
		    		   }
		    		
		    	},
		    	setCommsData: function(array, count, report){
		    		if (array.length > 0){
		    		   for(var i=1; i<=array.length; i++){
		                	 currentRow  = array[i-1];
		                	 if (currentRow[0]) report['commsAssignment' + i] = currentRow[0];
		                	 if (currentRow[1]) report['commsChannel' + i] = currentRow[1];
			                 if (currentRow[2]) report['commsFreq' + i] = currentRow[2];
							 if (currentRow[3]) report['commsPhone' + i] = currentRow[3];
							
		                	 
								
		                }
		    		   }
		    		
		    	},
		    	buildReport: function(data){	
		    	
		    		var report = this.build204DataArray(data);
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
	                reportText += '<td  align="right">ASSIGNMENT LIST</td></tr>';
	                reportText += '<tr> <td align="right" >ICS 204-CG</td>';
	                reportText += '</tr></tbody></table></td>';
	                reportText += ' </tr></tbody></table>';
	                
	                reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0">';
		            reportText += '<tbody><tr>';
		            reportText += '<td><table width="250" border="0"> <tbody>';
					reportText += '<tr><td width="500" >3. Branch</td> </tr>';
					reportText += '<tr><td>' + data.branch + '</td></tr> </tbody></table></td>';
					reportText += '<td><table width="250" border="0"> <tbody>';
					reportText += '<tr><td width="500" >4.  Division/Group/Staging</td> </tr>';
					reportText += '<tr><td>' + data.divgroupstaging + '</td></tr> </tbody></table></td>';
		            reportText += '</tr></tbody></table>';
		            reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0"><tbody><tr>';
		            reportText += '<td align="left" valign="top" colspan="4">5. Operations Personnel</td></tr>';
		            reportText += '<tr valign="top"><td  width="300">&nbsp;</td><td  width="220">Name</td> <td  width="220">Affiliation</td> <td  width="220">Contact # (s)</td></tr>';
		            reportText += '<tr>';
		            reportText += '<td  align="right">Operations Section Chief:</td>';
		            reportText += '<td align="center">';
		            if (data.opsChiefName )reportText +=data.opsChiefName;
		            reportText += '</td><td align="center">';
		            if (data.opsChiefAgency )reportText +=data.opsChiefAgency; 
		            reportText += '</td><td align="center">';
		            if (data.opsChiefContact )reportText +=data.opsChiefContact;
		            reportText += '</td></tr>'; 
		            reportText += '<tr>';
		            reportText += '<td align="right">Deputy Operations Section Chief:</td>';
		            reportText += '<td align="center">';
		            if (data.depOpsChiefName )reportText +=data.depOpsChiefName;
		            reportText += '</td><td align="center">';
		            if (data.depOpsChiefAgency )reportText +=data.depOpsChiefAgency; 
		            reportText += '</td><td align="center">';
		            if (data.depOpsChiefContact )reportText +=data.depOpsChiefContact;
		            reportText += '</td></tr>';
		            reportText += '<tr>';
		            reportText += '<td align="right">Branch Director:</td>';
		            reportText += '<td align="center">';
		            if (data.branchName )reportText +=data.branchName;
		            reportText += '</td><td align="center">';
		            if (data.depBranchAgency )reportText +=data.branchAgency; 
		            reportText += '</td><td align="center">';
		            if (data.branchContact )reportText +=data.branchContact;
		            reportText += '</td></tr>';
		            reportText += '<tr>';
		            reportText += '<td align="right">Deputy Branch Director:</td>';
		            reportText += '<td align="center">';
		            if (data.depBranchName )reportText +=data.depBranchName;
		            reportText += '</td><td align="center">';
		            if (data.depBranchAgency )reportText +=data.depBranchAgency; 
		            reportText += '</td><td align="center">';
		            if (data.depBranchContact )reportText +=data.depBranchContact;
		            reportText += '</td></tr>';
		            reportText += '<tr>';
		            reportText += '<td align="right">Division/Group Supervisor/STAM:</td>';
		            reportText += '<td align="center">';
		            if (data.stamName )reportText +=data.stamName;
		            reportText += '</td><td align="center">';
		            if (data.stamAgency )reportText +=data.stamAgency; 
		            reportText += '</td><td align="center">';
		            if (data.stamContact )reportText +=data.stamContact;
		            reportText += '</td></tr></tbody> </table>'; 
		            reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0"><tbody><tr>';
		            reportText += '<td align="left" valign="top" colspan="6">6. Resources Assigned</td></tr>';
		            reportText += '<tr valign="top"><td  width="200" align="center" valign="center">Strike Team /Task Force/Resource Identifier</td>';
		            reportText += '<td width="175" align="center" valign="center">Leader</td> ';
		            reportText += '<td width="125" align="center" valign="center">Contact Info. #</td> ';
		            reportText += '<td width="75" align="center" valign="center"># Of Persons</td>';
		            reportText += '<td width="350" align="center" valign="center">Reporting Info/Notes/Remarks</td>';
		            reportText += '<td width="50" align="center" valign="center">ICS 204a</td></tr>';
		            if (report.tasklist.array.length > 0)reportText += this.printTasklistRows(report.tasklist.array);   
		            reportText += '</tbody> </table>';
		            reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0"><tbody>';
		            reportText += '<tr ><td align="left" valign="top" colspan="2">7. Work Assignments</td></tr>';
		            reportText += '<tr><td  valign="top" colspan="2">';
		            if (data.workAssignments )reportText += data.workAssignments ;
		            reportText += '</td></tr>';
		            reportText += '<tr><td  valign="top"> Latitude: ';
		            if (data.latitude )reportText += data.latitude ;
		            reportText += '</td>';
		            reportText += '<td  valign="top">Longitude: ';
		            if (data.longitude )reportText += data.longitude ;
		            reportText += '</td></tr>';
		            reportText += '</tbody> </table>';
		            reportText += '<table width="100%" border="2" cellpadding="0" cellspacing="0"><tbody>';
		            reportText += '<tr><td align="left" valign="top">8. Special Instructions</td></tr>';
		            reportText += '<tr><td  valign="top">';
		            if (data.specialInstructions )reportText +=  data.specialInstructions ;
		            reportText += '</td></tr>';
		            reportText += '</tbody> </table>';
		            reportText += '<table width="100%"  cellpadding="0" cellspacing="0"><tbody><tr>';
		            reportText += '<td align="left" valign="top" colspan="4">9. Communications (radio and/or phone contact numbers needed for this assignment)</td></tr>';
		            reportText += '<tr valign="top"><td><table border="1" width:"100%" cellspacing="0" cellpadding="0"><tbody>';
		            reportText += '<tr align="center"> <td width="250"  >Asignment</td>';
		            reportText += '<td width="250" align="center">Channel Name</td> ';
		            reportText += '<td width="250"  align="center" >Frequency</td> ';
		            reportText += '<td width="250" align="center">Phone</td>';
		            if (report.comms.array.length > 0)reportText += this.printCommsRows(report.comms.array); 
		            reportText += '<tr><td colspan="4">';
			        reportText += '<table width="100%" cellpadding="0" cellspacing="10"><tbody>';
		            reportText += '<tr><td align="left" colspan="6">Emergency Communications</td></tr>';
		            reportText += '<tr>';
		            reportText += '<td width="50" align="right">Medical: </td>';
		            reportText += '<td ><u>';
		            if (data.commsMedical )reportText +=  data.commsMedical ;
		            reportText += '</u></td>';
		            reportText += '<td width="50" align="right">Evacuation: </td>';
		            reportText += '<td ><u>';
		            if (data.commsEvac )reportText +=  data.commsEvac ;
		            reportText += '</u></td>';
		            reportText += '<td width="50" >Other: </td>';
		            reportText += '<td ><u>';
		            if (data.commsOther )reportText +=  data.commsOther;
		            reportText +='</u></td>  </tr>';
		            reportText += '</tbody> </table></tr>';
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
	                if (data.pscReviewBy)  reportText += data.pscReviewBy ;
	                reportText += '</td></tr>';
	                reportText += '</tbody></table></td>';
	                reportText += '<td><table border="0"><tbody>';
	                reportText += '<tr><td >Date/Time:</td></tr>';
	                reportText += '<tr><td>';
		            if (data.pscReviewdate && data.pscReviewtime )  reportText += this.formatDate(data.pscReviewdate) + ' ' +  this.formatTime(data.pscReviewtime);
	                reportText += '</td></tr>';
	                reportText += '</tbody></table></td>';
		            reportText += '<td><table width="100%" border="0"><tbody>';
	                reportText += '<tr><td  >8. Reviewed By (OSC):</td></tr>';
	                reportText += '<tr><td>';
	                if (data.oscReviewBy) reportText +=  data.oscReviewBy;
	                reportText += '</td></tr>';
	                reportText += '</tbody></table></td>';
	                reportText += '<td><table border="0"><tbody>';
	                reportText += '<tr><td >Date/Time:</td></tr>';
	                reportText += '<tr><td>';
		            if (data.opscReviewdate && data.opscReviewtime )  reportText += this.formatDate(data.opscReviewdate) + ' ' + this.formatTime(data.opscReviewtime) ;
	                reportText += '</td></tr>';
	                reportText += '</tbody></table></td>';
		            reportText += '</tbody> </table></td>';
	               
	                 reportText += '</tr></tbody></table>';
	                reportText += '	</td></tr></tbody></table>'; //end of outer table
	               
				    Core.EventManager.fireEvent("PrintReport204",reportText);
				    
				},
				printTasklistRows: function(row){
				     var rowText='';
					for(var i=0; i<row.length; i++){
		           	rowText += '<tr><td align="center">'
		           	 if(row[i][0]) rowText += row[i][0];
		           	rowText +='</td><td align="center">';
		           	if(row[i][1]) rowText += row[i][1]; 
		           	rowText +='</td><td align="center">';
		           	if(row[i][2]) rowText += row[i][2];
		           	rowText +='</td><td align="center">';
		           	if(row[i][3]) rowText += row[i][3];
		           	rowText +='</td><td >';
		           	if(row[i][4]) rowText += row[i][4];
		           	rowText +='</td><td align="center">';
		           	if(row[i][5] && row[i][5] == true ) rowText +='X';
		               rowText += '</td></tr>';
		           }
					return rowText;
				},
				printCommsRows: function(row){
				     var rowText='';
					for(var i=0; i<row.length; i++){
		           	rowText += '<tr><td align="center">'
		           	 if(row[i][0]) rowText += row[i][0];
		           	rowText +='</td><td align="center">';
		           	if(row[i][1]) rowText += row[i][1]; 
		           	rowText +='</td><td align="center">';
		           	if(row[i][2]) rowText += row[i][2];
		           	rowText +='</td><td align="center">';
		           	if(row[i][3]) rowText += row[i][3];
		           	rowText += '</td></tr>';
		           }
					return rowText;
				},
				
		});
});