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
define(['iweb/CoreModule', './I201FormController', './I201FormViewModel' , 'iweb/core/FormVTypes'],
       
function(Core, I201FormController, I201FormViewModel ) {

	return Ext.define('modules.report-opp.I201FormView', {
		extend: 'Ext.form.Panel',
		
	 	controller: 'i201formcontroller',
	 	 viewModel: {
		       type: 'i201'
		    },
		   
	 	buttonAlign: 'center',
	 	autoHeight: true,
	 	defaults: { padding:'5'},
		reference: "i201ReportForm",
		title: 'ICS 201 Report',
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
	    		 			       { xtype: 'fieldcontainer',layout:'vbox',defaultType: 'textfield', flex:1,
	    		 			    	   items:[ {bind: '{incidentName}',vtype:'simplealphanum',fieldLabel: 'Incident Name*', allowBlank:false,labelAlign:'top',cls:'ics-required'}
    		 
	    		 			    	           ]
	    		 			       },
	    		 			      { xtype: 'fieldcontainer',layout:'vbox',defaultType: 'textfield', flex:2,
	    				    	          items:[ {bind:'{reportBy}',vtype:'simplealphanum',fieldLabel: 'Prepared By (name)*',allowBlank:false,cls:'ics-required'},
	    				    	          		  {bind: '{date}',xtype: 'datefield',fieldLabel: 'Date*',format: 'm/d/y',cls:'ics-required',allowBlank:false},
	    				 	    	 	          {bind: '{starttime}',xtype: 'timefield',fieldLabel: 'Start Time*',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required'},
	    				 	    	 	          {xtype: 'hiddenfield', bind: '{incidentId}'},
	    				    	          		  {xtype: 'hiddenfield', bind:'{formTypeId}' },
	    				    	          		  {xtype: 'hiddenfield', bind:'{seqnum}' },
	    				    	          		  {xtype: 'hiddenfield', bind: '{incidentId}'},
	    				    	          		  {xtype: 'hiddenfield', bind: '{agencyRepsCount}'},
	    				    	          		  {xtype: 'hiddenfield', bind: '{icStaffCount}'},
	    				    	          		  {xtype: 'hiddenfield', bind: '{intelCount}'},
	    				    	          		  {xtype: 'hiddenfield', bind: '{logisticsCount}'},
	    				    	          		  {xtype: 'hiddenfield', bind: '{logisticsSptCount}'},
	    				    	          		  {xtype: 'hiddenfield', bind: '{logisticsSrvCount}'},
	    				    	          		  {xtype: 'hiddenfield', bind: '{opsCount}'},
	    				    	          		  {xtype: 'hiddenfield', bind: '{opsBranchCount}'},
	    				    	          		  {xtype: 'hiddenfield', bind: '{opsBBranchCount}'},
	    				    	          		  {xtype: 'hiddenfield', bind: '{opsCBranchCount}'},
	    				    	          		  {xtype: 'hiddenfield', bind: '{opsAirBranchCount}'},
	    				    	          		  {xtype: 'hiddenfield', bind: '{financeCount}'},
	    				    	          		  {xtype: 'hiddenfield', bind: '{resourceCount}'},
	    				    	          		  
	    				    	          		 
	    				    	           ]
	    				    	 },
	    	             ]
	    	          },
	    	          {bind:'{colllabroom}',vtype:'simplealphanum',fieldLabel: 'Map/Sketch:(indicate which NICS room)*',labelWidth:275, allowBlank:false,cls:'ics-required'},
	    	 	      {bind:'{sitrep}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Current Situation*',labelAlign:'top',allowBlank:false,cls:'ics-required',height:400},
	    	 	      {bind: '{initResponse}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Initial Response Objectives, Current Actions, Planned Actions*',labelAlign:'top',allowBlank:false,cls:'ics-required',height:800}
	    	 	]
	    },
	    { value: '6. Current Organization (fill in additional appropriate organization)',xtype:'displayfield',anchor: '100%',flex:1,},
	    { xtype: 'fieldcontainer', layout:'hbox',
	    	items:[
			    {  xtype: 'fieldset',anchor: '50%',flex:2,
			    	items: [
			    	        
						  { xtype: 'fieldset',
				  	    	defaultType: 'textfield',
				  	    	reference: 'icStaff201',
				  	    	id: 'icStaffFS',
				  	    	title: 'Incident Commander(s) and Staff',
				  	    	checkboxToggle:true,
				  	    	componentCls:'icStaff',
				  	    	items:[ 
				  	    	        { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'icStaff201Chbx',cls:'i201',submitValue:false,
				  	    	        		listeners: {'change': {fn:'addRows', section:'icStaff'}}
				  	    	        },
				  	    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
				  	    	    	 defaults: {vtype:'simplealphanum',flex:3},
				  	    	    	 items:[ {bind: '{icAgency1}',fieldLabel: 'Agency',labelAlign:'top'},
				  	    	    	         {bind: '{icPosition1}',fieldLabel: 'Position',labelAlign:'top',emptyText:'Enter at least one',cls:'ics-required'},
				  	    	    	         {bind: '{icContact1}',fieldLabel: 'Name/Contact Info*',labelAlign:'top',cls:'ics-required', emptyText:'Enter at least one contact',allowBlank:false}
				  	    	    	       ]
				  	    	       },
				  	    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	    	     defaults: {vtype:'simplealphanum',flex:3},
					  	    	     items:[ {bind: '{icAgency2}'},
					  	    	    	     {bind: '{icPosition2}'},
					  	    	    	     {bind: '{icContact2}'}
					  	    	           ]
					  	    	   },
					  	    	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
							  	     defaults: {vtype:'simplealphanum',flex:3},
							  	     items:[ {bind: '{icAgency3}'},
							  	    	     {bind: '{icPosition3}'},
							  	    	     {bind: '{icContact3}'}
							  	           ]
							  	   },    
						  	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								  	 defaults: {vtype:'simplealphanum',flex:3},
								  	 items:[ {bind: '{icAgency4}'},
								  	    	 {bind: '{icPosition4}'},
								  	    	 {bind: '{icContact4}'}
								  	       ]
								   },    
							  	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
									 defaults: {vtype:'simplealphanum',flex:3},
									 items:[ {bind: '{icAgency5}'},
									  	     {bind: '{icPosition5}'},
									  	     {bind: '{icContact5}'}
									       ]
								   },    



					  	    	   ]
				      	      
					    },
					    { xtype: 'fieldset',
				  	    	defaultType: 'textfield',
				  	    	title: 'Agency Representatives',
				  	    	reference: 'agencyRep201',
				  	    	id: 'agencyRepsFS',
				  	    	componentCls:'agencyRep',
				  	    	cls:'i201FS',
				  	    	checkboxToggle:true,
				  	    	 items:[ 
				  	    	      { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'agencyRep201Chbx',cls:'i201',submitValue:false,
				    	  	    	  listeners: {'change':  {fn:'addRows', section:'agencyRep'}}
				    	  	      },
				  	    	      { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
				  	    	    	defaults: {vtype:'simplealphanum', flex:2},
				  	    	    	items:[ {bind: '{agencyRep1}',fieldLabel: 'Agency',labelAlign:'top'},
				  	    	    	        {bind: '{contactRep1}',fieldLabel: 'Name/Contact Info*',labelAlign:'top'},
				  	    	    	      ]
				  	    	      },
				  	    	      { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					  	    	    defaults: {vtype:'simplealphanum', flex:2},
					  	    	    items:[ {bind: '{agencyRep2}'},
					  	    	    	    {bind: '{contactRep2}'},
					  	    	    	    
					  	    	    	   ]
					  	    	  },
					  	    	  { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
						  	    	defaults: {vtype:'simplealphanum', flex:2},
						  	    	items:[ {bind: '{agencyRep3}'},
						  	    	    	{bind: '{contactRep3}'},
						  	    	      ]
						  	      }
					       	      ]
				      	      
				     	 },
				   	     {  xtype: 'fieldset',
					    	defaultType: 'textfield',
					    	reference: 'intel201',
					    	id: 'intelFS',
					    	title: 'Planning/INTEL Section',
					    	checkboxToggle:true,
					    	componentCls:'intel',
					    	cls:'i201FS',
				  	    	 items:[ 
					    	        { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'intel201Chbx',cls:'i201',submitValue:false,
					    	        		listeners: {'change': {fn:'addRows', section:'intel'}}
					    	        },
					    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					    	    	 defaults: {vtype:'simplealphanum',flex:3},
					    	    	 
					    	    	items:[ {bind: '{intelAgency1}',fieldLabel: 'Agency',labelAlign:'top'},
					    	    	         {bind: '{intelPosition1}',fieldLabel: 'Position',labelAlign:'top'},
					    	    	         {bind: '{intelContact1}',fieldLabel: 'Name/Contact Info*',labelAlign:'top',cls:'i201Contact ics-required'},
					    	    	    
					    	    	   ]
					    	       }
				       	      ]
				  	      
					    },
					    {  xtype: 'fieldset',
					    	defaultType: 'textfield',
					    	reference: 'logistics201',
					    	id: 'logisticsFS',
					    	title: 'Logistics',
					    	checkboxToggle:true,
					    	componentCls:'logistics',
					    	cls:'i201FS',
				  	    	 items:[ 
					    	        { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'logistics201Chbx',cls:'i201',submitValue:false,
					    	        		listeners: {'change': {fn:'addRows', section:'logistics'}}
					    	        },
					    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
					    	    	 defaults: {vtype:'simplealphanum',flex:3},
					    	    	 
					    	    	items:[ {bind: '{logisticsAgency1}',fieldLabel: 'Agency',labelAlign:'top'},
					    	    	         {bind: '{logisticsPosition1}',fieldLabel: 'Position',labelAlign:'top'},
					    	    	         {bind: '{logisticsContact1}',fieldLabel: 'Name/Contact Info*',labelAlign:'top',cls:'i201Contact ics-required'}
					    	    	    
					    	    	   ]
					    	       }
					   	      ]
						      
						},
						{  xtype: 'fieldset',
							defaultType: 'textfield',
							reference: 'logisticsSpt201',
							id: 'logisticsSptFS',
							title: 'Logistics Support Branch',
							checkboxToggle:true,
							componentCls:'logistics',
							cls:'i201FS',
				  	    	items:[ 
							       { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'logisticsSpt201Chbx',cls:'i201',submitValue:false,
							    	   listeners: {'change': {fn:'addRows', section:'logisticsSpt'}}
							       },
							       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
							    	   defaults: {vtype:'simplealphanum',flex:3},
						    	 
							    	   items:[ {bind: '{logisticsSptAgency1}',fieldLabel: 'Agency',labelAlign:'top'},
							    	           {bind: '{logisticsSptPosition1}',fieldLabel: 'Position',labelAlign:'top'},
							    	           {bind: '{logisticsSptContact1}',fieldLabel: 'Name/Contact Info*',labelAlign:'top',cls:'i201Contact ics-required'}
						    	    
							    	         ]
							       }
						         ]
					      
						},
						{  xtype: 'fieldset',
							defaultType: 'textfield',
							reference: 'logisticsSrv201',
							id: 'logisticsSrvFS',
							title: 'Logistics Service Branch',
							checkboxToggle:true,
							componentCls:'logistics',
							cls:'i201FS',
				  	    	items:[ 
							       { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'logisticsSrv201Chbx',cls:'i201',submitValue:false,
							    	   listeners: {'change': {fn:'addRows', section:'logisticsSrv'}}
							       },
							       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
							    	   defaults: {vtype:'simplealphanum',flex:3},
						    	 
							    	   items:[ {bind: '{logisticsSrvAgency1}',fieldLabel: 'Agency',labelAlign:'top'},
							    	           {bind: '{logisticsSrvPosition1}',fieldLabel: 'Position',labelAlign:'top'},
							    	           {bind: '{logisticsSrvContact1}',fieldLabel: 'Name/Contact Info*',labelAlign:'top',cls:'i201Contact ics-required'}
						    	    
							    	         ]
							       }
						         ]
					      
						},
		           ]
			    },
			    {  xtype: 'fieldset',anchor: '50%',flex:2,
				    	items: [
				    	        
								{  xtype: 'fieldset',
							    	defaultType: 'textfield',
							    	reference: 'ops201',
							    	id: 'opsFS',
							    	title: 'Operation Section',
							    	checkboxToggle:true,
							    	componentCls:'ops',
							    	 items:[ 
							    	        { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'ops201Chbx',cls:'i201',submitValue:false,
							    	        		listeners: {'change': {fn:'addRows', section:'ops'}}
							    	        },
							    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
							    	    	 defaults: {vtype:'simplealphanum',flex:3},
							    	    	 
							    	    	items:[ {bind: '{opsAgency1}',fieldLabel: 'Agency',labelAlign:'top'},
							    	    	         {bind: '{opsPosition1}',fieldLabel: 'Position',labelAlign:'top'},
							    	    	         {bind: '{opsContact1}',fieldLabel: 'Name/Contact Info*',labelAlign:'top',cls:'ics-required',allowBlank:false, emptyText:'Enter at least one'}							    	    	    
							    	    	   ]
							    	       },
							    	       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
								    	     defaults: {vtype:'simplealphanum',flex:3},
								    	     items:[ {bind: '{opsAgency2}'},
								    	    	     {bind: '{opsPosition2}'},
								    	    	     {bind: '{opsContact2}'}							    	    	    
								    	    	   ]
								    	   },
								    	   { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
									    	 defaults: {vtype:'simplealphanum',flex:3},
									    	 items:[ {bind: '{opsAgency3}'},
									    	    	 {bind: '{opsPosition3}'},
									    	    	 {bind: '{opsContact3}'}							    	    	    
									    	    	]
									    	},
									    	{ xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
										      defaults: {vtype:'simplealphanum',flex:3},
										      items:[ {bind: '{opsAgency4}'},
										    	      {bind: '{opsPosition4}'},
										    	      {bind: '{opsContact4}'}							    	    	    
										    	    ]
										     },
										     { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
											   defaults: {vtype:'simplealphanum',flex:3},
											   items:[ {bind: '{opsAgency5}'},
											    	   {bind: '{opsPosition5}'},
											    	   {bind: '{opsContact5}'}							    	    	    
											    	    	   ]
											    	   },
							   	      ]
								      
								},
								{  xtype: 'fieldset',
									defaultType: 'textfield',
									reference: 'opsBranch201',
									id: 'opsBranchFS',
									title: 'a. Branch - Division Groups',
									checkboxToggle:true,
									componentCls:'ops',
									cls:'i201FS',
						  	    	items:[ 
									       { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'opsBranch201Chbx',cls:'i201',submitValue:false,
									    	   listeners: {'change': {fn:'addRows', section:'opsBranch'}}
									       },
									       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
									    	   defaults: {vtype:'simplealphanum',flex:3},
								    	 
									    	   items:[ {bind: '{opsBranchAgency1}',fieldLabel: 'Agency',labelAlign:'top'},
									    	           {bind: '{opsBranchPosition1}',fieldLabel: 'Position',labelAlign:'top'},
									    	           {bind: '{opsBranchContact1}',fieldLabel: 'Name/Contact Info*',labelAlign:'top',cls:'i201Contact ics-required'}
								    	    
									    	         ]
									       }
								         ]
							      
								},
								{  xtype: 'fieldset',
									defaultType: 'textfield',
									reference: 'opsBBranch201',
									id: 'opsBBranchFS',
									title: 'b. Branch - Division Groups',
									checkboxToggle:true,
									componentCls:'ops',
									cls:'i201FS',
						  	    	items:[ 
						  	    	       { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'opsBBranch201Chbx',cls:'i201',submitValue:false,
									    	   listeners: {'change': {fn:'addRows', section:'opsBBranch'}}
									       },
									       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
									    	   defaults: {vtype:'simplealphanum',flex:3},
								    	 
									    	   items:[ {bind: '{opsBBranchAgency1}',fieldLabel: 'Agency',labelAlign:'top'},
									    	           {bind: '{opsBBranchPosition1}',fieldLabel: 'Position',labelAlign:'top'},
									    	           {bind: '{opsBBranchContact1}',fieldLabel: 'Name/Contact Info*',labelAlign:'top',cls:'i201Contact ics-required'}
								    	    
									    	         ]
									       }
								         ]
							      
								},
								{  xtype: 'fieldset',
									defaultType: 'textfield',
									reference: 'opsCBranch201',
									id: 'opsCBranchFS',
									title: 'c. Branch - Division Groups',
									checkboxToggle:true,
									componentCls:'ops',
									cls:'i201FS',
						  	    	items:[ 
									       { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'opsCBranch201Chbx',cls:'i201',submitValue:false,
									    	   listeners: {'change': {fn:'addRows', section:'opsCBranch'}}
									       },
									       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
									    	   defaults: {vtype:'simplealphanum',flex:3},
								    	 
									    	   items:[ {bind: '{opsCBranchAgency1}',fieldLabel: 'Agency',labelAlign:'top'},
									    	           {bind: '{opsCBranchPosition1}',fieldLabel: 'Position',labelAlign:'top'},
									    	           {bind: '{opsCBranchContact1}',fieldLabel:'Name/Contact Info*',labelAlign:'top',cls:'i201Contact ics-required'}
								    	    
									    	         ]
									       }
								         ]
							      
								},
								{  xtype: 'fieldset',
									defaultType: 'textfield',
									reference: 'opsAirBranch201',
									id: 'opsAirBranchFS',
									title: 'Air Operations Branch',
									checkboxToggle:true,
									componentCls:'ops',
									cls:'i201FS',
						  	    	items:[ 
									       { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'opsAirBranch201Chbx',cls:'i201',submitValue:false,

									    	   listeners: {'change': {fn:'addRows', section:'opsAirBranch'}}
									       },
									       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
									    	   defaults: {vtype:'simplealphanum',flex:3},
								    	 
									    	   items:[ {bind: '{opsAirBranchAgency1}',fieldLabel: 'Agency',labelAlign:'top'},
									    	           {bind: '{opsAirBranchPosition1}',fieldLabel: 'Position',labelAlign:'top'},
									    	           {bind: '{opsAirBranchContact1}',fieldLabel: 'Name/Contact Info*',labelAlign:'top',cls:'i201Contact ics-required'}
								    	    
									    	         ]
									       }
								         ]
							      
								},
								{  xtype: 'fieldset',
									defaultType: 'textfield',
									reference: 'finance201',
									id: 'financeFS',
									title: 'Finance Section',
									checkboxToggle:true,
									componentCls:'finance',
									cls:'i201FS',
						  	    	items:[ 
									       { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'finance201Chbx',cls:'i201',submitValue:false,
									    	   listeners: {'change': {fn:'addRows', section:'finance'}}
									       },
									       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
									    	   defaults: {vtype:'simplealphanum',flex:3},
								    	 
									    	   items:[ {bind: '{financeAgency1}',fieldLabel: 'Agency',labelAlign:'top'},
									    	           {bind: '{financePosition1}',fieldLabel: 'Position',labelAlign:'top'},
									    	           {bind: '{financeContact1}',fieldLabel: 'Name/Contact Info*',labelAlign:'top',cls:'i201Contact ics-required'}
								    	    
									    	         ]
									       }
								         ]
							      
								},
							]
			    },
			    ]
	    },
	{  xtype: 'fieldset',
		defaultType: 'textfield',
		reference: 'resource201',
		id: 'resourceFS',
		title: 'Resource Section',
		checkboxToggle:true,
		componentCls:'resource',
		items:[ 
		       { value: 'Add Row',xtype:'checkbox', fieldLabel:'Add more rows',reference:'resource201Chbx',cls:'i201',submitValue:false,
		    	   listeners: {'change': {fn:'addRows', section:'resource'}}
		       },
		       { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', 
		    	   defaults: {flex:5},
	    	 
		    	   items:[ {bind: '{resourceName1}',fieldLabel: 'Resource',labelAlign:'top',vtype:'simplealphanum'},
		    	           {bind: '{resourceId1}',fieldLabel: 'Resource Identifier',vtype:'simplealphanum',labelAlign:'top'},
		    	           //{bind: '{resourceDatetime1}',fieldLabel: 'Date Time Ordered',labelAlign:'top',xtype: 'datefield',format: 'm/d/y H:i'},
			    	          // {bind: '{resourceETA1}',fieldLabel: 'ETA',labelAlign:'top',xtype: 'datefield',format: 'm/d/y H:i'},
		    	           {bind: '{resourceDatetime1}',fieldLabel: 'Date Time Ordered',labelAlign:'top'},
			    	       {bind: '{resourceETA1}',fieldLabel: 'ETA',labelAlign:'top'},
			    	           {bind: '{resourceOS1}',xtype:'checkbox', fieldLabel:'On-scene',labelAlign:'top',flex:1,labelWidth:'100px'},
		    	           {bind: '{resourceNotes1}',fieldLabel: 'Notes:',labelAlign:'top',vtype:'extendedalphanum',flex:5},
		    	           
	 	    	 	          
		   	    	    
		    	         ]
		       }
	         ]
      
	},
	{ xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield',
			items:[{bind:'{reportBy}',vtype:'simplealphanum',fieldLabel: 'Prepared By', anchor:'60%',allowBlank:false,cls:'ics-required'},
	    	       {bind: '{date}',xtype: 'datefield',fieldLabel: 'Date*',format: 'm/d/y',cls:'ics-required',allowBlank:false,anchor:'15%', labelWidth:40, padding:'0 0 0 5'},
	 	    	    {bind: '{starttime}',xtype: 'timefield',fieldLabel: 'Start Time*',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',anchor:'25%', labelWidth:80, padding:'0 0 0 5'},
	 	    	 ]
  
     
  },
	 ] ,
	 buttons: [
	{
		text: 'Submit',
		reference: 'submitButton201',
	    handler: 'submitForm',
	     formBind: true, //only enabled once the form is valid
	     disabled: true
	},{
		text: 'Reset',
		reference: 'resetButton201',
		handler: 'clearForm'
	},{
		text: 'Cancel',
		reference: 'cancelButton201',
		handler: 'cancelForm'
	}]
		 	
	 	
	});
});
