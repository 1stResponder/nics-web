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
define(['iweb/CoreModule','./GarReportController', './GarReportModel'], 
		function(Core, GarReportController, GarReportModel) {

	
	return Ext.define('modules.report-gar.GarReportView', {
	 	extend: 'Ext.panel.Panel',
	 	
	 	controller: 'garreportcontroller',
	    header: false,
	 	
        viewConfig: {
            emptyText: 'There are no reports'
        },
        
        
        listeners: {
        	//selectionchange: 'onSelectionChange'
        
        },
	    reference: 'garPanel',
	    autoScroll: true,
        referenceHolder: true,
	 	bodypadding: 10,
	 	dockedItems: [{
	            xtype: 'toolbar',
	            dock: 'top',
	            layout: {
	            	pack: 'end'
	            },
	            items: [{
	            	xtype: 'combobox',
	            	 reference: 'garList',
	            	 displayField: 'name',
	            	 valueField:'formId',
	            	 forceSelection:true,
	            	 editable:false,
	            	 queryMode: 'local',
	            	 allowBLank:false,
	            	 width:250,
	            	 emptyText:'Select a report...',
	            	 trackRemoved:false,
	            	 store: {fields:['formId', 'name'], sorters:[{property:'formId', direction:'DESC'}]},
	                listeners: {
						select: 'onReportSelect'
		            },
		           
	                
	            },{
	                xtype: 'tbfill'
	            }, {
	            	xtype: 'button',
	            	text: 'New',
	            	id:'createGar',
	            	tooltip: 'Create New Report',
	                reference: 'createButton',
	                listeners: {
						click: 'onAddGar'
		            }
	                
	            },{
	            	xtype: 'button',
	            	text: 'View',
	            	tooltip: 'View Report',
	            	id:'viewGar',
	            	reference: 'viewButton',
	                listeners: {
						click: 'onViewGar'
		            }
	                
	            },
				{
					xtype: 'button',
					text: 'Update',
					id:'updateGar',
	            	tooltip: 'Update GAR',
					reference: 'updateButton',
					disabled: true,
					listeners: {
						click: 'onUpdateGar'
		            }
					
				},
				//Pulling out the final button because people will need to create more than one GAR
	           /* {
		           	xtype: 'button',
		           	text: 'Final', 
		           	enableToggle: true,
		            tooltip: 'Finalize Report',
		            id:'finalizeGar',
	            	reference: 'finalButton',
		            enableToggle:false,
		            disabled: true,
		            listeners: {
						click: 'onFinalizeGar'
		            }
		        },*/
				{
					xtype: 'button',
					text: 'Print',
					id:'printGar',
	            	tooltip: 'Print Gar',
					reference: 'printButton',
					disabled: true,
					listeners: {
						click: 'onPrintGar'
		            }
					
				}]
	 	}],
	 	items:[
	 	       {
	 	    	   	xtype: 'container',
	 	    	    reference: 'garReport'
	 	    	   
	 	    	    
	 	       }]
	 	
	});
});
