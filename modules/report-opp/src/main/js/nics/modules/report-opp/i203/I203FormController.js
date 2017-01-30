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
define(['iweb/CoreModule', "nics/modules/UserProfileModule",'../AbstractFormController',  './I203ReportView',  './I203FormView','./I203FormViewModel'],

	function(Core, UserProfile, AbstractFormController, I203ReportView, I203FormView , I203FormViewModel ){
		
	
		Ext.define('modules.report-opp.I203FormController', {

			extend : 'modules.report-opp.AbstractFormController',
			
			alias: 'controller.i203formcontroller',
			init : function(args) {
				
				this.mediator = Core.Mediator.getInstance();
				this.callParent();
				
				
			},
						
			onJoinIncident: function(e, incident) {
				
				this.getView().enable();		
			},
			

			setFormReadOnly: function () {
				if (this.view.enabled)
			    	this.view.getForm().getFields().each (function (field) {
			    		field.setReadOnly(true);
			    	});
			    	this.view.lookupReference('submitButton203').hide();
			    	this.view.lookupReference('cancelButton203').hide();
			    	this.view.lookupReference('resetButton203').hide();
			    	Ext.ComponentQuery.query('checkbox[cls=i201]').forEach(function(checkbox) {
			    		checkbox.hide();
			    	});
			    	
			    	if (Ext.getCmp('print203')) Ext.getCmp('print203').enable();
			    	if (Ext.getCmp('final203')) Ext.getCmp('final203').enable(); 
			    	if (Ext.getCmp('view203'))  Ext.getCmp('view203').enable(); 
			    },
	    	cancelForm: function(){

	    		Core.EventManager.fireEvent("CancelReport203", 'cancelForm');
		    		
	    	},
	    	cancelImport: function(){
	    		Core.EventManager.fireEvent("CancelReport203", 'cancelImport');
		    		
	    	},
	    	
	    	
			
		   
			
		    addRows: function (e, t, eOpts, args) {
		    	addCheckbox = this.view.lookupReference(args.section + '203Chbx');
				if (addCheckbox.getValue()){
					//Stop all events so that we can change the state of the checkbox without triggering the change event
					//Be careful with it. Don't forget resume events!
					addCheckbox.suspendEvents(false);    
					addCheckbox.setValue(false); 
					addCheckbox.resumeEvents();
								
					var currentFieldset = this.view.lookupReference(args.section + '203');
					//Get the count of the current items.  This is one greater than the number of actual items, 
					//because of the 'add' box, so use this for the first new item  
					var firstNewItem = currentFieldset.items.length;
					this.addFieldContainer('203',args.section, firstNewItem, 1);
					
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
	    		
	    		var branchBCheckbox = this.view.lookupReference('opsBBranch203')
	    		if (branchBCheckbox.collapsed){
	    			branchBCheckbox.hide()
	    		}
	    		else {
	    			branchBCheckbox.show()
	    		}
	    		//Check for collapsed sections
	    		//var checkedBoxes = Ext.ComponentQuery.query('checkbox[cls=i201][checked^=true]')
	    		
	    		var formView = this.view.viewModel;
	    		
	    		var reportDataObject = this.buildDataArray(formView.data);
	    		//Check for deleted data
	    		//var checkedBoxes = Ext.ComponentQuery.query('checkbox[cls=i201][checked^=true]')
	    		
	    		//create the report from the data
	    		for (item in formView.data){
    			   //Don't capture the buttons, checkboxes or the incident name and id in the report
    			   var buttonRE = /button$/i;
    			   var checkboxRE = /chbx$/i;
	    			   if (item != 'incidentId' && item != 'incidentName' && !(buttonRE.test(item)) &&  !(checkboxRE.test(item)) )
	    					{
		    					//Figure out how many values have been added for the various contact list fields
		    					if ( /.*([0-9]+)$/.test(item)){
		    							//don't do anything for the contact info
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
			    	  

		    	   
	    		   message.report = report;
	    		   
	    		
	    		
	    	
	    		   var time = Core.Util.formatDateToString(new Date());
		           message.datecreated = time; 
		           //Populate form properties
		           form.seqtime = new Date().getTime();
	    		   form.incidentid = formView.data.incidentId;
	    		   form.incidentname = formView.data.incidentName;
	    		   form.formtypeid = formView.data.formTypeId;
	    		   form.usersessionid = UserProfile.getUserSessionId();
	    		   form.distributed = false;
	    		   form.seqnum = formView.data.seqnum;
	    		   form.message = JSON.stringify(message);
	    		
	    		   var url = Ext.String.format('{0}/reports/{1}/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						formView.data.incidentId, '203');
	    		
				
	    		   var topic = Ext.String.format("iweb.NICS.incident.{0}.report.{1}.#", formView.data.incidentId, '203');
				
	    		   this.mediator.sendPostMessage(url, topic, form);
	    		   this.setFormReadOnly();
	    		   this.newTopic = Ext.String.format(
						"iweb.NICS.incident.{0}.report.{1}.new", form.incidentid,
						'203');
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
					reportText += '<td><table width="460" border="0"><tbody><tr> <td width="230" colspan="2">2. Operational Period</td></tr>';
	                reportText += '<tr><td width="230">From: ' + this.formatDate(data.date) + " " + this.formatTime(data.starttime) + '</td>';
	                reportText += '<td width="230">To: ' + this.formatDate(data.enddate) + " " + this.formatTime(data.endtime) + '</td>';
	                reportText += '</tr></tbody></table></td>';
	                reportText += '<td><table width="200" border="0"><tbody> <tr>';
	                reportText += '<td width="200" align="right">ORGANIZATION ASSIGNMENT LIST</td></tr>';
	                reportText += '<tr> <td align="right" >ICS 203-CG</td>';
	                reportText += '</tr></tbody></table></td>';
	                reportText += ' </tr></tbody></table>';
	                
	               // Start of the Current Org list tables 
	                reportText += '<table width="1000" border="2" cellpadding="0" cellspacing="0"><tbody><tr>';
	                reportText += '<tr valign="top"><td><table border="1" cellspacing="0" cellpadding="0"><tbody>';
	                reportText += '<tr>';
	                reportText += '<td width="500">3. Incident Commander(s) and Staff';
	                reportText += '<table bgcolor="#F5F5F5" width="450" border="1" cellspacing="0" cellpadding="0"><tbody>';
	                reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
	                if (report.icStaff.array.length > 0)reportText += this.printContactRows(report.icStaff.array);   
	                reportText += '</tbody></table>';
	                
	                reportText += '<br/>4. Agency Representatives';
	                reportText += '<table bgcolor="#F5F5F5" width="450" border="1" cellspacing="0" cellpadding="0"><tbody>';
	                reportText += '<tr><td>Agency</td><td>Name / Contact Info</td></tr>';
	                if (report.agencyReps.array.length > 0)reportText += this.printContactRows(report.agencyReps.array);
	                reportText += '</tbody></table>';
	                
	                reportText += '<br>5. Planning/INTEL Section';
	                reportText += '<table bgcolor="#B6C5F5" width="450" border="1" cellspacing="0" cellpadding="0"><tbody>';
	                reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
	                if (report.intel.array.length > 0)reportText += this.printContactRows(report.intel.array);
	                reportText += '</tbody> </table>';
	                
	                reportText += '<br/>6. Logistics Section';
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
	                reportText += '<td width="500" valign="top">7. Operation Section';
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
	                
	                reportText += '<br/>8. Finance Section';
	                reportText += '<table bgcolor="#8FCC72" width="450" border="1" cellspacing="0" cellpadding="0"><tbody>';
	                reportText += '<tr><td>Agency</td><td>Position</td><td>Name / Contact Info</td></tr>';
                	if (report.finance.array.length > 0)reportText += this.printContactRows(report.finance.array);
	                reportText += '</tbody></table></td>';
	                reportText += '</tr></tbody> </table><td>';
	                reportText += '</tr></tbody> </table>';
	                reportText += '<table width="1000" border="2" cellpadding="0" cellspacing="0">';
	                reportText += '<tbody><tr><td><table width="500" border="0"><tbody>';
	                reportText += '<tr><td  >9. Prepared By:</td></tr>';
	                reportText += '<tr><td>' + data.reportBy + '</td></tr>';
	                reportText += '</tbody></table></td>';
	                reportText += '<td><table border="0"><tbody>';
	                reportText += '<tr><td >Date/Time:</td></tr>';
	                reportText += '<tr><td>' + this.formatDate(data.prepdate) + ' ' + this.formatTime(data.preptime) + '</td></tr>';
	                reportText += '</tbody></table></td>';
	                reportText += '</tr></tbody></table>';
	                reportText += '	</td></tr></tbody></table>'; //end of outer table
	                reportText += "</html></body >"; 
				    Core.EventManager.fireEvent("PrintReport201",reportText);
				    
				},
				

			
		});
});