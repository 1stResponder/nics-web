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
define(['iweb/CoreModule', './I204FormController', './I204FormViewModel' , 'iweb/core/FormVTypes'],
       
function(Core, I204FormController, I204FormViewModel ) {

	return Ext.define('modules.report-opp.I204FormView', {
		extend: 'Ext.form.Panel',
		
	 	controller: 'i204formcontroller',
	 	 viewModel: {
		       type: 'i204'
		    },
		   
	 	buttonAlign: 'center',
	 	autoHeight: true,
	 	defaults: { padding:'5'},
		reference: "i204ReportForm",
		title: 'Assignment List ICS 204-CG',
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
		 			       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', anchor: '40%',defaults:{labelAlign:'top'},
		 			    	   items:[ {bind: '{incidentName}',vtype:'simplealphanum',fieldLabel: 'Incident Name*', allowBlank:false,cls:'ics-required'},
		 			    	           
	 
		 			    	           ]
		 			       },
		 			      { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', fieldLabel:'Operation Period ',labelAlign:'top',anchor: '59%',
		 			    	   items:[ {bind: '{date}',xtype: 'datefield',fieldLabel: 'From*',labelWidth:40,format: 'm/d/y',cls:'ics-required',allowBlank:false,width:130,padding:'0 0 0 5'},
  				 	    	 	   {bind: '{starttime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',width:60},
  				 	    	 	    {bind: '{enddate}',xtype: 'datefield',fieldLabel: 'To*',labelWidth:40,format: 'm/d/y',cls:'ics-required',allowBlank:false,padding:'0 0 0 5',width:130},
  				 	    	 	   {bind: '{endtime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',width:60},
  				 	    	 	 
	 
		 			    	           ]
		 			       },
		 			     
    				    	
				 	    	 	          
	 	          {xtype: 'hiddenfield', bind: '{enddate, endtime, }'},
       		  {xtype: 'hiddenfield', bind:'{formTypeId}' },
       		  {xtype: 'hiddenfield', bind:'{seqnum}' },
       		  {xtype: 'hiddenfield', bind: '{incidentId}'},
       		  {xtype: 'hiddenfield', bind: '{taskCount}'},
     		  {xtype: 'hiddenfield', bind: '{commsCount}'},
     		 
       		 {xtype: 'hiddenfield', bind: '{formVersion}', value:'204'}
				    	          		 
				    	
	             ]
	          },
	          { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', defaults: {anchor: '100%', vtype:'alphanum',labelAlign:'top',},
		 			items:[ {bind: '{branch}',fieldLabel: '3. Branch',labelWidth:40},
				 	    	 {bind: '{divgroupstaging}',fieldLabel: '4. Division/Group/Staging*', allowBlank:false,cls:'ics-required'},
				 	    	   ]
		     },
	             ]
	         
	    },
	   
			    	        
						  { xtype: 'fieldset',
						  defaultType: 'textfield',
				         defaults: {
				             anchor: '100%'
				         },
				         title: '5. Operations Personnel',
				  	    	items:[ 
				  	    	        
				  	    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
				  	    	    	 defaults: {vtype:'simplealphanum',flex:4},
				  	    	    	 items:[ {value: 'Operations Section Chief:',xtype:'displayfield',fieldLabel:'  ',labelSeparator:' ',labelAlign:'top'},
				  	    	    	         {bind: '{opsChiefName}',fieldLabel: 'Name',labelAlign:'top'},
				  	    	    	         {bind: '{opsChiefAgency}',fieldLabel: 'Agency',labelAlign:'top'},
				  	    	    	         {bind: '{opsChiefContact}',fieldLabel: 'Contact#(s)*',labelAlign:'top'}
				  	    	    	       ]
				  	    	       },
				  	    	     { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	    	    	 defaults: {vtype:'simplealphanum',flex:4},
					  	    	    	 items:[ {value: 'Deputy Operations Section Chief:',xtype:'displayfield'},
					  	    	    	         {bind: '{depOpsChiefName}'},
					  	    	    	         {bind: '{depOpsChiefAgency}'},
					  	    	    	         {bind: '{depOpsChiefContact}'}
					  	    	    	       ]
					  	    	       },
					  	    	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
							  	     defaults: {vtype:'simplealphanum',flex:4},
							  	     items:[  {value: 'Branch Director:',xtype:'displayfield'},
							  	              {bind: '{branchName}'},
							  	    	      {bind: '{branchAgency}'},
							  	    	      {bind: '{branchContact}'}
							  	           ]
							  	   },    
							  	 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								  	     defaults: {vtype:'simplealphanum',flex:4},
								  	     items:[  {value: 'Deputy Branch Director:',xtype:'displayfield'},
								  	              {bind: '{depBranchName}'},
								  	    	      {bind: '{depBranchAgency}'},
								  	    	      {bind: '{depBranchContact}'}
								  	           ]
								  	   },      
							  	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
									 defaults: {vtype:'simplealphanum',flex:4},
									 items:[  {value: 'Division/Group Supervisor/STAM:',xtype:'displayfield'},
									          {bind: '{stamName}'},
										  	  {bind: '{stamAgency}'},
									  	      {bind: '{stamContact}'}
									       ]
								   },    



					  	    	   ]
				      	      
					    },
					    { xtype: 'fieldset',
				  	    	defaultType: 'textfield',
				  	    	reference: 'tasklist204',
				  	    	id: 'tasklistFS',
				  	    	 defaults: {
					             anchor: '100%',
					             
					         },
				  	    	componentCls:'tasklist',
				  	    	cls:'i204FS',
				  	    	 items:[ 
				  	    	      { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'tasklist204Chbx',cls:'i204',submitValue:false,
				    	  	    	  listeners: {'change':  {fn:'addRows', section:'tasklist'}}
				    	  	      },
				  	    	      { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
				  	    	    	defaults: {vtype:'simplealphanum'},
				  	    	    	items:[ {bind: '{resourceId1}',fieldLabel: 'Strike Team/TF/Res. ID',labelAlign:'top',labelString:'width:100;',flex:6},
				  	    	    	        {bind: '{leader1}',fieldLabel: 'Leader',labelAlign:'top',cls:'ics-required',flex:6},
				  	    	    	        {bind: '{contactInfo1}',fieldLabel: 'Contact Info #',labelAlign:'top',flex:6},
				  	    	    	        {bind: '{numPersons1}',fieldLabel: '# of Persons',labelAlign:'top',flex:6},
				  	    	    	        {bind: '{notes1}',fieldLabel: 'Reporting Info/Notes',labelAlign:'top',flex:6},
				  	    	    	        {bind: '{hasMato1}',xtype:'checkbox',fieldLabel: 'Has 204a',labelAlign:'top'},
				  	    	    	        {xtype: 'hiddenfield', bind: '{matoId1}'}
				  	    	    	      ]
				  	    	      },
				  	    	      { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	    	    defaults: {vtype:'simplealphanum'},
					  	    	    items:[ {bind: '{resourceId2}',flex:6},
				  	    	    	        {bind: '{leader2}',flex:6},
				  	    	    	        {bind: '{contactInfo2}',flex:6},
				  	    	    	        {bind: '{numPersons2}',flex:6},
				  	    	    	        {bind: '{notes2}',flex:6},
				  	    	    	        {bind: '{hasMato2}',xtype:'checkbox',width:'61px',uncheckedValue: 0},
				  	    	    	        {xtype: 'hiddenfield', bind: '{matoId2}'}
				  	    	    	      ]
				  	    	      },
				  	    	      { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	    	    defaults: {vtype:'simplealphanum'},
					  	    	    items:[ {bind: '{resourceId3}',flex:6},
				  	    	    	        {bind: '{leader3}',flex:6},
				  	    	    	        {bind: '{contactInfo3}',flex:6},
				  	    	    	        {bind: '{numPersons3}',flex:6},
				  	    	    	        {bind: '{notes3}',flex:6},
				  	    	    	        {bind: '{hasMato3}',xtype:'checkbox',width:'61px',uncheckedValue: 0},
				  	    	    	        {xtype: 'hiddenfield', bind: '{matoId3}'}
				  	    	    	      ]
				  	    	      },
				  	    	    { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	    	    defaults: {vtype:'simplealphanum' },
					  	    	    items:[ {bind: '{resourceId4}',flex:6},
				  	    	    	        {bind: '{leader4}',flex:6},
				  	    	    	        {bind: '{contactInfo4}',flex:6},
				  	    	    	        {bind: '{numPersons4}',flex:6},
				  	    	    	        {bind: '{notes4}',flex:6},
				  	    	    	        {bind: '{hasMato4}',xtype:'checkbox',width:'61px',uncheckedValue: 0},
				  	    	    	        {xtype: 'hiddenfield', bind: '{matoId4}'}
				  	    	    	      ]
				  	    	      },
				  	    	    { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	    	    defaults: {vtype:'simplealphanum'},
					  	    	    items:[ {bind: '{resourceId5}',flex:6},
				  	    	    	        {bind: '{leader5}',flex:6},
				  	    	    	        {bind: '{contactInfo5}',flex:6},
				  	    	    	        {bind: '{numPersons5}',flex:6},
				  	    	    	        {bind: '{notes5}',flex:6},
				  	    	    	        {bind: '{hasMato5}',xtype:'checkbox',width:'61px',uncheckedValue: 0},
				  	    	    	        {xtype: 'hiddenfield', bind: '{matoId5}'}
				  	    	    	      ]
				  	    	      },
				  	    	      { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	    	    defaults: {vtype:'simplealphanum' },
					  	    	    items:[ {bind: '{resourceId6}',flex:6},
				  	    	    	        {bind: '{leader6}',flex:6},
				  	    	    	        {bind: '{contactInfo6}',flex:6},
				  	    	    	        {bind: '{numPersons6}',flex:6},
				  	    	    	        {bind: '{notes6}',flex:6},
				  	    	    	        {bind: '{hasMato6}',xtype:'checkbox',width:'61px',uncheckedValue: 0},
				  	    	    	        {xtype: 'hiddenfield', bind: '{matoId6}'}
				  	    	    	      ]
				  	    	      },
				  	    	    { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	    	    defaults: {vtype:'simplealphanum'},
					  	    	    items:[ {bind: '{resourceId7}' ,flex:6},
				  	    	    	        {bind: '{leader7}' ,flex:6},
				  	    	    	        {bind: '{contactInfo7}' ,flex:6},
				  	    	    	        {bind: '{numPersons7}' ,flex:6},
				  	    	    	        {bind: '{notes7}' ,flex:6},
				  	    	    	        {bind: '{hasMato7}',xtype:'checkbox',width:'61px',uncheckedValue: 0},
				  	    	    	        {xtype: 'hiddenfield', bind: '{matoId7}'}
				  	    	    	      ]
				  	    	      },
				  	    	      { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	    	    defaults: {vtype:'simplealphanum'},
					  	    	    items:[ {bind: '{resourceId8}', flex:6},
				  	    	    	        {bind: '{leader8}', flex:6},
				  	    	    	        {bind: '{contactInfo8}', flex:6},
				  	    	    	        {bind: '{numPersons8}', flex:6},
				  	    	    	        {bind: '{notes8}', flex:6},
				  	    	    	        {bind: '{hasMato8}',xtype:'checkbox',width:'61px',uncheckedValue: 0},
				  	    	    	        {xtype: 'hiddenfield', bind: '{matoId8}'}
				  	    	    	      ]
				  	    	      },
				  	    	      { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	    	    defaults: {vtype:'simplealphanum'},
					  	    	    items:[ {bind: '{resourceId9}',flex:6},
				  	    	    	        {bind: '{leader9}',flex:6},
				  	    	    	        {bind: '{contactInfo9}',flex:6},
				  	    	    	        {bind: '{numPersons9}',flex:6},
				  	    	    	        {bind: '{notes9}',flex:6},
				  	    	    	        {bind: '{hasMato9}',xtype:'checkbox',width:'61px',uncheckedValue: 0},
				  	    	    	        {xtype: 'hiddenfield', bind: '{matoId9}'}
				  	    	    	      ]
				  	    	      },
				  	    	    { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	    	    defaults: {vtype:'simplealphanum' },
					  	    	    items:[ {bind: '{resourceId10}',flex:6},
				  	    	    	        {bind: '{leader10}',flex:6},
				  	    	    	        {bind: '{contactInfo10}',flex:6},
				  	    	    	        {bind: '{numPersons10}',flex:6},
				  	    	    	        {bind: '{notes10}',flex:6},
				  	    	    	        {bind: '{hasMato10}',xtype:'checkbox',width:'61px',uncheckedValue: 0},
				  	    	    	        {xtype: 'hiddenfield', bind: '{matoId10}'}
				  	    	    	      ]
				  	    	      },
				       	      ]
				      	      
				     	 },
				   	     {  xtype: 'fieldset',
					    	defaultType: 'textarea',
					    	 items:[ 
									{ xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
										    defaults: {vtype:'simplealphanum', },
										    items:[ {bind: '{latitude}',fieldLabel:'Latitude',paddding:'0 5px 0 5px'},
									  	        {bind: '{longitude}',fieldLabel:'Longitude',paddding:'0 0 0 5px'}
									  	      ]
									    },
					    	        {bind: '{workAssignments}',fieldLabel: '7. Work Assignments',labelAlign:'top', anchor:'100%',height:200},
					    	    	{bind: '{specialInstructions}',fieldLabel: '8. Special Instructions',labelAlign:'top',anchor:'100%',height:200},
				       	      ]
				  	      
					    },
					    {  xtype: 'fieldset',
							defaultType: 'textfield',
							title: '9. Communications (radio and/or phone contact numbers needed for this assignment)',
							items:[ 
								    {  xtype: 'fieldset',
								    	defaultType: 'textfield',
								    	reference: 'comms204',
								    	id: 'commsFS',
								    	componentCls:'comms',
								    	cls:'i204FS',
							  	    	 items:[ 
								    	        { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'comms204Chbx',cls:'i204',submitValue:false,
								    	        		listeners: {'change': {fn:'addRows', section:'comms'}}
								    	        },
								    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								    	    	 defaults: {vtype:'simplealphanum',flex:4},
								    	    	 
								    	    	items:[ {bind: '{commsAssignment1}',fieldLabel: 'Assignment',labelAlign:'top',cls:'ics-required'},
								    	    	         {bind: '{commsChannel1}',fieldLabel: 'Channel Name',labelAlign:'top'},
								    	    	         {bind: '{commsFreq1}',fieldLabel: 'Frequency(Tx)',labelAlign:'top'},
								    	    	         {bind: '{commsPhone1}',fieldLabel: 'Phone',labelAlign:'top'}
										    	    	    
								    	    	   ]
								    	       },
								    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								    	    	 defaults: {vtype:'simplealphanum',flex:4},
								    	    	 
								    	    	items:[ {bind: '{commsAssignment2}'},
								    	    	         {bind: '{commsChannel2}'},
								    	    	         {bind: '{commsFreq2}'},
								    	    	         {bind: '{commsPhone2}'}
										    	    	    
								    	    	   ]
								    	       }
								    	       ,
								    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								    	    	 defaults: {vtype:'simplealphanum',flex:4},
								    	    	 
								    	    	items:[ {bind: '{commsAssignment3}'},
								    	    	         {bind: '{commsChannel3}'},
								    	    	         {bind: '{commsFreq3}'},
								    	    	         {bind: '{commsPhone3}'}
										    	    	    
								    	    	   ]
								    	       }
								    	       ,
								    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								    	    	 defaults: {vtype:'simplealphanum',flex:4},
								    	    	 
								    	    	items:[ {bind: '{commsAssignment4}'},
								    	    	         {bind: '{commsChannel4}'},
								    	    	         {bind: '{commsFreq4}'},
								    	    	         {bind: '{commsPhone4}'}
										    	    	    
								    	    	   ]
								    	       }
								    	       ,
								    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								    	    	 defaults: {vtype:'simplealphanum',flex:4},
								    	    	 
								    	    	items:[ {bind: '{commsAssignment5}'},
								    	    	         {bind: '{commsChannel5}'},
								    	    	         {bind: '{commsFreq5}'},
								    	    	         {bind: '{commsPhone5}'}
										    	    	    
								    	    	   ]
								    	       }
								   	      ]
									      
									},
									{value: 'Emergency Communications:',xtype:'displayfield'},
							         
							       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
							    	   defaults: {vtype:'simplealphanum',flex:3},
						    	 
							    	   items:[
							    	           {bind: '{commsMedical}',fieldLabel: 'Medical:',},
							    	           {bind: '{commsEvac}',fieldLabel: 'Evacuation:'},
							    	           {bind: '{commsOther}',fieldLabel: 'Other:'}
						    	    
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
					        {bind: '{prepdate}',xtype: 'datefield',fieldLabel: 'Date/Time*',labelWidth:40,format: 'm/d/y',cls:'ics-required',allowBlank:false,width:130,padding:'0 0 0 5'},
					        {bind: '{preptime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',width:60},
					        ]
				 },
				 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield',
					 items:[{bind:'{pscReviewBy}',vtype:'simplealphanum',fieldLabel: '11. Reviewed By (PSC)', anchor:'60%',cls:'ics-required'},
					        {bind: '{pscReviewdate}',xtype: 'datefield',fieldLabel: 'Date/Time*',cls:'ics-required',labelWidth:40,format: 'm/d/y',width:130,padding:'0 0 0 5'},
					        {bind: '{pscReviewtime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,width:60},
					        ]
				 },
				 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield',
					 items:[{bind:'{oscReviewBy}',vtype:'simplealphanum',fieldLabel: 'Reviewed By (OSC)', anchor:'60%'},
					        {bind: '{opscReviewdate}',xtype: 'datefield',fieldLabel: 'Date/Time*',labelWidth:40,format: 'm/d/y',width:130,padding:'0 0 0 5'},
					        {bind: '{opscReviewtime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,width:60},
					        ]
				 },
				 ]
	    }
	
	 ] ,
	 buttons: [
	{
		text: 'Submit',
		reference: 'submitButton204',
	    handler: 'submitForm',
	     formBind: true, //only enabled once the form is valid
	     disabled: true
	},{
		text: 'Reset',
		reference: 'resetButton204',
		handler: 'clearForm'
	},{
		text: 'Cancel',
		reference: 'cancelButton204',
		handler: 'cancelForm'
	}]
		 	
	 	
	});
});
