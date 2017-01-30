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
define(['iweb/CoreModule', './I207FormController', './I207FormViewModel' , 'iweb/core/FormVTypes',
        "nics/modules/report/common/OrgChart"],
       
function(Core, I207FormController, I207FormViewModel,OrgChart ) {

	return Ext.define('modules.report-opp.I207FormView', {
		extend: 'Ext.form.Panel',
		
	 	controller: 'i207formcontroller',
	 	 viewModel: {
		       type: 'i207'
		    },
		   
	 	buttonAlign: 'center',
	 	autoHeight: true,
	 	defaults: { padding:'5'},
		reference: "i207ReportForm",
		title: 'ICS 207 Report',
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
	    		 			      { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', fieldLabel:'Operation Period ',labelAlign:'top',anchor: '59%',
	    		 			    	   items:[ {bind: '{date}',xtype: 'datefield',fieldLabel: 'From*',labelWidth:40,format: 'm/d/y',cls:'ics-required',allowBlank:false,width:130,padding:'0 0 0 5'},
	 	    				 	    	 	   {bind: '{starttime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',width:60},
	 	    				 	    	 	    {bind: '{enddate}',xtype: 'datefield',fieldLabel: 'To*',labelWidth:40,format: 'm/d/y',cls:'ics-required',allowBlank:false,padding:'0 0 0 5',width:130},
	 	    				 	    	 	   {bind: '{endtime}',xtype: 'timefield',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',width:60},
	 	    				 	    	 	 
    		 
	    		 			    	           ]
	    		 			       },
	    				 	    	 	          {xtype: 'hiddenfield', bind: '{incidentId}'},
	    				    	          		  {xtype: 'hiddenfield', bind:'{formTypeId}' },
	    				    	          		  {xtype: 'hiddenfield', bind:'{seqnum}' },
	    				    	          		  
	    				    	          		  
	    				    	          		 
	    				    	           ]
	    			  },
	    			  ]
	     	          
	    },
		{  xtype: 'fieldset',
		    	 items:[ 
						{xtype:"displayfield", anchor:'100%',
							value:"All changes to Org Chart should be made on the ICS 203 Form"},
		    	    	  ]
	  	      
		    },
	    { 
	    	 xtype: 'fieldset',
	         title: 'Org Chart',
	         anchor: '100%',
	          
	         items:[       {xtype: 'orgchart', reference:'orgchart', id:'orgchart', bind:'{treeData}'} ]
	    	          
	    },
	    { 
	    	 xtype: 'fieldset',
	         title: 'More Info',
	         defaultType: 'textfield',
	         defaults: {
	             anchor: '100%'
	         },
	         items:[        { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield',
	    	  			items:[{bind:'{reportBy}',vtype:'simplealphanum',fieldLabel: 'Prepared By', anchor:'60%',allowBlank:false,cls:'ics-required'},
	    	  	    	       {bind: '{date}',xtype: 'datefield',fieldLabel: 'Date*',format: 'm/d/y',cls:'ics-required',allowBlank:false,anchor:'15%', labelWidth:40, padding:'0 0 0 5'},
	    	  	 	    	    {bind: '{starttime}',xtype: 'timefield',fieldLabel: 'Start Time*',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'ics-required',anchor:'25%', labelWidth:80, padding:'0 0 0 5'},
	    	          ]
	    	    
	    	       
	    	    },
	    	          
	    	 	]
	    },
	     
			    

	
	
	 ] ,
	 buttons: [
	{
		text: 'Submit',
		reference: 'submitButton207',
	    handler: 'submitForm',
	     formBind: true, //only enabled once the form is valid
	     disabled: true
	},{
		text: 'Reset',
		reference: 'resetButton207',
		handler: 'clearForm'
	},{
		text: 'Cancel',
		reference: 'cancelButton207',
		handler: 'cancelForm'
	}],
	        
		 	
	 	
	});
});
