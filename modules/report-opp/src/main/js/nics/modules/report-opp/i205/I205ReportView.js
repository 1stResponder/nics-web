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
define(['iweb/CoreModule','./I205ReportController' ], 
		function(Core, I205ReportController) {

	
	return Ext.define('modules.report-opp.I205ReportView', {
		extend: 'Ext.panel.Panel',
		header: false,
	 	

		comboRef:'oppList205',
		createRef:'create205',
		viewRef:'view205',
		updateRef:'update205',
		finalRef:'final205',
		printRef:'print205',
		oppReportRef: 'oppReport205',
		controller: 'i205reportcontroller',
	    header: false,
	    autoScroll: true,
        referenceHolder: true,
	 	bodypadding: 30,
	 	listeners: {
        	selectionchange: 'onSelectionChange',
        	afterrender: 'onReportRendered',
        	
        
        },
	    dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            reference:'205Dock',
            layout: {
            	pack: 'end'
            },
              items: [
                    {
            	xtype: 'combobox',
            	 reference:'oppList205',
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
					select: 'onReportSelect',
					
	            },
	           
                
            },{
                xtype: 'tbfill'
            },
            , {
            	xtype: 'button',
            	text: 'New',
            	tooltip: 'Create New Report',
            	id:'create205',
            	reference: 'create205',
                listeners: {
					click: 'onAdd'
	            }
                
            },
            {
            	xtype: 'button',
            	text: 'View',
            	tooltip: 'View Report',
            	id:'view205',
            	disabled: true,
				reference: 'view205',
                listeners: {
					click: 'onView'
	            }
                
            },
			{
				xtype: 'button',
				text: 'Update',
				tooltip: 'Update',
				id:'update205',
				reference: 'update205',
				disabled: true,
				listeners: {
					click: 'onUpdate'
	            }
				
			},
           /* {
	           	xtype: 'button',
	           	text: 'Final', 
	           	id:'finalize205',
	           	text: 'Final', 
	           	enableToggle: true,
	            tooltip: 'Finalize Report',
	            reference: 'final205',
	            enableToggle:false,
	            disabled: true,
	            listeners: {
					click: 'onFinalize'
	            }
	        },*/
			{
				xtype: 'button',
				text: 'Print',
				id:'print205',
		        tooltip: 'Print',
				reference: 'print205',
				disabled: true,
				listeners: {
					click: 'onPrint'
	            }
				
			}
            ]
 	}],
	 	
	 	
        
	 	items:[
	 	       {
	 	    	   	xtype: 'container',
	 	    	    reference: 'oppReport205'
	 	       },
	 	      {
	 	    	   	xtype: 'container',
	 	    	    reference: 'oppInstructions205',
	 	       }
	 	       ]
        
	 	
 	
	 	
	});
});
