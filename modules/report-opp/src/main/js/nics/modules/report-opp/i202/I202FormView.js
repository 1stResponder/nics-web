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
define(['iweb/CoreModule', './I202FormController', './I202FormViewModel' , 'iweb/core/FormVTypes'],
       
function(Core, I202FormController, I202FormViewModel ) {

	return Ext.define('modules.report-opp.I202FormView', {
		extend: 'Ext.form.Panel',
		
	 	controller: 'i202formcontroller',
	 	 viewModel: {
		       type: 'i202'
		    },
		   
	 	buttonAlign: 'center',
	 	autoHeight: true,
	 	defaults: { padding:'5'},
		reference: "i202ReportForm",
		title: 'ICS 202-CG (with supplements)',
        defaultType: 'textfield',
        bodyPadding: 10,
		referenceHolder: true,
	    items:[
	       { 
	    	 xtype: 'fieldset',
	         title: 'Incident Info',
	         defaultType: 'textfield',
	         defaults: {
	             anchor: '100%'
	         },
	    	 items:[  {bind:'{reportType}',fieldLabel: 'Report Type',xtype:'displayfield'},
	    	          {xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', defaults: {anchor: '100%', vtype:'alphanum'},
		 					items:[
		 					       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', anchor: '40%',defaults:{labelAlign:'top'},
		 					    	   items:[ {bind: '{incidentName}',vtype:'simplealphanum',fieldLabel: 'Incident Name*', allowBlank:false,cls:'ics-required'}]
		 					       },
		 					       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', fieldLabel:'Operation Period ',labelAlign:'top',anchor: '59%',
		 					    	   items:[ {bind: '{date}',xtype: 'datefield',fieldLabel: 'From*',labelWidth:40,format: 'm/d/y',cls:'ics-required',allowBlank:false,width:130,padding:'0 0 0 5'},
		 					    	           {bind: '{starttime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',width:60},
		 					    	           {bind: '{enddate}',xtype: 'datefield',fieldLabel: 'To*',labelWidth:40,format: 'm/d/y',cls:'ics-required',allowBlank:false,padding:'0 0 0 5',width:130},
		 					    	           {bind: '{endtime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',width:60},
 			 			    	             ]
		 			               },
		 			              ]
	    	          },
			          {xtype: 'hiddenfield', bind: '{incidentId}'},
		       		  {xtype: 'hiddenfield', bind:'{formTypeId}' },
		       		  {xtype: 'hiddenfield', bind:'{seqnum}' },
		       		  {xtype: 'hiddenfield', bind:'{i201seqnum}' },
		       		  {xtype: 'hiddenfield', bind: '{incidentId}'},
		       		  {xtype: 'hiddenfield', bind: '{formVersion}', value:'202'}	
						    	          		 
				    	
	             ]
	         
	    },
	    {  xtype: 'fieldset',
			defaultType: 'textarea',
			 defaults: {
				 anchor: '100%', 
				 vtype:'extendedalphanum',
				 labelAlign:'top'},
			items:
				[
				  {bind: '{objectives}',fieldLabel: '3. Objective(s)*',labelWidth:40,cls:'ics-required',allowBlank:false,height:800},
				  {bind: '{emphasis}',fieldLabel: '4. Operational Period Command Emphasis (Safety Message, Priorities, Key Decisions/Directions)',height:640},
				  {bind: '{safetyPlan}',fieldLabel: 'Approved Site Safety Plan Located at:', xtype:'textfield',labelAlign:'left'},
				  { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield',
						 items:[{bind:'{reportBy}',vtype:'simplealphanum',fieldLabel: '5. Prepared By', anchor:'60%',allowBlank:false,cls:'ics-required'},
						        {bind: '{prepdate}',xtype: 'datefield',fieldLabel: 'Date/Time*',labelWidth:60,format: 'm/d/y',cls:'ics-required',allowBlank:false,width:130,padding:'0 5 0 5'},
						        {bind: '{preptime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',width:60},
						        ]
					 },
				 ]
	    },
	    
				 
		{ xtype: 'fieldset',
			  defaultType: 'textarea',
			  defaults: {
	             anchor: '100%',
	             labelAlign:'top',
	             vtype:'extendedalphanum',
			  },
	         title: 'Command Direction ICS 202A-CG (ICS 202 Supplement A)',
			 items:[ 
					  	    	        
	    	         {bind: '{decisions}',fieldLabel: '3a. Key Decisions and Procedures:'},
	    	         {bind: '{priorities}',fieldLabel: '4a. Priorities:'},
	    	         {bind: '{constraints}',fieldLabel: '5a.  Limitations and Constraints:'},
	    	       ]
		},		    	        
		{ xtype: 'fieldset',
		  defaultType: 'textarea',
		  defaults: {
             anchor: '100%',
             vtype:'extendedalphanum',
		  },
         title: 'Critical Information Requirements ICS 202B-CG (ICS 202 Suppliment B)',
		 items:
			 	[{bind: '{requirements}',fieldLabel: '3b.  Critical Information Requirements:',labelAlign:'top'}]
		  }
		
		] ,
	 buttons: [
	{
		text: 'Submit',
		reference: 'submitButton202',
	    handler: 'submitForm',
	     formBind: true, //only enabled once the form is valid
	     disabled: true
	},{
		text: 'Reset',
		reference: 'resetButton202',
		handler: 'clearForm'
	},{
		text: 'Cancel',
		reference: 'cancelButton202',
		handler: 'cancelForm'
	}]
		 	
	 	
	});
});
