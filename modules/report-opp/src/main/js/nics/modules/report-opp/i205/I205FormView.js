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
define(['iweb/CoreModule', './I205FormController', './I205FormViewModel' , 'iweb/core/FormVTypes'],
       
function(Core, I205FormController, I205FormViewModel ) {

	return Ext.define('modules.report-opp.I205FormView', {
		extend: 'Ext.form.Panel',
		
	 	controller: 'i205formcontroller',
	 	 viewModel: {
		       type: 'i205'
		    },
		   
	 	buttonAlign: 'center',
	 	autoHeight: true,
	 	defaults: { padding:'5'},
		reference: "i205ReportForm",
		title: 'INCIDENT RADIO COMMUNICATIONS PLAN 205-CG',
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
	    	          { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', defaults: {anchor: '100%', vtype:'alphanum'},
		 			items:[
		 			       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', anchor: '50%',defaults:{labelAlign:'top'},
		 			    	   items:[ {bind: '{incidentName}',vtype:'simplealphanum',fieldLabel: 'Incident Name*', allowBlank:false,cls:'ics-required'}, ]
		 			       },
		 			      { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', fieldLabel:'Operation Period ',labelAlign:'top',anchor: '50%',
		 			    	   items:[ {bind: '{date}',xtype: 'datefield',fieldLabel: 'From*',labelWidth:40,format: 'm/d/y',cls:'ics-required',allowBlank:false,width:130,padding:'0 0 0 5'},
		 			    	           {bind: '{starttime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',width:60},
  				 	    	 	    	{bind: '{enddate}',xtype: 'datefield',fieldLabel: 'To*',labelWidth:40,format: 'm/d/y',cls:'ics-required',allowBlank:false,padding:'0 0 0 5',width:130},
  				 	    	 	    	{bind: '{endtime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',width:60},
  				 	    	 	     ]
		 			       },
		 			      {xtype: 'hiddenfield', bind: '{incidentId}'},
			       		  {xtype: 'hiddenfield', bind:'{formTypeId}' },
			       		  {xtype: 'hiddenfield', bind:'{seqnum}' },
			       		  {xtype: 'hiddenfield', bind:'{i201seqnum}' },
			       		  {xtype: 'hiddenfield', bind: '{incidentId}'},
			       		  {xtype: 'hiddenfield', bind: '{channelsCount}'},
			     		  {xtype: 'hiddenfield', bind: '{commlistCount}'},
			       		  {xtype: 'hiddenfield', bind: '{formVersion}', value:'205'}
				    	          		 
				    	
	                  ]
	    	          },
	          
		 		    	
	             ]
	         
	    },
	   

	    { xtype: 'fieldset',
  	    	defaultType: 'textfield',
  	    	reference: 'channels205',
  	    	id: 'channelsFS',
  	    	title:'3. Basic Radio Channel Use',
  	    	componentCls:'channels',
  	    	cls:'i205FS',
  	    	 items:[ 
  	    	      { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'channels205Chbx',cls:'i205',submitValue:false,
    	  	    	  listeners: {'change':  {fn:'addRows', section:'channels'}}
    	  	      },
    	  	    { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
	  	    	    	 defaults: {vtype:'simplealphanum',flex:10},
	  	    	    	 items:[ {bind: '{channel1}',fieldLabel: 'Ch#',labelAlign:'top'},
	  	    	    	         {bind: '{function1}',fieldLabel: 'Function',labelAlign:'top',cls:'ics-required'},
	  	    	    	         {bind: '{chName1}',fieldLabel: 'Name/Talkgroup',labelAlign:'top'},
	  	    	    	         {bind: '{assignment1}',fieldLabel: 'Assignment',labelAlign:'top'},
	  	    	    	         {bind: '{rxFreq1}',fieldLabel: 'RX Freq N or W',labelAlign:'top'},
		  	    	    	     {bind: '{rxTone1}',fieldLabel: 'RX Tone/NAC',labelAlign:'top'},
		  	    	    	     {bind: '{txFreq1}',fieldLabel: 'TX Freq N or W',labelAlign:'top'},
		  	    	    	     {bind: '{txTone1}',fieldLabel: 'TX Tone/NAC',labelAlign:'top'},
		  	    	    	     {bind: '{mode1}',fieldLabel: 'Model (A, D or M)',labelAlign:'top'},
		  	    	    	     {bind: '{remarks1}',fieldLabel: 'Remarks',labelAlign:'top'},
		  	    	    	   ]
		  	    	       },
		  	    	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
				  	     defaults: {vtype:'simplealphanum',flex:10},
				  	     items:[ {bind: '{channel2}'},
	  	    	    	         {bind: '{function2}'},
	  	    	    	         {bind: '{chName2}'},
	  	    	    	         {bind: '{assignment2}'},
	  	    	    	         {bind: '{rxFreq2}'},
		  	    	    	     {bind: '{rxTone2}'},
		  	    	    	     {bind: '{txFreq2}'},
		  	    	    	     {bind: '{txTone2}'},
		  	    	    	     {bind: '{mode2}'},
		  	    	    	     {bind: '{remarks2}'}
				  	           ]
				  	   },    
				  	 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	     defaults: {vtype:'simplealphanum',flex:4},
					  	     items:[  {bind: '{channel3}'},
			  	    	    	         {bind: '{function3}'},
			  	    	    	         {bind: '{chName3}'},
			  	    	    	         {bind: '{assignment3}'},
			  	    	    	         {bind: '{rxFreq3}'},
				  	    	    	     {bind: '{rxTone3}'},
				  	    	    	     {bind: '{txFreq3}'},
				  	    	    	     {bind: '{txTone3}'},
				  	    	    	     {bind: '{mode3}'},
				  	    	    	     {bind: '{remarks3}'}
					  	           ]
					  	   },      
				  	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
						 defaults: {vtype:'simplealphanum',flex:4},
						 items:[  {bind: '{channel4}'},
		  	    	    	         {bind: '{function4}'},
		  	    	    	         {bind: '{chName4}'},
		  	    	    	         {bind: '{assignment4}'},
		  	    	    	         {bind: '{rxFreq4}'},
			  	    	    	     {bind: '{rxTone4}'},
			  	    	    	     {bind: '{txFreq4}'},
			  	    	    	     {bind: '{txTone4}'},
			  	    	    	     {bind: '{mode4}'},
			  	    	    	     {bind: '{remarks4}'}
						       ]
					   },    
					   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	     defaults: {vtype:'simplealphanum',flex:10},
					  	     items:[ {bind: '{channel5}'},
		  	    	    	         {bind: '{function5}'},
		  	    	    	         {bind: '{chName5}'},
		  	    	    	         {bind: '{assignment5}'},
		  	    	    	         {bind: '{rxFreq5}'},
			  	    	    	     {bind: '{rxTone5}'},
			  	    	    	     {bind: '{txFreq5}'},
			  	    	    	     {bind: '{txTone5}'},
			  	    	    	     {bind: '{mode5}'},
			  	    	    	     {bind: '{remarks5}'}
					  	           ]
					  	   },    
					  	 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
						  	     defaults: {vtype:'simplealphanum',flex:4},
						  	     items:[  {bind: '{channel6}'},
				  	    	    	         {bind: '{function6}'},
				  	    	    	         {bind: '{chName6}'},
				  	    	    	         {bind: '{assignment6}'},
				  	    	    	         {bind: '{rxFreq6}'},
					  	    	    	     {bind: '{rxTone6}'},
					  	    	    	     {bind: '{txFreq6}'},
					  	    	    	     {bind: '{txTone6}'},
					  	    	    	     {bind: '{mode6}'},
					  	    	    	     {bind: '{remarks6}'}
						  	           ]
						  	   },      
					  	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
							 defaults: {vtype:'simplealphanum',flex:4},
							 items:[  {bind: '{channel7}'},
			  	    	    	         {bind: '{function7}'},
			  	    	    	         {bind: '{chName7}'},
			  	    	    	         {bind: '{assignment7}'},
			  	    	    	         {bind: '{rxFreq7}'},
				  	    	    	     {bind: '{rxTone7}'},
				  	    	    	     {bind: '{txFreq7}'},
				  	    	    	     {bind: '{txTone7}'},
				  	    	    	     {bind: '{mode7}'},
				  	    	    	     {bind: '{remarks7}'}
							       ]
						   },
						   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
						  	     defaults: {vtype:'simplealphanum',flex:10},
						  	     items:[ {bind: '{channel8}'},
			  	    	    	         {bind: '{function8}'},
			  	    	    	         {bind: '{chName8}'},
			  	    	    	         {bind: '{assignment8}'},
			  	    	    	         {bind: '{rxFreq8}'},
				  	    	    	     {bind: '{rxTone8}'},
				  	    	    	     {bind: '{txFreq8}'},
				  	    	    	     {bind: '{txTone8}'},
				  	    	    	     {bind: '{mode8}'},
				  	    	    	     {bind: '{remarks8}'}
						  	           ]
						  	   },    
						  	 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
							  	     defaults: {vtype:'simplealphanum',flex:4},
							  	     items:[  {bind: '{channel9}'},
					  	    	    	         {bind: '{function9}'},
					  	    	    	         {bind: '{chName9}'},
					  	    	    	         {bind: '{assignment9}'},
					  	    	    	         {bind: '{rxFreq9}'},
						  	    	    	     {bind: '{rxTone9}'},
						  	    	    	     {bind: '{txFreq9}'},
						  	    	    	     {bind: '{txTone9}'},
						  	    	    	     {bind: '{mode9}'},
						  	    	    	     {bind: '{remarks9}'}
							  	           ]
							  	   },      
						  	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								 defaults: {vtype:'simplealphanum',flex:4},
								 items:[  {bind: '{channel10}'},
				  	    	    	         {bind: '{function10}'},
				  	    	    	         {bind: '{chName10}'},
				  	    	    	         {bind: '{assignment10}'},
				  	    	    	         {bind: '{rxFreq10}'},
					  	    	    	     {bind: '{rxTone10}'},
					  	    	    	     {bind: '{txFreq10}'},
					  	    	    	     {bind: '{txTone10}'},
					  	    	    	     {bind: '{mode10}'},
					  	    	    	     {bind: '{remarks10}'}
								       ]
							   },    
       	      ]
      	      
     	 },
     	
 	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield',
			 items:[{bind:'{reportBy}',vtype:'simplealphanum',fieldLabel: '5. Prepared By', anchor:'60%',allowBlank:false,cls:'ics-required'},
			        {bind: '{prepdate}',xtype: 'datefield',fieldLabel: 'Date/Time*',labelWidth:60,format: 'm/d/y',cls:'ics-required',allowBlank:false,width:130,padding:'0 0 0 5'},
			        {bind: '{preptime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',width:60},
			        ]
		 },
 	   { xtype: 'displayfield',
 	     value: 'The convention calls for frequency lists to show four digits after the decimal place, followed by either an â€œNâ€? or a â€œWâ€?, depending on whether the frequency is narrow or wide band. Mode refers to either â€œAâ€? or â€œDâ€? indicating analog or digital (e.g. Project 25) or "M" indicating mixed mode. All channels are shown as if programmed in a control station, mobile or portable radio. Repeater and base stations must be programmed with the Rx and Tx reversed.'
 	    },
		{xtype: 'fieldset',
 	     defaultType: 'textfield',
		 items:[
		        {xtype: 'displayfield',value: 'COMMUNICATIONS LIST'},
		        {xtype: 'displayfield',value: 'ICS 205A-CG (ICS 205 Supplement A'},
								    {  xtype: 'fieldset',
								    	defaultType: 'textfield',
								    	reference: 'commlist205',
								    	id: 'commlistFS',
								    	componentCls:'commlist',
								    	cls:'i205FS',
							  	    	 items:[ 
								    	        { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'commlist205Chbx',cls:'i205',submitValue:false,
								    	        		listeners: {'change': {fn:'addRows', section:'commlist'}}
								    	        },
								    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								    	    	 defaults: {vtype:'simplealphanum',flex:4},
								    	    	 
								    	    	items:[ {bind: '{commsAssignment1}',fieldLabel: 'Assignment',labelAlign:'top',cls:'ics-required'},
								    	    	         {bind: '{commsName1}',fieldLabel: ' Name',labelAlign:'top'},
								    	    	         {bind: '{commsPhone1}',fieldLabel: 'Method(s) of contact (radio freq, phone, pager, cell, etc)',labelAlign:'top'}
										    	    	    
								    	    	   ]
								    	       },
								    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								    	    	 defaults: {vtype:'simplealphanum',flex:4},
								    	    	 
								    	    	items:[ {bind: '{commsAssignment2}'},
								    	    	         {bind: '{commsName2}'},
								    	    	         {bind: '{commsPhone2}'}
										    	    	    
								    	    	   ]
								    	       }
								    	       ,
								    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								    	    	 defaults: {vtype:'simplealphanum',flex:4},
								    	    	 
								    	    	items:[ {bind: '{commsAssignment3}'},
								    	    	         {bind: '{commsName3}'},
								    	    	         {bind: '{commsPhone3}'}
										    	    	    
								    	    	   ]
								    	       }
								    	       ,
								    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								    	    	 defaults: {vtype:'simplealphanum',flex:4},
								    	    	 
								    	    	items:[ {bind: '{commsAssignment4}'},
								    	    	         {bind: '{commsName4}'},
								    	    	         {bind: '{commsPhone4}'}
										    	    	    
								    	    	   ]
								    	       }
								    	       ,
								    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								    	    	 defaults: {vtype:'simplealphanum',flex:4},
								    	    	 
								    	    	items:[ {bind: '{commsAssignment5}'},
								    	    	         {bind: '{commsName5}'},
								    	    	         {bind: '{commsPhone5}'}
										    	    	    
								    	    	   ]
								    	       }
								   	      ]
									      
									},
									
							       
						         ]
					      
						},

						
						
		          

			   
	    {  xtype: 'fieldset',
			defaultType: 'textfield',
			items:
				[
				 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield',
					 items:[{bind:'{reportBy}',vtype:'simplealphanum',fieldLabel: '10. Prepared By', anchor:'60%',allowBlank:false,cls:'ics-required'},
					        {bind: '{prepdate}',xtype: 'datefield',fieldLabel: 'Date/Time*',labelWidth:80,format: 'm/d/y',cls:'ics-required',allowBlank:false,width:130,padding:'0 0 0 5'},
					        {bind: '{preptime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',width:60},
					        ]
				 },
				 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield',
					 items:[{bind:'{pscReviewBy}',vtype:'simplealphanum',fieldLabel: '11. Reviewed By (PSC)', anchor:'60%',cls:'ics-required'},
					        {bind: '{pscReviewdate}',xtype: 'datefield',fieldLabel: 'Date/Time*',labelWidth:80,format: 'm/d/y',width:130,padding:'0 0 0 5',cls:'ics-required'},
					        {bind: '{pscReviewtime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,width:60},
					        ]
				 },
				 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield',
					 items:[{bind:'{oscReviewBy}',vtype:'simplealphanum',fieldLabel: 'Reviewed By (OSC)', anchor:'60%'},
					        {bind: '{opscReviewdate}',xtype: 'datefield',fieldLabel: 'Date/Time*',labelWidth:80,format: 'm/d/y',width:130,padding:'0 0 0 5'},
					        {bind: '{opscReviewtime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,width:60},
					        ]
				 },
				 ]
	    },
	    
	
	 ] ,
	 buttons: [
	{
		text: 'Submit',
		reference: 'submitButton205',
	    handler: 'submitForm',
	     formBind: true, //only enabled once the form is valid
	     disabled: true
	},{
		text: 'Reset',
		reference: 'resetButton205',
		handler: 'clearForm'
	},{
		text: 'Cancel',
		reference: 'cancelButton205',
		handler: 'cancelForm'
	}]
		 	
	 	
	});
});
