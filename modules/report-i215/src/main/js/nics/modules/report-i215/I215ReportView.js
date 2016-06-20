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
define(['iweb/CoreModule','./I215ReportController', './I215ReportModel' , 'nics/modules/report/common/FormVTypes'], 
		function(Core, I215ReportController, I215ReportModel) {

	
	return Ext.define('modules.report-i215.I215ReportView', {
	 	extend: 'Ext.panel.Panel',
		//extend: 'Ext.grid.Panel',
	 	controller: 'I215reportcontroller',
	    header: false,
	 	title: 'ICS 215 Worksheet',
        viewConfig: {
            emptyText: 'There are no reports'
        },
        
        
        listeners: {
        	selectionchange: 'onSelectionChange'
        
        },
	    reference: 'I215Panel',
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
	            	 reference:'I215List',
	            	 displayField: 'name',
	            	 valueField:'formId',
	            	 forceSelection:true,
	            	 editable:false,
	            	 queryMode: 'local',
	            	 allowBLank:false,
	            	 emptyText:'Select a report...',
	            	 trackRemoved:false,
	            	 width:300,
	            	 store: {fields:['formId', 'name'], sorters:[{property:'formId', direction:'DESC'}]},
	                listeners: {
						select: 'onReportSelect'
		            },
		           
	                
	            },{
	                xtype: 'tbfill'
	            }, {
	            	xtype: 'button',
	            	text: 'New',
	            	tooltip: 'Create New Report',
	            	id:'create215',
	            	reference: 'createButton',
	                listeners: {
						click: 'onAdd'
		            }
	                
	            },
	            {
	            	xtype: 'button',
	            	text: 'View',
	            	tooltip: 'View Report',
	            	id:'view215',
	            	reference: 'viewButton',
	                listeners: {
						click: 'onView'
		            }
	                
	            },
				{
					xtype: 'button',
					text: 'Update',
					tooltip: 'Update',
					id:'update215',
					reference: 'updateButton',
					disabled: true,
					listeners: {
						click: 'onUpdate'
		            }
					
				},
	            {
		           	xtype: 'button',
		           	text: 'Final', 
		           	id:'finalize215',
		           	text: 'Final', 
		           	enableToggle: true,
		            tooltip: 'Finalize Report',
		            reference: 'finalButton',
		            enableToggle:false,
		            disabled: true,
		            listeners: {
						click: 'onFinalize'
		            }
		        },
				{
					xtype: 'button',
					text: 'Print',
					id:'print215',
			        tooltip: 'Print',
					reference: 'printButton',
					disabled: true,
					listeners: {
						click: 'onPrint'
		            }
					
				}]
	 	}],
	 	items:[
	 	       {
	 	    	   	xtype: 'container',
	 	    	    reference: 'I215Report'
	 	    	   
	 	    	    
	 	       }
	 	       ]
        
	 	
 	
	 	
	});
});
