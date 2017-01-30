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
define(['./BroadcastController', 'nics/modules/UserProfileModule'], function(BroadcastController, UserProfile) {
	
	/* TODO : If an alert is only sent to a user who does not have delete privileges it can never be deleted
	 * TODO : Popup an alert if you get an alert!?
	 */

	return Ext.define('modules.broadcast.BroadcastView', {
	 	extend: 'Ext.grid.Panel',

	 	controller: 'broadcastcontroller',
	 	
	 	title: 'Alerts',
	 	
        viewConfig: {
            emptyText: 'There are no alerts'
        },
        
        store: {
        	model: 'modules.broadcast.BroadcastModel',
        	sorters: 'created'
        },
        
        listeners: {
        	rowdblclick : 'onDblClick'
        },
        
        selModel: {
        	mode: 'MULTI'
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
                tooltip: 'Create a new broadcast alert',
                reference: 'newAlertButton',
                handler: 'onNewButtonClick',
                disabled: true
            },{
            	xtype: 'button',
            	text: 'Delete',
                tooltip: 'Delete alert(s)',
                reference: 'deleteAlertButton',
                handler: 'onDeleteButtonClick',
                disabled: true,
                hidden: UserProfile.isReadOnly()
            }]
        }],
        
	 	
        columns: [{
            text: 'User',
            dataIndex: 'username',
            width: 175,
        }, {
            text: 'Created',
            xtype: 'datecolumn',
            format: 'Y-m-d H:i:s',
            dataIndex: 'created',
            width: 120
        }, {
            text: 'Alert',
            dataIndex: 'message',
            flex: 1
        }]
	});
});
