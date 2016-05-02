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
define(['./AnnouncementController','./AnnouncementModel', './AnnouncementForm' , 'nics/modules/report/common/FormVTypes'], 
		function(AnnouncementController, AnnouncementModel, AnnouncementForm) {

	return Ext.define('modules.administration.AnnouncementView', {
	 	extend: 'Ext.Panel',

	 	controller: 'announcementcontroller',
	 	
	 	closable: false,
        
	 	closeAction: 'hide',
        
        autoScroll: true,
        
        reference: 'announceView',
        
      
        config: {
	 		autoWidth: true,
	 		autoHeight: true,
	 		layout: {
	            type: 'vbox',
	            align: 'stretch'
	        },
	       // title: 'Announcements'
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
            	hidden: false,
            	reference: 'createButton',
            	handler: 'addMessage'
    			
            },
            {
            	xtype: 'button',
            	text: 'Delete Selection',
            	hidden: true,
            	reference: 'deleteButton',
            	handler: 'deleteSelection'
    			
            },
            {
            	xtype: 'button',
            	text: 'Clear Selection',
            	hidden: true,
            	reference: 'clearButton',
            	handler: 'clearSelection'
    			
            }]
        }],
	 	initComponent: function(){
			this.callParent();
			
			//Grid
			this.add({
	            xtype: 'grid',
	            reference: 'announceGrid',
	            region: 'north',
	            height: this.gridHeight,
	            store: {
		        	model: 'modules.administrator.announcements.AnnouncementModel',
		        	sorters: 'date'
		        	
		        	
		        },
		        
		        listeners: {
		        	selectionchange: 'onSelectionChange'
		        },
		        columns: [{
		            text: 'Date',
		            dataIndex: 'created',
		            xtype: 'datecolumn', 
		            format:'Y-m-d' ,
		            flex: 1
		        }, {
		            text: 'Anouncement',
		            dataIndex: 'message',
		            	flex: 2,
		            	vtype:'extendedalphanum'
		        }],
		        
	        });
			
			//Form
			this.add(new AnnouncementForm());
			
	 	},
	 	
	    
    });
});
