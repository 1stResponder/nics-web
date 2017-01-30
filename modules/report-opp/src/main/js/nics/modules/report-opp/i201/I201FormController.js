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
define(['iweb/CoreModule', "nics/modules/UserProfileModule",'../AbstractFormController', './I201ReportView',  './I201FormView','./I201FormViewModel'],

	function(Core, UserProfile, AbstractFormController, I201ReportView, I201FormView , I201FormViewModel ){
	
		
	
		Ext.define('modules.report-opp.I201FormController', {
			extend : 'modules.report-opp.AbstractFormController',
			
			alias: 'controller.i201formcontroller',
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
			    	this.view.lookupReference('submitButton201').hide();
			    	this.view.lookupReference('cancelButton201').hide();
			    	this.view.lookupReference('resetButton201').hide();
			    	Ext.ComponentQuery.query('checkbox[cls=i201]').forEach(function(checkbox) {
			    		checkbox.hide();
			    	});
			    	
			    		if (Ext.getCmp('print201'))  Ext.getCmp('print201').enable();
			    		if (Ext.getCmp('final201'))  Ext.getCmp('final201').enable(); 
			    		if (Ext.getCmp('view201'))   Ext.getCmp('view201').enable(); 
			    },
	    	cancelForm: function(){
	    		Core.EventManager.fireEvent("CancelReport201", 'cancelForm');
		    		
	    	},
	    	
	    	
		    addRows: function (e, t, eOpts, args) {
		    	addCheckbox = this.view.lookupReference(args.section + '201Chbx');
				if (addCheckbox.getValue()){
					//Stop all events so that we can change the state of the checkbox without triggering the change event
					//Be careful with it. Don't forget resume events!
					addCheckbox.suspendEvents(false);    
					addCheckbox.setValue(false); 
					addCheckbox.resumeEvents();
								
					var currentFieldset = this.view.lookupReference(args.section + '201');
					//Get the count of the current items.  This is one greater than the number of actual items, 
					//because of the 'add' box, so use this for the first new item  
					var firstNewItem = currentFieldset.items.length;
					this.addFieldContainer('201',args.section, firstNewItem, 1);
					
				} 
				 
			},
			
	    	submitForm: function(){
	    		var form = {};
	    		var message = {};
	    		var report= {};
	    		
	    		var agencyRepsCount = 0;
	    		var icStaffCount = 0;
	    		var intelCount = 0;
	    		var logisticsCount = 0;
	    		var logisticsSptCount = 0;
	    		var logisticsSrvCount = 0;
	    		var opsCount = 0;
	    		var opsBranchCount = 0;
	    		var opsBBranchCount = 0;
	    		var opsCBranchCount = 0;
	    		var opsAirBranchCount = 0;
	    		var financeCount = 0;
	    		var resourceCount = 0;
	    		
	    		var formView = this.view.viewModel;
	    		
	    		var reportDataObject = this.buildDataArray(formView.data);
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
	     		   report.icStaffCount = reportDataObject.icStaff.count;
	    		   this.setReportData(reportDataObject.icStaff.array, report.icStaffCount, 'ic', report);
	    		   
	    		   report.intelCount = reportDataObject.intel.count;
	    		   this.setReportData(reportDataObject.intel.array, report.intelCount, 'intel', report);              
		    	  
	    		   report.agencyRepsCount = reportDataObject.agencyReps.count;
	    		   if (reportDataObject.agencyReps.array.length > 0){
		    		   for(var i=1; i<=reportDataObject.agencyReps.array.length; i++){
		                	 var agencyRow  = reportDataObject.agencyReps.array[i-1];
		                	 if (agencyRow[0]) report['agencyRep' + i] = agencyRow[0];
							 if (agencyRow[1]) report['contactRep' + i] = agencyRow[1];
	    	 
		                }
		    		   }         
		    	   
		    	   report.logisticsCount = reportDataObject.logistics.count;
		    	   this.setReportData(reportDataObject.logistics.array, report.logisticsCount, 'logistics', report);              
			    	  
		    	   report.logisticsSptCount = reportDataObject.logisticsSpt.count;
		    	   this.setReportData(reportDataObject.logisticsSpt.array, report.logisticsSptCount, 'logisticsSpt', report);              
			    	  
		    	   report.logisticsSrvCount = reportDataObject.logisticsSrv.count;
		    	   this.setReportData(reportDataObject.logisticsSrv.array, report.logisticsSrvCount, 'logisticsSrv', report);              
			    	  
		    	   report.opsCount = reportDataObject.ops.count;
		    	   this.setReportData(reportDataObject.ops.array, report.opsCount, 'ops', report);              
			    	  
		    	   report.opsBranchCount = reportDataObject.opsBranch.count;
		    	   this.setReportData(reportDataObject.opsBranch.array, report.opsBranchCount, 'opsBranch', report);              
			    	  
		    	   report.opsBBranchCount = reportDataObject.opsBBranch.count;
		    	   this.setReportData(reportDataObject.opsBBranch.array, report.opsBBranchCount, 'opsBBranch', report);              
			    	  
		    	   report.opsCBranchCount = reportDataObject.opsCBranch.count;
		    	   this.setReportData(reportDataObject.opsCBranch.array, report.opsCBranchCount, 'opsCBranch', report);              
			    	  
		    	   report.opsAirBranchCount = reportDataObject.opsAirBranch.count;
		    	   this.setReportData(reportDataObject.opsAirBranch.array, report.opsAirBranchCount, 'opsAirBranch', report);              
			    	  
		    	   report.financeCount = reportDataObject.finance.count;
		    	   this.setReportData(reportDataObject.finance.array, report.financeCount, 'finance', report);              
			    	  
		    	   report.resourceCount = reportDataObject.resource.count;
		    	   if (reportDataObject.resource.array.length > 0){
		    		   for(var i=1; i<=reportDataObject.resource.array.length; i++){
		                	 var resourceRow  = reportDataObject.resource.array[i-1];
		                	  if (resourceRow[0]) report['resourceName' + i] = resourceRow[0];
		                	 if (resourceRow[1]) report['resourceId' + i] = resourceRow[1];
							 if (resourceRow[2]) report['resourceDatetime' + i] = resourceRow[2];
							 if (resourceRow[3]) report['resourceETA' + i] = resourceRow[3];
							 if (resourceRow[4]) report['resourceOS' + i] = resourceRow[4];
							 if (resourceRow[5]) report['resourceNotes' + i] = resourceRow[5];
								
	    	 
		                }
		    		   } 
	    		  
	    		   
	    		   
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
						formView.data.incidentId, '201');
	    		
				
	    		   var topic = Ext.String.format("iweb.NICS.incident.{0}.report.{1}.#", formView.data.incidentId, '201');
				
	    		   this.mediator.sendPostMessage(url, topic, form);
	    		   this.setFormReadOnly();
	    		   this.newTopic = Ext.String.format(
						"iweb.NICS.incident.{0}.report.{1}.new", form.incidentid,
						'201');
	    		   Core.EventManager.fireEvent(this.newTopic);
				
	    		   message.report.incidentId = formView.data.incidentId;
	    		   message.report.incidentName = formView.data.incidentName;
		    	},
		    	buildReport: function(data){	
		    	
		    		var report = this.buildDataArray(data);
			    	var reportText=null;
					reportText  = '<table width="1000" border="3" cellpadding="0" cellspacing="0"><tbody> <tr><td>';
					reportText += '<table width="1000" border="2" cellpadding="0" cellspacing="0"><tbody><tr><td>';
					reportText += '<table width="250" border="0"> <tbody>';
					reportText += '<tr><td width="250" >1. Incident Name</td> </tr>';
					reportText += '<tr><td>' + data.incidentName + '</td></tr> </tbody></table></td>';
					reportText += '<td><table width="460" border="0"><tbody><tr> <td width="230">2. Prepared by: (name)</td>';
	                reportText += '<td width="150" colspan="3">' + data.reportBy + '</td></tr>';
	                reportText += '<tr><td width="230">Date:</td>';
	                reportText += '<td>' + this.formatDate(data.date) + '</td>';
	                reportText += '<td>Time:</td>';
	                reportText += '<td>' + this.formatTime(data.starttime) + '</td></tr></tbody></table></td>';
	                reportText += '<td><table width="200" border="0"><tbody> <tr>';
	                reportText += '<td width="200" align="right">INCIDENT BRIEFING</td></tr>';
	                reportText += '<tr> <td align="right" >ICS 201-CG</td>';
	                reportText += '</tr></tbody></table></td>';
	                reportText += ' </tr></tbody></table>';
	                reportText += '<table width="1000" border="2" cellpadding="0" cellspacing="0">';
		            reportText += '<tbody><tr>';
	                reportText += '<td width="500" >3. Map/Sketch: (indicate which NICS room)</td>';
	                reportText += '<td>'+ data.colllabroom + '</td>';
	                reportText += '</tr></tbody></table>';
	                reportText += '<table width="1000" border="2" cellspacing="0" cellpadding="0"><tbody><tr>';
	                reportText += '<td align="left" valign="top"><label for="CurrentSituation">4. Current Situation:</td>';
	                reportText += '</tr><tr>';
	                reportText += '<td>'+ data.sitrep + '</td>';
	                reportText += '</tr></tbody></table>';
	                reportText += '<table width="1000" border="2" cellspacing="0" cellpadding="0"><tbody><tr>';
	                reportText += '<td align="left" valign="top">5. Initial Response Objectives, Current Actions, Planned Actions</td>';
	                reportText += '</tr><tr>';
	                reportText += '<td>' +data.initResponse + '</textarea></td>';
	                reportText += '</tr></tbody></table>';
	               // Start of the Current Org list tables 
	                reportText += '<table width="1000" border="2" cellpadding="0" cellspacing="0"><tbody><tr>';
	                reportText += '<td>6. Current Organization (fill in additional appropriate organization)</td></tr>';
	                reportText += '<tr valign="top"><td><table border="1" cellspacing="0" cellpadding="0"><tbody>';
	                reportText += '<tr>';
	                reportText += '<td width="500">Incident Commander(s) and Staff';
	                reportText += '<table bgcolor="#F5F5F5" width="450" border="1" cellspacing="0" cellpadding="0"><tbody>';
	                reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
	                if (report.icStaff.array.length > 0)reportText += this.printContactRows(report.icStaff.array);   
	                reportText += '</tbody></table>';
	                
	                reportText += '<br/>Agency Representatives';
	                reportText += '<table bgcolor="#F5F5F5" width="450" border="1" cellspacing="0" cellpadding="0"><tbody>';
	                reportText += '<tr><td>Agency</td><td>Name / Contact Info</td></tr>';
	                if (report.agencyReps.array.length > 0)reportText += this.printContactRows(report.agencyReps.array);
	                reportText += '</tbody></table>';
	                
	                reportText += '<br>Planning/INTEL Section';
	                reportText += '<table bgcolor="#B6C5F5" width="450" border="1" cellspacing="0" cellpadding="0"><tbody>';
	                reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
	                if (report.intel.array.length > 0)reportText += this.printContactRows(report.intel.array);
	                reportText += '</tbody> </table>';
	                
	                reportText += '<br/>Logistics Section';
	                reportText += '<table bgcolor="#EEE486" width="450" border="1" cellspacing="0" cellpadding="0"><tbody>';
	                reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
	                if (report.logistics.array.length > 0)reportText += this.printContactRows(report.logistics.array);
	                
	                
	                reportText += '<tr><td colspan="3">Support Branch</td></tr>';
	                reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
	                if (report.logisticsSpt.array.length > 0)reportText += this.printContactRows(report.logisticsSpt.array);
	                
	                reportText += '<tr><td colspan="3">Service Branch</td></tr>';
	                reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
	                if (report.logisticsSrv.array.length > 0)reportText += this.printContactRows(report.logisticsSrv.array);
	                
	                reportText += '</tbody> </table></td>';
	                //end if left column
	                reportText += '<td width="500" valign="top">Operation Section';
	                reportText += '<table bgcolor="#FFBDBD" width="450" border="1" cellspacing="0" cellpadding="0"><tbody>';
	                reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
		            if (report.ops.array.length > 0)reportText += this.printContactRows(report.ops.array);
		            
	                reportText += '<tr><td colspan="3">Branch - Division Groups</td></tr>';
	                reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
	                if (report.opsBranch.array.length > 0)reportText += this.printContactRows(report.opsBranch.array);
	                
	                if (report.opsBBranch.array.length > 0){
	                	reportText += '<tr><td colspan="3">Branch - Division Groups</td></tr>';
	                	reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
		                reportText += this.printContactRows(report.opsBBranch.array);
		                
	                }
	                
	                if (report.opsCBranch.array.length > 0){
	                	reportText += '<tr><td colspan="3">Branch - Division Groups</td></tr>';
	                	reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
	                	reportText += this.printContactRows(report.opsCBranch.array);
	                }
	                if (report.opsAirBranch.array.length > 0){
	                	reportText += '<tr><td colspan="3">Air Operations Branch</td></tr>';
	                	reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
	                	reportText += this.printContactRows(report.opsAirBranch.array);
	                }
	                
	                reportText += '</tbody> </table>';
	                
	                reportText += '<br/>Finance Section';
	                reportText += '<table bgcolor="#8FCC72" width="450" border="1" cellspacing="0" cellpadding="0"><tbody>';
	                reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
                	if (report.finance.array.length > 0)reportText += this.printContactRows(report.finance.array);
	                reportText += '</tbody></table></td>';
	                reportText += '</tr></tbody> </table><td>';
	                reportText += '</tr></tbody> </table>';
	                reportText += '<table width="1000" border="2" cellpadding="0" cellspacing="0"><tbody>';
	                reportText += '<tr><td>7. Resources Summary</td</tr>';
	                reportText += '<tr><td><table border="1" cellpadding="0" cellspacing="0"><tbody>';
	                reportText += '<tr><td width="180" valign="bottom">Resource</td>';
	                reportText += '<td width="180" align="center" valign="bottom">Resource Identifier</td>';
	                reportText += '<td width="170" align="center" valign="bottom">Date Time Ordered</td>';
	                reportText += '<td width="170" align="center" valign="bottom">ETA</td>';
	                reportText += '<td width="50" align="center" valign="bottom">On-Scene (X)</td>';
	                reportText += '<td width="250" align="center" valign="bottom">NOTES: (Location/Assignmnet/Status)</td></tr>';
	                if (report.resource.array.length > 0)reportText += this.printResourceRows(report.resource.array);
		               
	                
	                reportText += '</tbody> </table></td>';
	                reportText += '</tr></tbody> </table>';
		               
	                reportText += '<table width="1000" border="2" cellpadding="0" cellspacing="0">';
	                reportText += '<tbody><tr><td><table width="500" border="0"><tbody>';
	                reportText += '<tr><td  >8. Prepared By:</td></tr>';
	                reportText += '<tr><td>' + data.reportBy + '</td></tr>';
	                reportText += '</tbody></table></td>';
	                reportText += '<td><table border="0"><tbody>';
	                reportText += '<tr><td >Date/Time:</td></tr>';
	                reportText += '<tr><td>' + this.formatDate(data.date) +  this.formatTime(data.starttime) + '</td></tr>';
	                reportText += '</tbody></table></td>';
	                reportText += '</tr></tbody></table>';
	                reportText += '	</td></tr></tbody></table>'; //end of outer table
	                reportText += "</html></body >"; 
				    Core.EventManager.fireEvent("PrintReport201",reportText);
				    
				},
				
		
			
		});
});