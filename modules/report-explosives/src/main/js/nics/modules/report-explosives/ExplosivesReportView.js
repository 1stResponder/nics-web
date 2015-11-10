/*
 * Copyright (c) 2008-2015, Massachusetts Institute of Technology (MIT)
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
define(['iweb/CoreModule','./ExplosivesReportController', 
        './ExplosivesReportModel', 'nics/modules/report/common/ReportImageModel',
        'nics/modules/report/common/ReportTableView'], 
		function(Core, ExplosivesReportController, ExplosivesReportModel) {

	return Ext.define('modules.report-explosives.ExplosivesReportView', {
		extend: 'modules.report.ReportTableView',

	 	controller: 'explosivesereportcontroller',
	 	
	 	gridRef: 'gridPanel',
	 	
	 	initComponent: function(){
	 		this.callParent();

            // Add a button to show graphs
            var toolbar = this.getDockedItems('toolbar[dock="top"]')[0];
            toolbar.add({xtype: 'button',
                text: 'Graphs',
                tooltip: 'Generate graphs',
                handler: 'showReportWindow'});
            
            var toolbar = this.getDockedItems('toolbar[dock="top"]')[0];
            toolbar.add({xtype: 'button',
                text: 'Zoom',
                tooltip: 'Zoom to selected report',
                handler: 'onZoom'});

            this.add({
		 		xtype: 'gridpanel',
			 	
		 		header: false,
		 		
		 		region: 'center',
		 		
		 		reference: 'gridPanel',
			 	
		        viewConfig: {
		            emptyText: 'There are no reports',
		            markDirty: false
		        },
		        
		        store: {
		        	model: 'modules.report-explosives.ExplosivesReportModel'
		        },
		        
		        plugins: [
	              Ext.create('Ext.grid.plugin.CellEditing', {
	                  clicksToEdit: 1
	              })
	            ],
		        
		        listeners: {
		        	edit: 'onCellEdit',
					rowclick: 'onRowClick',
					rowdblclick: 'onRowDblClick'
		        },
		        
		        columns: [{
		            text: 'Sender',
		            dataIndex: 'sender',
		            width: 125
		        }, {
		            text: 'Date Submitted',
		            dataIndex: 'submitted',
		            width: 125
		        },{
		        	text: 'Status',
		        	dataIndex: 'status',
		        	editor: {
	                    xtype: 'combo',
	                    store: ['Open', 'Resolved', 'Canceled']
	                }
		        },{
		            text: 'UXO Type',
		            dataIndex: 'type',
		            width: 75
		        },{
		            text: 'Priority',
		            dataIndex: 'priority',
		            width: 75
		        }]
	        });
	 	} 
	});
});
