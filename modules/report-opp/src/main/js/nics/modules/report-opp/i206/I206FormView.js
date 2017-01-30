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
define(['iweb/CoreModule', './I206FormController', './I206FormViewModel' , 'iweb/core/FormVTypes'],
       
function(Core, I206FormController, I206FormViewModel ) {

	return Ext.define('modules.report-opp.I206FormView', {
		extend: 'Ext.form.Panel',
		
	 	controller: 'i206formcontroller',
	 	 viewModel: {
		       type: 'i206'
		    },
		   
	 	buttonAlign: 'center',
	 	autoHeight: true,
	 	defaults: { padding:'5'},
		reference: "i206ReportForm",
		title: 'MEDICAL PLAN ICS 206-CG',
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
		 			    	   items:[ {bind: '{incidentName}',vtype:'simplealphanum',fieldLabel: '1. Incident Name*', allowBlank:false,cls:'ics-required'}, ]
		 			       },
		 			      { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', fieldLabel:'2. Operation Period ',labelAlign:'top',anchor: '50%',
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
			       		  {xtype: 'hiddenfield', bind: '{medicalCount}'},
			       		 {xtype: 'hiddenfield', bind: '{transportCount}'},
			       		 {xtype: 'hiddenfield', bind: '{hospitalCount}'},
			       		  {xtype: 'hiddenfield', bind: '{formVersion}', value:'206'}
				    	          		 
				    	
	                  ]
	    	          },
	          
		 		    	
	             ]
	         
	    },
	   

	    { xtype: 'fieldset',
  	    	defaultType: 'textfield',
  	    	reference: 'medical206',
  	    	id: 'medicalFS',
  	    	title:'3. Medical Aid Stations',
  	    	componentCls:'medical',
  	    	cls:'i206FS',
  	    	 items:[ 
  	    	      { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'medical206Chbx',cls:'i206',submitValue:false,
    	  	    	  listeners: {'change':  {fn:'addRows', section:'medical'}}
    	  	      },
    	  	  { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
	  	    	    	 defaults: {vtype:'simplealphanum',flex:4},
	  	    	    	 items:[ {bind: '{medName1}',fieldLabel: 'Name',labelAlign:'top',cls:'ics-required'},
	  	    	    	         {bind: '{medLocation1}',fieldLabel: 'Location',labelAlign:'top'},
	  	    	    	         {bind: '{medContact1}',fieldLabel: 'Contact #',labelAlign:'top'},
	  	    	    	         {bind: '{medParamedic1}',fieldLabel: 'Paramedics Onsite (Y/N)',labelAlign:'top'},

	  	    	    	        
		  	    	    	   ]
		  	    	       },
		  	    	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
				  	     defaults: {vtype:'simplealphanum',flex:4},
				  	     items:[  {bind: '{medName2}'},
		  	    	    	      {bind: '{medLocation2}'},
		  	    	    	      {bind: '{medContact2}'},
		  	    	    	      {bind: '{medParamedic2}'},

				  	           ]
				  	   },    
				  	 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
				  		 defaults: {vtype:'simplealphanum',flex:4},
				  	     items:[  {bind: '{medName3}'},
		  	    	    	      {bind: '{medLocation3}'},
		  	    	    	      {bind: '{medContact3}'},
		  	    	    	      {bind: '{medParamedic3}'},

				  	           ]
					  	   },      
				  	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  		 defaults: {vtype:'simplealphanum',flex:4},
					  	     items:[  {bind: '{medName4}'},
			  	    	    	      {bind: '{medLocation4}'},
			  	    	    	      {bind: '{medContact4}'},
			  	    	    	      {bind: '{medParamedic4}'},

					  	           ]
					   },    
       	      ]
      	      
     	 }, 
    	{ xtype: 'fieldset',
   	    	defaultType: 'textfield',
   	    	reference: 'transport206',
   	    	id: 'transportFS',
   	    	title:'4. Transportation',
   	    	componentCls:'transport',
   	    	cls:'i206FS',
   	    	 items:[ 
   	    	      { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'transport206Chbx',cls:'i206',submitValue:false,
     	  	    	  listeners: {'change':  {fn:'addRows', section:'transport'}}
     	  	      },
     	  	    { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
 	  	    	    	 defaults: {vtype:'simplealphanum',flex:4},
 	  	    	    	 items:[ {bind: '{trspName1}',fieldLabel: 'Ambulance Service',labelAlign:'top',cls:'ics-required'},
 	  	    	    	         {bind: '{trspLocation1}',fieldLabel: 'Address',labelAlign:'top'},
 	  	    	    	         {bind: '{trspContact1}',fieldLabel: 'Contact #',labelAlign:'top'},
 	  	    	    	         {bind: '{trspParamedic1}',fieldLabel: 'Paramedics On board (Y/N)',labelAlign:'top'},

 	  	    	    	        
 		  	    	    	   ]
 		  	    	       },
 		  	    	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
 				  	     defaults: {vtype:'simplealphanum',flex:4},
 				  	     items:[  {bind: '{trspName2}'},
 		  	    	    	      {bind: '{trspLocation2}'},
 		  	    	    	      {bind: '{trspContact2}'},
 		  	    	    	      {bind: '{trspParamedic2}'},

 				  	           ]
 				  	   },    
 				  	 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
 				  		 defaults: {vtype:'simplealphanum',flex:4},
 				  	     items:[  {bind: '{trspName3}'},
 		  	    	    	      {bind: '{trspLocation3}'},
 		  	    	    	      {bind: '{trspContact3}'},
 		  	    	    	      {bind: '{trspParamedic3}'},

 				  	           ]
 					  	   },      
 				  	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
 					  		 defaults: {vtype:'simplealphanum',flex:4},
 					  	     items:[  {bind: '{trspName4}'},
 			  	    	    	      {bind: '{trspLocation4}'},
 			  	    	    	      {bind: '{trspContact4}'},
 			  	    	    	      {bind: '{trspParamedic4}'},

 					  	           ]
 					   },    
        	      ]
       	      
      	 },
     	{ xtype: 'fieldset',
    	    	defaultType: 'textfield',
    	    	reference: 'hospital206',
    	    	id: 'hospitalFS',
    	    	title:'5. Hospital',
    	    	componentCls:'hospital',
    	    	cls:'i206FS',
    	    	 items:[ 
    	    	      { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'hospital206Chbx',cls:'i206',submitValue:false,
      	  	    	  listeners: {'change':  {fn:'addRows', section:'hospital'}}
      	  	      },
    	    	     { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
  	  	    	    	 defaults: {vtype:'simplealphanum',flex:8},
  	  	    	    	 items:[ {bind: '{hospName1}',fieldLabel: 'Hospital',labelAlign:'top',cls:'ics-required'},

  	  	    	    	         {bind: '{hospLocation1}',fieldLabel: 'Address',labelAlign:'top'},
  	  	    	    	         {bind: '{hospContact1}',fieldLabel: 'Contact #',labelAlign:'top'},
  	  	    	    	         {bind: '{hospAirTime1}',fieldLabel: 'Travel Time (Air)',labelAlign:'top'},
  	  	    	    	         {bind: '{hospGndTime1}',fieldLabel: 'Travel Time (Ground)',labelAlign:'top'},
  	  	    	    	         {bind: '{hospBurn1}',fieldLabel: 'Burn Center',labelAlign:'top'},
	  	    	    	         {bind: '{hospHeli1}',fieldLabel: 'Helipad',labelAlign:'top'},
  	  	    	    	        
  		  	    	    	   ]
  		  	    	       },
  		  	    	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
  				  	     defaults: {vtype:'simplealphanum',flex:8},
  				  	     items:[  {bind: '{hospName2}'},
  		  	    	    	      {bind: '{hospLocation2}'},

  		  	    	    	      {bind: '{hospContact2}'},
  		  	    	    	      {bind: '{hospAirTime2}'},
	  	    	    	          {bind: '{hospGndTime2}'},
	  	    	    	          {bind: '{hospBurn2}'},
	  	    	    	          {bind: '{hospHeli2}'},
  				  	           ]
  				  	   },    
  				  	 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
  				  		 defaults: {vtype:'simplealphanum',flex:8},
  				  	     items:[  {bind: '{hospName3}'},
  		  	    	    	      {bind: '{hospLocation3}'},
  		  	    	    	      {bind: '{hospContact3}'},
  		  	    	    	      {bind: '{hospAirTime3}'},
	  	    	    	          {bind: '{hospGndTime3}'},
	  	    	    	          {bind: '{hospBurn3}'},
	  	    	    	          {bind: '{hospHeli3}'},
 				  	           ]
  					  	   },      
  				  	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
  					  		 defaults: {vtype:'simplealphanum',flex:8},
  					  	     items:[  {bind: '{hospName4}'},
  			  	    	    	      {bind: '{hospLocation4}'},

  			  	    	    	      {bind: '{hospContact4}'},
  	  		  	    	    	      {bind: '{hospAirTime4}'},
  		  	    	    	          {bind: '{hospGndTime4}'},
  		  	    	    	          {bind: '{hospBurn4}'},
  		  	    	    	          {bind: '{hospHeli4}'},
  	   					  	           ]
  					   },    
         	      ]
        	      
       	 },
       	{  xtype: 'fieldset',
       		 defaultType: 'textarea',
		    	 items:[ 
						{bind: '{procedures}',fieldLabel: '6. Special Medical Emergency Procedures',labelAlign:'top', anchor:'100%',height:250},
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
						 items:[{bind:'{soReviewBy}',vtype:'simplealphanum',fieldLabel: '11. Reviewed By (PSC)', anchor:'60%'},
						        {bind: '{soReviewdate}',xtype: 'datefield',fieldLabel: 'Date/Time*',labelWidth:80,format: 'm/d/y',width:130,padding:'0 0 0 5'},
						        {bind: '{soReviewtime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,width:60},
						        ]
					 }
					 ]
		    }
 	  
		

	 ] ,
	 buttons: [
	{
		text: 'Submit',
		reference: 'submitButton206',
	    handler: 'submitForm',
	     formBind: true, //only enabled once the form is valid
	     disabled: true
	},{
		text: 'Reset',
		reference: 'resetButton206',
		handler: 'clearForm'
	},{
		text: 'Cancel',
		reference: 'cancelButton206',
		handler: 'cancelForm'
	}]
		 	
	 	
	});
});
