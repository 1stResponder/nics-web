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
define(['iweb/CoreModule', './FmagFormController', './FmagFormModel' , 'nics/modules/report/common/FormVTypes'],
       
function(Core, FmagFormController, FmagFormModel ) {

	return Ext.define('modules.report-fmag.FmagFormView', {
		extend: 'Ext.form.Panel',
		
	 	controller: 'fmagformcontroller',
 	 	viewModel: {
	       type: 'fmag'
	    },
	 	buttonAlign: 'center',
	 	autoHeight: true,
	 	defaults: { padding:'5'},
		reference: "fmagReportForm",
        title: 'FMAG Report',
        defaultType: 'textfield',
        bodyPadding: 10,
		referenceHolder: true,
	    items:[
	    	{
	    		xtype:'label',
	    		html:'<div id="fmag-title">State of California</div>' + 
		    		'<div>California Emergency Management Agency</div>' + 
		    		'<div>FIRE MANAGEMENT ASSISTANCE GRANT (FMAG) - INITIAL REQUEST</div>',
	    		cls:'fmag-header'
	    	
	    	},
	     	{ 
		    	 xtype: 'fieldset',
		         defaultType: 'textfield',
		         defaults: {
		             anchor: '100%'
		         },
		    	 items:[ 
		    	        {xtype: 'hiddenfield',bind:'{formTypeId}' },
	    	 	        {bind:'{reportType}',fieldLabel: 'Report Type', xtype:'displayfield'},
	    	 	        {bind:'{agencyRequest}',vtype:'simplealphanum',fieldLabel: 'Agency Making Request*',allowBlank:false,cls:'fmag-required'},
	    	 	        {bind:'{requestDate}',xtype:'datefield', fieldLabel: 'Date/Time of Request:*',format: 'Y-m-d H:i:s',allowBlank:false,cls:'fmag-required'},
	    	 	        {bind:'{incidentName}',vtype:'simplealphanum',fieldLabel: 'Fire Incident Name*',allowBlank:false,cls:'fmag-required'},
	    	 	        {bind:'{incidentId}',vtype:'simplealphanum',fieldLabel: 'Inc. Number*',allowBlank:false,cls:'fmag-required'},
	    	 	        {bind:'{cityCounty}',vtype:'simplealphanum',fieldLabel: 'City/County*',allowBlank:false,cls:'fmag-required'},
	    	 	        {bind:'{acreage}',vtype:'simplealphanum',fieldLabel: 'Acreage*',allowBlank:false,cls:'fmag-required'},
	    	 	        {bind:'{cause}',vtype:'extendedalphanum',fieldLabel: 'Cause*', xtype:'textarea', allowBlank:false,cls:'fmag-required'},
	    	 	        {bind:'{fireDate}',xtype:'datefield',fieldLabel: 'Date/Time Fire Started*', format: 'Y-m-d H:i:s', allowBlank:false,cls:'fmag-required'},
	    	 	        {bind:'{ic}',vtype:'simplealphanum',fieldLabel: 'IC*',allowBlank:false,cls:'fmag-required'},
	    	 	        {bind:'{contactName}',vtype:'simplealphanum',fieldLabel: 'Contact Name*',allowBlank:false,cls:'fmag-required'},
	    	 	        {bind:'{phone}',vtype:'simplealphanum',fieldLabel: 'Phone*',allowBlank:false,cls:'fmag-required'},        
		    	]
		    	
		    },
		    
		    { 
		    	 xtype: 'fieldset',
		    	 title: 'FACTORS',
		    	 cls: 'fmag-fieldset',
		         defaultType: 'textfield',
		         defaults: {
		             anchor: '100%'
		         },
		    	 items:[  
	    	 	          
	    	 	        {bind:'{threat}',vtype:'simplealphanum',fieldLabel: 'Community Threatened*',allowBlank:false,cls:'fmag-required'},
	    	 	        {bind:'{population}',vtype:'extendednum',fieldLabel: 'Population*',allowBlank:false,cls:'fmag-required'},
	    	 	        
	    	 	        { 
					    	xtype: 'fieldset',
					    	title: 'Persons Evacuated',
					    	cls: 'fmag-fieldset',
					        defaultType: 'textfield',
					        defaults: {
					            anchor: '100%'
					        },
					    	items:[  
					    	 	
					    	 	 {bind:'{mandatory}',vtype:'extendednum',fieldLabel: 'Mandatory*',allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{volunteer}',vtype:'extendednum',fieldLabel: 'Volunteer*',allowBlank:false,cls:'fmag-required'}
					    	 
		    	 	        ]
		    	 	    },
		    	 	    
		    	 	    { 
					    	xtype: 'fieldset',
					    	title: 'Shelters',
					    	cls: 'fmag-fieldset',
					        defaultType: 'textfield',
					        defaults: {
					            anchor: '100%'
					        },
					    	items:[  
					    	 	
					    	 	 {bind:'{sheltersOpen}',vtype:'simplealphanum',fieldLabel: 'Shelters Open? (Y/N)*',allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{sheltersCount}',vtype:'extendednum',fieldLabel: 'How Many?*',allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{sheltersLocal}',vtype:'extendedalphanum',fieldLabel: 'Where?*', xtype:'textarea', allowBlank:false,cls:'fmag-required'}
					    	 
		    	 	        ]
		    	 	    },
		    	 	    
		    	 	    { 
					    	xtype: 'fieldset',
					    	cls: 'fmag-fieldset',
					    	title: 'Structures',
					        defaultType: 'textfield',
					        defaults: {
					            anchor: '100%'
					        },
					    	items:[  
					    	 	
					    	 	 {bind:'{threatStructs}',vtype:'extendednum',fieldLabel: '# of Structures Threatened*',allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{resStructs}',vtype:'extendednum',fieldLabel: 'Residential*',allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{busStructs}',vtype:'extendednum',fieldLabel: 'Business*',allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{fireProxStructs}',vtype:'simplealphanum',fieldLabel: 'Fire Proximity to Structures*',allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{vacaResStructs}',vtype:'extendednum',fieldLabel: 'Structures Vacation or Residential*',allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{subRuralStructs}',vtype:'extendednum',fieldLabel: 'Subdivision or Rural*',allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{natManBarriers}',vtype:'extendednum',fieldLabel: 'Natural/Man Made Barriers*',allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{infFacEquResThreat}',vtype:'extendedalphanum',fieldLabel: 'Infrastructure/Facilities/Equipment/Resources Threatened*', labelWidth:200, labelAlign:"left",
					    	 	 	xtype:'textarea', allowBlank:false,cls:'fmag-required'}
					    	 
		    	 	        ]
		    	 	    },
		    	 	    
		    	 	    { 
					    	xtype: 'fieldset',
					    	title: 'Resources Commited in %',
					    	cls: 'fmag-fieldset',
					        defaultType: 'textfield',
					        defaults: {
					            anchor: '100%'
					        },
					    	items:[  
					    	 	
					    	 	 {bind:'{percEngTypes}',vtype:'extendednum',fieldLabel: '% of all Engine types*',allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{percLocal}',vtype:'extendednum',fieldLabel: 'Local %*',allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{percOpArea}',vtype:'extendednum',fieldLabel: 'Operational Area %*',allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{percRegOrder}',vtype:'extendednum',fieldLabel: 'Region to Region Ordering %*',allowBlank:false,cls:'fmag-required'}
					    	 	 
		    	 	        ]
		    	 	    },
		    	 	    
		    	 	    {bind:'{countyEocActive}',vtype:'simplealphanum',fieldLabel: 'County EOC Activated (Y/N)*',allowBlank:false,cls:'fmag-required'},
			    	 	{bind:'{full}',vtype:'simplealphanum',fieldLabel: 'Full:*',allowBlank:false,cls:'fmag-required'},
			    	 	{bind:'{limited}',vtype:'simplealphanum',fieldLabel: 'Limited*',allowBlank:false,cls:'fmag-required'},
			    	 	{bind:'{fuelTerType}',vtype:'simplealphanum',fieldLabel: 'Fuel & Terrain Type*',allowBlank:false,cls:'fmag-required'},
			    	 	{bind:'{percFireCont}',vtype:'extendednum',fieldLabel: 'Fire Containment %*',allowBlank:false,cls:'fmag-required'},
			    	 	{bind:'{criticalCon}',vtype:'extendedalphanum',fieldLabel: 'Other critical considerations*', xtype:'textarea', allowBlank:false,cls:'fmag-required'}
	    	 	            
		    	]
		    },
		    
		    { 
		    	xtype: 'fieldset',
		    	title: 'PROGNOSIS',
		    	cls: 'fmag-fieldset',
		        defaultType: 'textfield',
		        defaults: {
		            anchor: '100%'
		        },
		    	items:[  
		    	 		{ 
					    	xtype: 'fieldset',
					    	title: 'Weather',
					    	cls: 'fmag-fieldset',
					        defaultType: 'textfield',
					        defaults: {
					            anchor: '100%'
					        },
					    	items:[  
					    	 	
					    	 	 {bind:'{current}',vtype:'extendedalphanum',fieldLabel: 'Current*', xtype:'textarea', allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{predicted}',vtype:'extendedalphanum',fieldLabel: 'Predicted*', xtype:'textarea', allowBlank:false,cls:'fmag-required'},
					    	 	 {bind:'{tempRelHum}',vtype:'extendednum',fieldLabel: 'Temp./Relative Humidity*', allowBlank:false,cls:'fmag-required'}
					    	 	 
		    	 	        ]
		    	 	    },
		    	 	    { 
					    	xtype: 'fieldset',
					    	title: 'Fire Behavior',
					    	cls: 'fmag-fieldset',
					        defaultType: 'textfield',
					        defaults: {
					            anchor: '100%'
					        },
					    	items:[  
					    	 	
					    	 	 {bind:'{fireBehCurrent}',vtype:'extendedalphanum',fieldLabel: 'Fire Behavior Current*', xtype:'textarea', allowBlank:false,cls:'fmag-required'},
					    	 	 { 
							    	xtype: 'fieldset',
							    	title: 'Fire Behavior Growth/Behavior Potential (next burning period)',
							    	cls: 'fmag-fieldset',
							        defaultType: 'textfield',
							        defaults: {
							            anchor: '100%'
							        },
							    	items:[  
							    	 	 {xtype:'label', text: 'ACRE IN % of:*', cls:'fmag-textlabel' },
							    	 	 {bind:'{lra}',vtype:'extendednum',fieldLabel: 'LRA*', allowBlank:false,cls:'fmag-required'},
							    	 	 {bind:'{sra}',vtype:'extendednum',fieldLabel: 'SRA*', allowBlank:false,cls:'fmag-required'},
							    	 	 {bind:'{fra}',vtype:'extendednum',fieldLabel: 'FRA*', allowBlank:false,cls:'fmag-required'},
							    	 	 {bind:'{tribal}',vtype:'extendednum',fieldLabel: 'Tribal*', allowBlank:false,cls:'fmag-required'}
							    	 	 
				    	 	        ]
				    	 	    }
		    	 	        ]
		    	 	    },
		    	 	     { xtype:'label', text: 'Submit the following with this FMAG Application', cls:'fmag-textlabel'},
			    	 	 {bind:'{current209}',vtype:'simplealphanum',fieldLabel: 'Current 209*', allowBlank:false,cls:'fmag-required'},
			    	 	 {bind:'{incidentMap}',vtype:'simplealphanum',fieldLabel: 'Incident Map*', allowBlank:false,cls:'fmag-required'},
			    	 	 {bind:'{weather}',vtype:'simplealphanum',fieldLabel: 'Weather*', allowBlank:false,cls:'fmag-required'},
			    	 	 {bind:'{otherDocs}',vtype:'simplealphanum',fieldLabel: 'Other Docs*', allowBlank:false,cls:'fmag-required'},
			    	 	 {xtype:'label', text: 'Provide closest RAWS print out data, and/or the current fire weather forecast'}
		    	 	 
	 	        ]
	 	    },
	 	    {
	    		xtype:'label',
	    		html:'<div id="fmag-footer-title">The Fire Management Assistance Grant (FMAG) request process is time sensitive!</div>' + 
		    		'<p>Instructions: Prior to placing your request please complete all sections of this Form. Items marked with an asterisk' + 
		    		' (*) must be fully and completely answered.  When Completed: (1) Call the Cal EMA Warning Center at 916-845-8911 to advise' + 
		    		' of FMAG Request: (2) Fax to Cal EMA Warning Center @ 916-845-8910, or email the Warning Center with the efile to:' + 
		    		' CSWC@ops.calema.ca.gov</p>' +
		    		'<p><span id="fmag-footer-bold">NOTE:</span> Map and weather documentation is required when submitting this form.' +
		    		'  The ICS-209 form is no longer required upon submittal of this request.'  +
		    		'  The ICS-209 will be due at the next routine time required per ICS 420-1.</p>' + 
		    		'<p><span id="fmag-footer-italic">***CAL FIRE Units are to also fax to:' +
		    		' (1) Sacramento ECC 916-845-8692, & (2) Either CSR-OCC 951-782-4900, or CNR-OCC 530-224-4308.</span><br>' + 
		    		'After normal duty hours Cal EMA Warning Center personnel will contact the Fire and Rescue Branch Duty Officer to process your request.' + 
		    		'  You will be kept informed of the progress of your request.</p>' + 
		    		'<p><span id="fmag-footer-bold">EMA FORM F-158</span> <span id="fmag-footer-italic-red">Revised: 07/18/2012</span></p>',
	    		cls:'fmag-footer'
	    	
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
