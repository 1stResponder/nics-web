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
define(['iweb/CoreModule','./FmagReportController', './FmagReportModel'], 
		function(Core, FmagReportController, FmagReportModel) {

	
	return Ext.define('modules.report-fmag.FmagReportView', {
	 	extend: 'Ext.panel.Panel',
	 	
	 	controller: 'fmagreportcontroller',
	    header: false,
	 	
        viewConfig: {
            emptyText: 'There are no reports'
        },
        
        
        listeners: {
        	//selectionchange: 'onSelectionChange'
        
        },
	    reference: 'fmagPanel',
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
	            	 reference: 'fmagList',
	            	 displayField: 'name',
	            	 valueField:'formId',
	            	 forceSelection:true,
	            	 editable:false,
	            	 queryMode: 'local',
	            	 allowBLank:false,
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
	            	tooltip: 'Create New Report',
	                reference: 'createButton',
	                listeners: {
						click: 'onAddFmag'
		            }
	                
	            },
				{
					xtype: 'button',
					text: 'Update',
					tooltip: 'Update FMAG',
					reference: 'updateButton',
					disabled: true,
					listeners: {
						click: 'onUpdateFmag'
		            }
					
				},
	            {
		           	xtype: 'button',
		           	text: 'Final', 
		           	enableToggle: true,
		            tooltip: 'Finalize Report',
		            reference: 'finalButton',
		            enableToggle:false,
		            disabled: true,
		            listeners: {
						click: 'onFinalizeFmag'
		            }
		        },
				{
					xtype: 'button',
					text: 'Print',
					tooltip: 'Print FMAG',
					reference: 'printButton',
					disabled: true,
					listeners: {
						click: 'onPrintFmag'
		            }
					
				}]
	 	}],
	 	items:[
	 	       {
	 	    	   	xtype: 'container',
	 	    	    reference: 'fmagReport'
	 	    	   
	 	    	    
	 	       }]
	 	
	});
});
