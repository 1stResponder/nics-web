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
define(['iweb/CoreModule','./GeneralReportController', 
        './GeneralReportModel', 'nics/modules/report/common/ReportImageModel',
        'nics/modules/report/common/ReportTableView'], 
		function(Core, GeneralReportController, GeneralReportModel) {

	return Ext.define('modules.report-general.GeneralReportView', {
	 	extend: 'modules.report.ReportTableView',

	 	controller: 'generalreportcontroller',
	 	
	 	gridRef: 'gridPanel',
	 	
	 	initComponent: function(){
	 		this.callParent();
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
		        	model: 'modules.report-general.GeneralReportModel'
		        },
		        
		        plugins: [
	              Ext.create('Ext.grid.plugin.CellEditing', {
	                  clicksToEdit: 1
	              })
	            ],
				
				listeners: {
					beforeedit: 'onBeforeCellEdit',
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
		            flex: 1
		        }, {
		            text: 'Recipient',
		            dataIndex: 'recipient',
		            flex: 2
		        },{
		            text: 'Assigned To',
		            dataIndex: 'assigned',
		            editor: {},
		            width: 75
		        },{
		            text: 'Status',
		            dataIndex: 'status',
		            width: 75,
	                editor: {
	                    xtype: 'combo',
	                    store: ['Acknowledged', 'Unacknowledged']
	                }
		        },{
		            text: 'Acknowledge Date',
		            /*xtype: 'datecolumn',
		            format: 'Y-m-d H:i:s',*/
		            dataIndex: 'acknowledged',
		            width: 100
		        }]
		 	});
	 	}
	});
});
