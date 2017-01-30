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
define(["iweb/CoreModule", 'nics/modules/user/UserSelectView', './NewBroadcastController'], 
		function(Core, UserSelectView) {
    
	return Ext.define('modules.broadcast.NewBroadcastView', {

        extend: 'Ext.Window',

        controller: 'newbroadcastcontroller',

        referenceHolder: true,
        
        listeners: {
        	show: 'onShow'
        },
        
        setIncidentId: function(incidentId){
        	this.incidentId = incidentId;
        },

        config: {
            title: 'Broadcast Alert',
            closable: true,
            width: 350,
            autoHeight: true,
            minButtonWidth: 0,
            closeAction: 'hide',
            items: [{
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                autoHeight: true,
                autoWidth: true,
                header: false,
                items: [ {
                		xtype: 'label',
		                id:'broadcast-label',
		                style: 'padding: 2px;marginTop: 2px;marginBottom: 2px;font-weight: bold',
		                html: 'Enter a message to broadcast. If no users are selected, the message will be broadcast to all users who have joined this incident.'
		            },{
		            	xtype: 'textarea',
	                    id: 'broadcastInputTextarea',
	                    reference: 'broadcastInput',
	                    stripCharsRe: /[^a-zA-Z0-9,_\-\.\s]/,
	                    maxLength: 500,
	                    enforceMaxLength: true
	                },{     
	                	xtype: 'button',
            			text: 'Search Users',
            			handler: 'onLookupUsers'
            		},{
            			xtype:'gridpanel',
            			height: 175,
            			multiSelect: true,
            			store: {
            	        	fields : ["username"]
            	        },
        	 	        columns: [{text: "User Name", flex: 1, sortable: true, dataIndex: 'username'}],
        	 	        stripeRows: true,
        	 	        reference: 'userGrid'
            		}                
                ]
            }],
            buttons: [
                {
                    text: 'Send',
                    listeners: {
                        click: 'publishAlert'
                    },
                    scale: 'medium'
                }, {
                    text: 'Clear',
                    listeners: {
                        click: 'clearMessage'
                    },
                    scale: 'medium'
                },{
                    text: 'Cancel',
                    listeners: {
                        click: 'onCancel'
                    },
                    scale: 'medium'
                }
            ],
            buttonAlign: 'center'
        }
    });
});


