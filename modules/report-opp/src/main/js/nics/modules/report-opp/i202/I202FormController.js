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
define(['iweb/CoreModule', "nics/modules/UserProfileModule",'../AbstractFormController', './I202ReportView',  './I202FormView','./I202FormViewModel'],

	function(Core, UserProfile, AbstractFormController, I202ReportView, I202FormView , I202FormViewModel ){
	
		
	
		Ext.define('modules.report-opp.I202FormController', {
			extend : 'modules.report-opp.AbstractFormController',
			
			alias: 'controller.i202formcontroller',
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
			    	this.view.lookupReference('submitButton202').hide();
			    	this.view.lookupReference('cancelButton202').hide();
			    	this.view.lookupReference('resetButton202').hide();
			    	Ext.ComponentQuery.query('checkbox[cls=i202]').forEach(function(checkbox) {
			    		checkbox.hide();
			    	});
			    	
			    		if (Ext.getCmp('print202'))  Ext.getCmp('print202').enable();
			    		if (Ext.getCmp('final202'))  Ext.getCmp('final202').enable(); 
			    		if (Ext.getCmp('view202'))   Ext.getCmp('view202').enable(); 
			    },
	    	cancelForm: function(){
	    		Core.EventManager.fireEvent("CancelReport202", 'cancelForm');
		    		
	    	},
	    	
	    	
			
	    	submitForm: function(){
	    		var form = {};
	    		var message = {};
	    		var report= {};
	    		
	    		var taskCount = 0;
	    		var commsCount = 0;
	    		
	    		
	    		var formView = this.view.viewModel;
	    		//create the report from the data
	    		for (item in formView.data){
	    			   //Don't capture the buttons, checkboxes or the incident name and id in the report
	    			   var buttonRE = /button$/i;
	    			   var checkboxRE = /Chbx$/i;
		    			  
	    			   if (item != 'incidentId' && item != 'incidentName' && !(buttonRE.test(item)) &&  !(checkboxRE.test(item)) )
	    					{
	    				   		report[item] = formView.data[item];
		    					
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
						formView.data.incidentId, '202');
	    		
				
	    		   var topic = Ext.String.format("iweb.NICS.incident.{0}.report.{1}.#", formView.data.incidentId, '202');
				
	    		   this.mediator.sendPostMessage(url, topic, form);
	    		   this.setFormReadOnly();
	    		   this.newTopic = Ext.String.format(
						"iweb.NICS.incident.{0}.report.{1}.new", form.incidentid,
						'202');
	    		   Core.EventManager.fireEvent(this.newTopic);
				
	    		   message.report.incidentId = formView.data.incidentId;
	    		   message.report.incidentName = formView.data.incidentName;
		    	},

		    	buildReport: function(data){	
		    	
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
	                reportText += '<td width="200" align="right">INCIDENT BRIEFING</td></tr>';
	                reportText += '<tr> <td align="right" >ICS 202-CG (with supplements)</td>';
	                reportText += '</tr></tbody></table></td>';
	                reportText += ' </tr></tbody></table>';
	                //end of header
	                reportText += '<table width="1000" border="2" cellpadding="0" cellspacing="0">';
		            reportText += '<tbody>';
	                reportText += '<tr><td >3. Objective(s) </td></tr>';
	                reportText += '<tr><td>';
	                if (data.objectives )reportText += data.objectives;
	                reportText += '</td><?tr>';
	                reportText += '</tr></tbody></table>';
	                reportText += '<table width="1000" border="2" cellspacing="0" cellpadding="0"><tbody><tr>';
	                reportText += '<td align="left" valign="top">4. Operational Period Command Emphasis (Safety Message, Priorities, Key Decisions/Directions)</td>';
	                reportText += '</tr>';
	                reportText += '<tr><td>';
	                if ( data.emphasis )reportText += data.emphasis;
	                reportText += '</td><?tr>'; 
	                reportText += '<tr><td>Approved Site Safety Plan Located at: '
	                if ( data.safetyPlan )reportText += data.safetyPlan;
	                reportText += ' </td>';         
	                reportText += '</tr></tbody></table>';
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
	                reportText += '<table width="1000" border="2" cellspacing="0" cellpadding="0"><tbody><tr>';
	                reportText += ' <td ><table align="center" border="0"><tbody>';
		            reportText += '<tr><td align="center" >Command Direction</td></tr>';
	                reportText += '<tr><td align="center">ICS 202A-CG (ICS 202 Supplement A)</td></tr>';
	                reportText += '</tbody></table></td>';
	                reportText += '</tr></tbody></table>';
	                reportText += '<table width="1000" border="2" cellpadding="0" cellspacing="0"><tbody>';
	                reportText += '<tr> <td align="left" valign="top">3a. Key Decisions and Procedures:</td></tr>';
	                reportText += '<tr><td>';
	                if (data.decisions )reportText += data.decisions;
	                reportText += '</td></tr>';
	                reportText += '</tbody> </table>';
	                reportText += '<table width="1000" border="2" cellpadding="0" cellspacing="0"><tbody>';
	                reportText += '<tr> <td align="left" valign="top">4a. Priorities:</td></tr>';
	                reportText += '<tr><td>';
	                if (data.priorities )reportText += data.priorities;
	                reportText += '</td></tr>';
	                reportText += '</tbody> </table>';
	                reportText += '<table width="1000" border="2" cellpadding="0" cellspacing="0"><tbody>';
	                reportText += '<tr> <td align="left" valign="top">5a. Limitations and Constraints:</td></tr>';
	                reportText += '<tr><td>';
	                if (data.constraints )reportText += data.constraints;
	                reportText += '</td></tr>';
	                reportText += '</tbody> </table>';
	                reportText += '<table width="1000" border="2" cellspacing="0" cellpadding="0"><tbody><tr>';
	                reportText += ' <td ><table align="center" border="0"><tbody>';
		            reportText += '<tr><td align="center" >Command Direction</td></tr>';
	                reportText += '<tr><td align="center">ICS 202A-CG (ICS 202 Supplement B)</td></tr>';
	                reportText += '</tbody></table></td>';
	                reportText += '</tr></tbody></table>';
	                reportText += '<table width="1000" border="2" cellpadding="0" cellspacing="0"><tbody>';
	                reportText += '<tr> <td align="left" valign="top">3b. Critical Information Requirements:</td></tr>';
	                 reportText += '<tr><td>';
	                if (data.requirements )reportText += data.requirements;
	                reportText += '</td></tr>';
	                reportText += '</tbody> </table>';
	                reportText += '	</td></tr></tbody></table>'; //end of outer table
	                reportText += "</html></body >"; 
				    Core.EventManager.fireEvent("PrintReport202",reportText);
				    
				},
				
		
			
		});
});