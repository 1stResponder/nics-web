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
define(['iweb/CoreModule', './GarFormController', './GarFormModel' , 'iweb/core/FormVTypes'],
       
function(Core, GarFormController, GarFormModel ) {

	return Ext.define('modules.report-gar.GarFormView', {
		extend: 'Ext.form.Panel',
		
	 	controller: 'garformcontroller',
 	 	viewModel: {
	       type: 'gar'
	    },
	 	buttonAlign: 'center',
	 	autoHeight: true,
	 	defaults: { padding:'5'},
		reference: "garReportForm",
        title: 'GAR Report',
        defaultType: 'textfield',
        bodyPadding: 10,
		referenceHolder: true,
	    items:[
	     	{ 
		    	 xtype: 'fieldset',
		         defaultType: 'textfield',
		         defaults: {
		             anchor: '100%'
		         },
		    	 items:[ 
		    	        {xtype: 'hiddenfield',bind:'{formTypeId}' },
		    	        {xtype: 'hiddenfield',bind:'{user}' },
		    	        {xtype: 'hiddenfield',bind:'{userfull}' },
		    	        {xtype: 'hiddenfield',bind:'{reportType}' },
			    	       
		    	        { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', defaults: {anchor: '100%', vtype:'alphanum',},
				 			items:[ {bind: '{divgroupstaging}',fieldLabel: 'Division/Group/Staging*', allowBlank:false,cls:'ics-required'},
						 	    	   ]
				     },
	    	 	        {bind:'{physicalLocation}',vtype:'simplealphanum',fieldLabel: 'Physical Location*',allowBlank:false,cls:'ics-required'},
	    	 	        {bind:'{requestDate}',xtype:'datefield', fieldLabel: 'Date/Time of Request:*',format: 'Y-m-d H:i:s',allowBlank:false,cls:'ics-required'},
	    	 	        {bind:'{lat}',vtype:'extendednum',fieldLabel: 'Latitude',allowBlank:true},        
	    	 	        {bind:'{lon}',vtype:'extendednum',fieldLabel: 'Longitude',allowBlank:true},     
	    	 	        {bind:'{supervision}',fieldLabel: 'Supervision',allowBlank:true, xtype:'slider', value: 0,
	    	 	        	minValue:0, maxValue:10, increment:1, listeners:{ changecomplete:'onSliderChange' }},
	    	 	        {bind:'{planning}',fieldLabel: 'Planning',allowBlank:true, xtype:'slider', value: 0,
	    	 	        	minValue:0, maxValue:10, increment:1, listeners:{ changecomplete:'onSliderChange' }},
	    	 	        {bind:'{teamSelect}',fieldLabel: 'Team Selection',allowBlank:true, xtype:'slider', value: 0,
	    	 	        	minValue:0, maxValue:10, increment:1, listeners:{ changecomplete:'onSliderChange' }},
	    	 	        {bind:'{teamFit}',fieldLabel: 'Team Fitness',allowBlank:true, xtype:'slider', value: 0,
	    	 	        	minValue:0, maxValue:10, increment:1, listeners:{ changecomplete:'onSliderChange' }},
	    	 	        {bind:'{environment}',fieldLabel: 'Environment',allowBlank:true, xtype:'slider', value: 0,
	    	 	        	minValue:0, maxValue:10, increment:1, listeners:{ changecomplete:'onSliderChange' }},
	    	 	        {bind:'{eventEvoComplex}',fieldLabel: 'Event/Evolution Complexity',allowBlank:true, xtype:'slider', value: 0,
	    	 	        	minValue:0, maxValue:10, increment:1, listeners:{ changecomplete:'onSliderChange' }},
	    	 	        {bind:'{garResult}',fieldLabel: 'GAR Result', xtype:'displayfield', reference:'garResult', reference:'garResult',
	    	 	        	listeners: { change:'onGarResultChange' }}
		    	]
		    	
		    }
	    
	    ],
	  
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
