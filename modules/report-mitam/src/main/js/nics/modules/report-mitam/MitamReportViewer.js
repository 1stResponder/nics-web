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
define(['iweb/CoreModule','./MitamReportController', './MitamReportModel'], 
		function(Core, MitamReportController, MitamReportModel) {

	return Ext.define('modules.report-mitam.MitamReportViewer', {
	 	extend: 'Ext.grid.Panel',

	 	controller: 'mitamreportcontroller',
	 	
	 	header: false,
	 	
        viewConfig: {
            emptyText: 'There are no reports'
        },
        
        store: {
        	model: 'modules.report-mitam.MitamReportModel'
        },
        
        listeners: {
        	selectionchange: 'onSelectionChange',
        	rowdblclick: 'viewReport'
        },
                
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            layout: {
            	pack: 'start'
            },
            items: [{
            	xtype: 'button',
            	text: 'New',
                tooltip: 'Create a new form',
                reference: 'newButton',
                handler: 'onNewButtonClick'
            },{
            	xtype: 'button',
            	text: 'Update',
                tooltip: 'Update an existing form',
                reference: 'updateButton',
                handler: 'onEditReport',
                disabled: true
            },{
            	xtype: 'button',
            	text: 'Close',
                tooltip: 'Close an existing form',
                reference: 'closeButton',
                handler: 'onCloseReport',
                disabled: true
            }]
        }],
        
	 	columns: [{
            text: 'Id',
            dataIndex: 'id',
            width: 50
        }, {
            text: 'Name',
            dataIndex: 'name',
            flex: 1
        }, {
            text: 'Categories',
            dataIndex: 'categories',
            flex: 2
        },{
            text: '#',
            dataIndex: 'destinations',
            width: 50
        },{
            text: 'Status',
            dataIndex: 'status',
            width: 75
        }, {
            text: 'Date Created',
            /*xtype: 'datecolumn',
            format: 'Y-m-d H:i:s',*/
            dataIndex: 'datecreated',
            width: 100
        }, {
            text: 'Date Updated',
            /*xtype: 'datecolumn',
            format: 'Y-m-d H:i:s',*/
            dataIndex: 'dateupdated',
            width: 100
        }],
        
        selModel: {
	          selType: 'checkboxmodel',
	          showHeaderCheckbox: false,
	          mode: 'single'
	    }
	});
});
