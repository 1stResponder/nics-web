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
define(['iweb/CoreModule', './I215FormController', './I215FormViewModel', 'nics/modules/report/common/FormVTypes'],
       
function(Core, I215FormController, I215FormViewModel ) {

	return Ext.define('modules.report-i215.I215FormView', {
		extend: 'Ext.form.Panel',
		
		
	 	controller: 'i215formcontroller',
	 	 viewModel: {
		       type: 'i215'
		    },
	 	buttonAlign: 'center',
	 	autoHeight: true,
	 	 defaults: { padding:'5'},
		reference: "I215ReportForm",
        title: 'ICS 215 Worksheet',
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
	    	 items:[  {xtype: 'hiddenfield',bind:'{formTypeId}' },
	    	          {bind:'{reportType}',fieldLabel: 'Report Type',xtype:'displayfield'},
	    	 	      {bind: '{incidentName}',vtype:'simplealphanum',fieldLabel: 'Incident Name*', flex:2,allowBlank:false,cls:'roc-required'},
	    	          {bind: '{preptime}',xtype: 'datefield',fieldLabel: 'Date and Time Prepared*',format: 'm/d/y H:i:m',cls:'roc-required',allowBlank:false},
		    	 	  
	    	]
	    },
	    { 
	    	 xtype: 'fieldset',
	         title: 'For Operational Period',
	         defaultType: 'textfield',
	         defaults: {
	             anchor: '100%'
	             
	         },
	    	 items:[   {bind: '{startdate}',xtype: 'datefield',fieldLabel: 'Date*',format: 'm/d/y',cls:'roc-required',allowBlank:false},
		    	 	   {bind: '{starttime}',xtype: 'timefield',fieldLabel: 'Start Time*',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'roc-required',
	 	        	listeners: {beforequery : function() { return false;  }}},
	 	        	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'checkboxfield', defaults: {anchor: '100%',cls:'roc-required', flex:1},
		    	          items:[  {bind:'{shiftLength12}',boxLabel: '12 hrs.',id: 'shiftLength12', inputValue:'12 hrs.'},
		    	                   {bind:'{shiftLength16}',boxLabel: '16 hrs.',id: 'shiftLength16', inputValue:'16 hrs.'},
		    	                   {bind:'{shiftLength24}',boxLabel: '24 hrs.',id: 'shiftLength24', inputValue:'24 hrs.'},
		    	                   {bind:'{shiftLengthMixed}',boxLabel: 'Mixed (see information below)',id: 'shiftLengthMixed', inputValue:'mixed', flex:2},
		    	           ]
		    	         }
	 	        	
	    	]
	    },
	    {
	    	xtype: 'fieldset',
	        defaultType: 'textfield',
	        defaults: {anchor: '100%', labelWidth:200,labelAlign:"left" },
	        items: [{bind:'{role}',vtype:'extendedalphanum',fieldLabel: 'Submitted by Incident Commander/Operations/Branch/Division/Group/ or Function*',allowBlank:false,cls:'roc-required'},
	                {bind:'{requestArrival}',fieldLabel: 'Requested Arrival Time*',xtype: 'datefield',format: 'm/d/y H:i:m',allowBlank:false,cls:'roc-required'},
	                {bind:'{reportingLocation}',vtype:'extendedalphanum',fieldLabel: 'Reporting Location*',allowBlank:false,cls:'roc-required'},
	                {bind:'{workAssignments}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Work Assignments*:',allowBlank:false,cls:'roc-required'},
	                {bind:'{specialInstructions}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Special Instructions'}
	        ]
	   },
	    
       {
	    	xtype: 'fieldset',
	    	title: 'Kinds and Types of Resources',
	    	defaultType: 'textfield',
	        defaults: {
	             anchor: '100%',vtype:'numbers',labelWidth:300,labelAlign:"left" 
	        },
	        items:[ 
	             {  xtype: 'fieldset',
	       	    	defaultType: 'textfield',
	       	    	defaults: {
	       	    		vtype:'numbers',labelWidth:300,labelAlign:"left"
	   	             },
	       	    	title: 'Overhead/Personnel',
	       	    	 items:[ {xtype:'displayfield', value:'Enter number needed and other instructions for specified operational period'},
	       	    	         {bind: '{opbd}',fieldLabel: 'Operations Branch Director (OPBD)'},
	       	    	         {bind:'{divs}',fieldLabel: 'Divison or Group Supervisor (DIVS)'},
	       	    	         {bind:'{tfld}',fieldLabel: 'Taskforce Leader (TFLD)'},
	       	    	         {bind:'{stam}',fieldLabel: 'Staging Area Manager (STAM)'},
	       	    	         {bind:'{fobs}',fieldLabel: 'Field Observer (FOBS)'},
	       	    	         {bind:'{dozb}',fieldLabel: 'Dozer Supervisor (DOZB)'},
	       	    	         {bind:'{hqts}',fieldLabel: 'Hired Equipment Supervisor (HQTS)'},
		       	    	     {xtype: 'fieldset',
	       		       	       defaultType: 'textfield',
	       		       	       defaults: {vtype:'numbers'},
	       		       	       title: 'Safety Officer',
	       		       	    	  items:[ {bind: '{sof2}',fieldLabel: 'Type 2 (SOF2)'},
	       		       	    	          {bind:'{sof3}',fieldLabel: 'Type 3 (SOF3)'}
	       	   	          	      ]
	       	    	         } , 
	       	    	         {xtype: 'fieldset',
		       		       	  defaultType: 'textfield',
		       		       	  defaults: {vtype:'numbers'},
		       		       	  title: 'Medical Support',
		       		       	  items:[ {bind: '{femt}',fieldLabel: 'Fire Line EMT (FEMT)'},
		       		       	    	  {bind:'{femp}',fieldLabel: 'Fire Line Paramedic (FEMP)'}
		       	   	          ]
		       	    	     } , 
		       	    	     {xtype: 'fieldset',
			       		      defaultType: 'textfield',
			       		      defaults: {vtype:'numbers' }, 
			       		      title: 'Fallers',
			       		      items:[ {bind: '{fela}',fieldLabel: 'Class A (FELA)'},
			       		              {bind: '{felb}',fieldLabel: 'Class B (FELB)'},
			       		       	      {bind: '{felc}',fieldLabel: 'Class C (FELC )'}
			       	   	          	]
			       	    	  } ,
			       	    	{bind:'{personnelPickup}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Requested Pick-Up time for 12 or 16 hr. resources',labelWidth:150,labelAlign:"left",anchor: '100%',},
			                {bind:'{personnelInfo}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Other Information',labelWidth:150,labelAlign:"left",anchor: '100%'}
			             ]
   	        	      
	        	},
	        	{  xtype: 'fieldset',
	       	    	defaultType: 'textfield',
	       	    	defaults: {labelAlign:"left"},
	       	    	title: 'Engines',
	       	    	 items:[ 
	       	    	     {xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', defaults: {vtype:'numbers'},
	       	    	    	   items:[ {bind: '{engineT1Single}',fieldLabel: 'Type 1 - Single'},
	       	    	    	           {bind: '{engineT1ST}',fieldLabel: 'Strike Team',padding:'0 0 0 5'}
	       	    	    	   ]
	       	    	       },
	       	    	    { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', defaults: {vtype:'numbers'},
	       	    	    	   items:[ {bind: '{engineT2Single}',fieldLabel: 'Type 2 - Single'},
	       	    	    	           {bind: '{engineT2ST}',fieldLabel: 'Strike Team',padding:'0 0 0 5'}
	       	    	    	   ]
	       	    	       },
	       	    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
	       	    	    	 defaults: {vtype:'numbers',labelWidth:80,labelAlign:"left",padding:'0 0 0 5'},
	       	    	    	 
	       	    	    	items:[ {bind: '{engineT3Single}',fieldLabel: 'Type 3-Single',maxLength:4,flex:2,padding:0},
	       	    	    	           {bind: '{engineT3ST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
	       	    	    	           {bind: '{engineT3FedSingle}',fieldLabel: 'Federal(16 hr)-Single',maxLength:4,labelWidth:120, flex:3},
	       	    	    	           {bind: '{engineT3FedST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
	       	    	    	           {bind: '{engine34x4}',fieldLabel: '4x4',maxLength:4, flex:1,labelWidth:20}
	       	    	    	   ]
	       	    	       }, 
	       	    	    { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
		       	    	    	 defaults: {vtype:'numbers',labelWidth:80,labelAlign:"left",padding:'0 0 0 5'},
		       	    	    	 
		       	    	    	items:[ {bind: '{engineT4Single}',fieldLabel: 'Type 4-Single',maxLength:4,flex:2,padding:0},
		       	    	    	           {bind: '{engineT4ST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
		       	    	    	           {bind: '{engineT4FedSingle}',fieldLabel: 'Federal(16 hr)-Single',maxLength:4,labelWidth:120, flex:3},
		       	    	    	           {bind: '{engineT4FedST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
		       	    	    	           {bind: '{engine44x4}',fieldLabel: '4x4',maxLength:4, flex:1,labelWidth:20}
		       	    	    	   ]
		       	    	 },
		       	    	 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
			       	       defaults: {vtype:'numbers',labelWidth:80,labelAlign:"left",padding:'0 0 0 5'},
			       	        items:[ {bind: '{engineT5Single}',fieldLabel: 'Type 5-Single',maxLength:4,flex:2,padding:0},
			       	    	    	{bind: '{engineT5ST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
			       	    	    	{bind: '{engineT5FedSingle}',fieldLabel: 'Federal(16 hr)-Single',maxLength:4,labelWidth:120, flex:3},
			       	    	    	{bind: '{engineT5FedST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
			       	    	    	 {bind: '{engine54x4}',fieldLabel: '4x4',maxLength:4, flex:1,labelWidth:20}
			       	    	    ]
			       	     },
			       	  { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					       	   defaults: {vtype:'numbers',labelWidth:80,labelAlign:"left",padding:'0 0 0 5'},
					       	    	    	 
					       	    items:[ {bind: '{engineT6Single}',fieldLabel: 'Type 6-Single',maxLength:4,flex:2,padding:0},
					       	    	    	           {bind: '{engineT6ST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
					       	    	    	           {bind: '{engineT6FedSingle}',fieldLabel: 'Federal(16 hr)-Single',maxLength:4,labelWidth:120, flex:3},
					       	    	    	           {bind: '{engineT6FedST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
					       	    	    	           {bind: '{engine64x4}',fieldLabel: '4x4',maxLength:4, flex:1,labelWidth:20}
					       	    	    	   ]
					   }, 
					    { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
						       	   defaults: {vtype:'numbers',labelWidth:80,labelAlign:"left",padding:'0 0 0 5'},
						       	    	    	 
						       	    items:[ {bind: '{engineT7Single}',fieldLabel: 'Type 7-Single',maxLength:4,flex:2,padding:0},
						       	         {bind: '{engineT7ST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
		       	    	    	         {bind: '{engineT7FedSingle}',fieldLabel: 'Federal(16 hr)-Single',maxLength:4,labelWidth:120, flex:3},
						       	    	 {bind: '{engineT7FedST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
						       	    	 {bind: '{engine74x4}',fieldLabel: '4x4',maxLength:4, flex:1,labelWidth:20}
						       	    	    	   ]
						}, 
			       	    {bind:'{enginePickup}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Requested Pick-Up time for 12 or 16 hr. resources',labelWidth:150,anchor: '100%',width:25},
			            {bind:'{engineInfo}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Other Information',labelWidth:150,anchor: '100%'}
			      ]
   	        	      
	        	},
	            {  xtype: 'fieldset',
	      	    	defaultType: 'textfield',
	      	    	title: 'Hand Crews',
	      	    	 items:[ 
	      	    	    
	      	    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
	      	    	    	 defaults: {vtype:'numbers',labelWidth:80,labelAlign:"left",padding:'0 0 0 5'},
	      	    	    	 
	      	    	    	items:[ {bind: '{handCrewT1Single}',fieldLabel: 'Type 1-Single',maxLength:4,flex:2,padding:0},
	      	    	    	           {bind: '{handCrewT1ST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
	      	    	    	           {bind: '{handCrewT1FedSingle}',fieldLabel: 'Federal(16 hr)-Single',maxLength:4,labelWidth:120, flex:3},
	      	    	    	           {bind: '{handCrewT1FedST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70}
	      	    	    	   ]
	      	    	       }, 
	      	    	    { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
	          	    	    	 defaults: {vtype:'numbers',labelWidth:80,labelAlign:"left",padding:'0 0 0 5'},
	          	    	    	 
	          	    	    	items:[ {bind: '{handCrewT2IASingle}',fieldLabel: 'Type 2 IA-Single',maxLength:4,flex:2,padding:0},
	          	    	    	        {bind: '{handCrewT2IAST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
	          	    	    	        {bind: '{handCrewT2IAFedSingle}',fieldLabel: 'Federal(16 hr)-Single',maxLength:4,labelWidth:120, flex:3},
	          	    	    	        {bind: '{handCrewT2IAFedST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70}
	          	    	    	   ]
	          	    	 },
	          	    	 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
	    	       	       defaults: {vtype:'numbers',labelWidth:80,labelAlign:"left",padding:'0 0 0 5'},
	    	       	        items:[ {bind: '{handCrewT2Single}',fieldLabel: 'Type 2-Single',maxLength:4,flex:2,padding:0},
	    	       	    	    	{bind: '{handCrewT2ST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
	    	       	    	    	{bind: '{handCrewT2FedSingle}',fieldLabel: 'Federal(16 hr)-Single',maxLength:4,labelWidth:120, flex:3},
	    	       	    	    	{bind: '{handCrewT2FedST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
	    	       	    	    ]
	    	       	     },
	    	       	   
	    	       	    	{bind:'{handCrewPickup}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Requested Pick-Up time for 12 or 16 hr. resources',labelWidth:150,labelAlign:"left",anchor: '100%'},
	    	                {bind:'{handCrewInfo}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Other Information',labelWidth:150,labelAlign:"left",anchor: '100%'}
	    	             ]
	          	      
	       	},
	      	{  xtype: 'fieldset',
      	    	defaultType: 'textfield',
      	    	defaults: {labelWidth:150,labelAlign:"left",anchor: '100%'},
      	    	title: 'Bulldozers',
      	    	 items:[ 
                       {xtype: 'displayfield',value:"Please ensure your \"12hr. & 24hr.\" resources match your total type ordered number"},
      	    	       {xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
      	    	    	 defaults: {vtype:'numbers',labelWidth:80,labelAlign:"left",padding:'0 0 0 1'},
      	    	    	 
      	    	    	items:[ {bind: '{dozerT1Single}',fieldLabel: 'Type 1-Single',maxLength:4,flex:2,padding:0},
      	    	    	        {bind: '{dozerT1ST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
      	    	    	        {bind: '{dozerT16Way}',fieldLabel: '6-way blade',maxLength:4,labelWidth:70, flex:2},
      	    	    	        {bind: '{dozerT1Rippers}',fieldLabel: 'Rippers',maxLength:4, flex:2,labelWidth:50},
      	    	    	        {bind: '{dozerT112}',fieldLabel: '12h',maxLength:4, flex:1,labelWidth:18},
      	    	    	        {bind: '{dozerT124}',fieldLabel: '24h',maxLength:4, flex:1,labelWidth:18}
      	    	    	   ]
      	    	       },
      	    	      {xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
          	    	     defaults: {vtype:'numbers',labelWidth:80,labelAlign:"left",padding:'0 0 0 1'},
          	    	     items:[ {bind: '{dozerT2Single}',fieldLabel: 'Type 2-Single',maxLength:4,flex:2,padding:0},
          	    	    	     {bind: '{dozerT2ST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
          	    	    	     {bind: '{dozerT26Way}',fieldLabel: '6-way blade',maxLength:4,labelWidth:70, flex:2},
          	    	    	     {bind: '{dozerT2Rippers}',fieldLabel: 'Rippers',maxLength:4, flex:2,labelWidth:50},
          	    	    	     {bind: '{dozerT212}',fieldLabel: '12h',maxLength:4, flex:1,labelWidth:18},
          	    	    	     {bind: '{dozerT224}',fieldLabel: '24h',maxLength:4, flex:1,labelWidth:18}
          	    	    ]
          	    	    	   
          	    	   },
          	    	 { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
                	    	 defaults: {vtype:'numbers',labelWidth:80,labelAlign:"left",padding:'0 0 0 1'},
                	    	 items:[ {bind: '{dozerT3Single}',fieldLabel: 'Type 3-Single',maxLength:4,flex:2,padding:0},
                	    	    	 {bind: '{dozerT3ST}',fieldLabel: 'Strike Team',maxLength:4, flex:2,labelWidth:70},
                	    	    	 {bind: '{dozerT36Way}',fieldLabel: '6-way blade',maxLength:4,labelWidth:70, flex:2},
                	    	    	 {bind: '{dozerT3Rippers}',fieldLabel: 'Rippers',maxLength:4, flex:2,labelWidth:50},
                	    	    	 {bind: '{dozerT312}',fieldLabel: '12h',maxLength:4, flex:1,labelWidth:18},
                	    	    	 {bind: '{dozerT324}',fieldLabel: '24h',maxLength:4, flex:1,labelWidth:18}
                	    	 ]
                	    	    	
                	  },
      	    	       
      	    	      	{bind:'{dozerPickup}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Requested Pick-Up time for 12 or 16 hr. resources',},
    	                {bind:'{dozerInfo}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Other Information',}
    	             ]
          	      
        	} , 
	       	{  xtype: 'fieldset',
      	    	defaultType: 'textfield',
      	    	title: 'Misc. Equiptment/Taskforces',
      	    	 items:[ 
      	    	        {  xtype: 'fieldset',
      	    	        	defaultType: 'textfield',
      	    	        	defaults: {labelWidth:150,labelAlign:"left",anchor: '100%' },
      	    	        	title: 'Water Tenders',
      	    	        	items:[ 
      	    	        	     {xtype: 'displayfield',value:"Please ensure your \"12hr. & 24hr.\" resources match your total type ordered number"},
    	    	        	       
      	    	        	     {  xtype: 'fieldset',
      	      	    	        	defaultType: 'textfield',
      	      	    	        	title: 'Tactical',
      	      	    	        	items:[
      	      	    	        	   {xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
         	        	    	        	defaults: {vtype:'numbers',labelAlign:"left",padding:'0 0 0 2' },
         	        	    	        	
         	        	    	        	items:[ 
         	        	    	        	       {bind: '{tacticalT1}',fieldLabel: 'T 1',maxLength:4,flex:1,padding:0,labelWidth:25},
         	        	    	        	       {bind: '{tacticalT14x4}',fieldLabel: '4x4',maxLength:4, flex:1,labelWidth:25},
         	        	    	        	       {bind: '{tacticalT1CAFS}',fieldLabel: 'CAFS',maxLength:4,labelWidth:30, flex:1},
         	        	    	        	       {bind: '{tacticalT1SprayBars}',fieldLabel: 'Spray Bars',maxLength:4, flex:2,labelWidth:70},
         	        	    	        	       {bind: '{tacticalT1Short}',fieldLabel: 'Sht Whl Base',maxLength:4, flex:2,labelWidth:80},
         	        	    	        	       {bind: '{tacticalT112}',fieldLabel: '12h',maxLength:4, flex:1,labelWidth:25},
         	        	    	        	       {bind: '{tacticalT124}',fieldLabel: '24h',maxLength:4, flex:1,labelWidth:25}   
         	        	    	        	     
         	        	    	        	]
         	  	      
         	        	    	       } ,
         	        	    	      {xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
        	        	    	        	defaults: {vtype:'numbers',labelAlign:"left",padding:'0 0 0 1' },
        	        	    	        	title: 'Tactical',
        	        	    	        	items:[ 
        	        	    	        	       {bind: '{tacticalT2}',fieldLabel: 'T 2',maxLength:4,flex:1,padding:0,labelWidth:25},
        	        	    	        	       {bind: '{tacticalT24x4}',fieldLabel: '4x4',maxLength:4, flex:1,labelWidth:25},
        	        	    	        	       {bind: '{tacticalT2CAFS}',fieldLabel: 'CAFS',maxLength:4,labelWidth:30, flex:1},
        	        	    	        	       {bind: '{tacticalT2SprayBars}',fieldLabel: 'Spray Bars',maxLength:4, flex:2,labelWidth:70},
        	        	    	        	       {bind: '{tacticalT2Short}',fieldLabel: 'Sht Whl Base',maxLength:4, flex:2,labelWidth:80},
        	        	    	        	       {bind: '{tacticalT212}',fieldLabel: '12h',maxLength:4, flex:1,labelWidth:25},
        	        	    	        	       {bind: '{tacticalT224}',fieldLabel: '24h',maxLength:4, flex:1,labelWidth:25}   
        	        	    	        	]
        	  	      
        	        	    	       } 
         	        	    	      ]
      	    	        	     },
      	    	        	     {xtype: 'fieldset',
       	      	    	        	defaultType: 'textfield',
       	      	    	        	defaults: {labelWidth:300,labelAlign:"left" },
       	      	    	        	title: 'Support',
       	      	    	        	items:[
       	      	    	        	   {xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
          	        	    	        	defaults: {vtype:'numbers',labelAlign:"left",padding:'0 0 0 2' },         	        	    	        	
          	        	    	        	items:[ 
          	        	    	        	       {bind: '{supportT1}',fieldLabel: 'T 1',maxLength:4,flex:1,padding:0,labelWidth:30},
          	        	    	        	       {bind: '{supportT14x4}',fieldLabel: '4x4',maxLength:4, flex:1,labelWidth:30},
          	        	    	        	       {bind: '{supportT1CAFS}',fieldLabel: 'CAFS',maxLength:4,labelWidth:30, flex:1},
          	        	    	        	       {bind: '{supportT1SprayBars}',fieldLabel: 'Spray Bars',maxLength:4, flex:2,labelWidth:70},
          	        	    	        	       {bind: '{supportT1Short}',fieldLabel: 'Sht Whl Base',maxLength:4, flex:2,labelWidth:80},
          	        	    	        	       {bind: '{supportT112}',fieldLabel: '12h',maxLength:4, flex:1,labelWidth:25},
          	        	    	        	       {bind: '{supportT124}',fieldLabel: '24h',maxLength:4, flex:1,labelWidth:25}            	        	    	        	     
          	        	    	        	]        	  	      
          	        	    	       } ,
          	        	    	      {xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
         	        	    	        	defaults: {vtype:'numbers',labelAlign:"left",padding:'0 0 0 2' },
         	        	    	        	title: 'Tactical',
         	        	    	        	items:[ 
         	        	    	        	       {bind: '{supportT2}',fieldLabel: 'T 2',maxLength:4,flex:1,padding:0,labelWidth:25},
         	        	    	        	       {bind: '{supportT24x4}',fieldLabel: '4x4',maxLength:4, flex:1,labelWidth:25},
         	        	    	        	       {bind: '{supportT2CAFS}',fieldLabel: 'CAFS',maxLength:4,labelWidth:30, flex:1},
         	        	    	        	       {bind: '{supportT2SprayBars}',fieldLabel: 'Spray Bars',maxLength:4, flex:2,labelWidth:70},
         	        	    	        	       {bind: '{supportT2Short}',fieldLabel: 'Sht Whl Base',maxLength:4, flex:2,labelWidth:80},
         	        	    	        	       {bind: '{supportT212}',fieldLabel: '12h',maxLength:4, flex:1,labelWidth:25},
         	        	    	        	       {bind: '{supportT224}',fieldLabel: '24h',maxLength:4, flex:1,labelWidth:25}           	        	    	        	     
         	        	    	        	]  	      
         	        	    	       },
         	        	    	      {xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
         	        	    	        	defaults: {vtype:'numbers',labelAlign:"left",padding:'0 0 0 2' },       	        	    	        	
         	        	    	        	items:[ 
         	        	    	        	       {bind: '{supportT3}',fieldLabel: 'T 3',maxLength:4,flex:1,padding:0,labelWidth:25},
         	        	    	        	       {bind: '{supportT34x4}',fieldLabel: '4x4',maxLength:4, flex:1,labelWidth:25},
         	        	    	        	       {bind: '{supportT3CAFS}',fieldLabel: 'CAFS',maxLength:4,labelWidth:30, flex:1},
         	        	    	        	       {bind: '{supportT3SprayBars}',fieldLabel: 'Spray Bars',maxLength:4, flex:2,labelWidth:70},
         	        	    	        	       {bind: '{supportT3Short}',fieldLabel: 'Sht Whl Base',maxLength:4, flex:2,labelWidth:80},
         	        	    	        	       {bind: '{supportT312}',fieldLabel: '12h',maxLength:4, flex:1,labelWidth:25},
         	        	    	        	       {bind: '{supportT324}',fieldLabel: '24h',maxLength:4, flex:1,labelWidth:25}       	        	    	        	     
         	        	    	        	]  	      
         	        	    	       } 
       	      	    	        	]
       	    	        	     },
      	    	        	    {bind:'{miscEquip}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Specialized Other Equipment'},
      	    	        	    {bind:'{miscPickup}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Requested Pick-Up time for 12 or 16 hr. resources'},
      	    	        	    {bind:'{miscInfo}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Other Information'}
      	    	        	]
      	    	       } 
    	        ] 
        	}
	       ]
	     },
       ,
   	{  xtype: 'fieldset',
	    	defaultType: 'textfield',
	    	defaults: {vtype:'extendedalphanum',labelWidth:150,labelAlign:"left",anchor: '100%'   },
	    	title: 'Supplies',
	    	 items:[ 
                	{bind:'{requiredSupplies}',xtype: 'textarea',fieldLabel: 'List Required Supplies'},
	                {bind:'{deliverLocation}',xtype: 'textarea',fieldLabel: 'Deliver to Location'}
	             ]
    	} ,
    	
    	  	{  xtype: 'fieldset',
	    	defaultType: 'textfield',
	    	defaults: {vtype:'simplealphanum',labelWidth:150,labelAlign:"left",anchor: '100%'  },
	    	title: 'Review & Approval',
	    	 items:[ 
                	{bind:'{submittedBy}',fieldLabel: 'Name and Incident assignment of person submitting form*',allowBlank:false,cls:'roc-required'},
                	 {bind:'{opbdReviewer}',fieldLabel: 'Name of Branch (OPBD) reviewer'},
                	 {bind:'{oscReviewer}',fieldLabel: 'Name of Operations (OSC) reviewer'}
      	             ]
    	} ,
       {xtype: 'fieldset',
	    defaultType: 'textfield',
	    title: 'ICS-215AW',
	    items:[
	    	  {xtype: 'fieldset',
	    	   defaultType: 'textfield',
	    	   title: 'Identified Risks',
	    	   defaults: {vtype:'simplealphanum',labelWidth:300,anchor: '100%'},
	    	    items:[
	    	           {xtype: 'checkboxgroup',
	    	        	columns: 4,
	    	        	vertical: true,
	    	        	items: [
	    	        	        { bind:'{rocks}', boxLabel: 'Rocks',  inputValue: 'rocks' },
	     	        	        { bind:'{mineShafts}', boxLabel: 'Mine Shafts',  inputValue: 'mineshafts' },
	    	        	        { bind:'{snakes}', boxLabel: 'Snakes', inputValue: 'snakes' },
	    	        	        { bind:'{steep}', boxLabel: 'Steep Ground', inputValue: 'steep' },
	    	        	        { bind:'{dozersCB}', boxLabel: 'Dozers',  inputValue: 'dozersCB' },
	    	        	        { bind:'{bees}', boxLabel: 'Bees/Wasps',  inputValue: 'beesWasps' },
	    	        	        { bind:'{trees}', boxLabel: 'Trees/Snags',  inputValue: 'treesSnags' },
	    	        	        { bind:'{heavyEquip}', boxLabel: 'Other Heavy Equipment',  inputValue: 'heavyEquip' },
	    	        	        { bind:'{bears}', boxLabel: 'Bears',  inputValue: 'bears' },
	    	        	        { bind:'{stumps}', boxLabel: 'Tree Stumps',  inputValue: 'treesStumps' },
	    	        	        { bind:'{dustyRoads}', boxLabel: 'Dusty Roads',  inputValue: 'dustyRoads' }
	    	        	 ]
	    	         },
	    	        {bind:'{animals}',xtype: 'textarea',fieldLabel: 'Other Animals List'},
	    	        {bind:'{safetyConcerns}',vtype:'extendedalphanum',xtype: 'textarea',fieldLabel: 'Other safety related concerns requiring mitigation'},
	    	        {bind:'{mitigationActions}',vtype:'extendedalphanum',xtype: 'textarea',fieldLabel: 'Recommended Mitigation Actions'},
	    	        {bind:'{riskSubmittedBy}',fieldLabel: 'Submitted by (type name)'},
	    	        {bind:'{oscRiskReviewer}',fieldLabel: 'Operations Section Chief reviewer (type name)'},
	    	        {bind:'{riskSubmittedBy2}',fieldLabel: 'Name and Incident assignment of person submitting form*',allowBlank:false,cls:'roc-required'},
	    	        {bind:'{opbdReviewer2}',fieldLabel: 'Name of Branch (OPBD) reviewer'},
	    	        {bind:'{oscReviewer2}',fieldLabel: 'Name of Operations (OSC) reviewer'},
	    	        {bind:'{otherSubmittedBy}',fieldLabel: 'Name of Safety (SOF1) reviewer'}
	             ]
	    	  } 
	    	]
    	} ,

       
	            
	 ] ,
	 buttons: [
	{
		text: 'Submit',
		reference: 'submitButton',
	    handler: 'submitForm',
	     formBind: true, //only enabled once the form is valid
	     disabled: true
	},{
		text: 'Reset',
		reference: 'resetButton',
		handler: 'clearForm'
	},{
		text: 'Cancel',
		reference: 'cancelButton',
		handler: 'cancelForm'
	}]
		 	
	 	
	});
});
