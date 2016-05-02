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
define(['./ChatLog', './ChatController', './PresenceController'],
		function(ChatLog, ChatController, PresenceController) {

	var tooltipTemplate = new Ext.Template([
	  'Username: {username:defaultValue("N/A")} <br>',
	  'Name: {nickname:defaultValue("N/A")} <br>',
	  'Organization: {organization:defaultValue("N/A")} <br>',
	  'Status: {status:defaultValue("N/A")}'
	]);

	return Ext.define('modules.whiteboard.ChatView', {
	 
	 	extend: 'Ext.panel.Panel',

	 	controller: 'chatcontroller',
	 
	 	initComponent: function(){
			
			this.callParent();
	 	},
	 	
	 	config: {
	 		layout: 'border',
	 		maskElement: 'body'
	 	},
	 	
	 	listeners: {
	 		'afterlayout': 'onPanelLayout'
	 	},
	 	
	    items: [{
	        xtype: 'chatlog',
	        region: 'center',
	        reference: 'chatLog',
	        
	        //TODO: Move to css
	        style: {
	            overflow: 'auto',
	            backgroundColor: 'white'
	        }
	    },{
	        region: 'south',
	        xtype: 'form',
	        layout: {
	            type: 'hbox',
	            align: 'stretch'
	        },
	        
	        items: [{
	            xtype     : 'textareafield',
	            emptyText : 'Send a message',
	            height: 25,
	            flex: 1,
	            grow: false,
	            disabled: true,
		        reference: 'chatBox',
		        
		        stripCharsRe: /<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>|<.*[\/\\]*>/gi,
		        fieldStyle: {
		            minHeight: 'initial'
		        },
		        
		        enterIsSpecial: true,
		        listeners: {
		        	'specialkey': 'onChatBoxSpecialKey'
		        }
	        },
	        {
	            xtype     : 'button',
	            text      : 'Send',
		        reference: 'sendBtn',
		        handler: 'onSendButtonClick'
	        }]
	        
	        	
	    }, {
	    	region: 'east',
	    	xtype: 'grid',
	    	
            split: true,
            width: 300,
            
            hideHeaders: true,
            columnLines: false,
            disableSelection: true,
            bufferedRenderer: false,
            
            controller: 'presencecontroller',
            
            viewConfig: {
                getRowClass: function(record, rowIndex, rowParams, store){
                    if (record.get("status") == 'LEAVING') {
                    	return 'leaving-presence-row';
                    }
                }
            },
            
            columns: [{
                dataIndex: 'status',
                width: '25px',
                renderer: function(value, metadata, record) {
                	metadata.tdCls = value.toLowerCase() + '-presence-status-icon';
                }
            }, {
                text: 'Name',
                xtype:'templatecolumn',
                tpl:'{nickname} ({organization})',
                defaultRenderer: function(value, meta, record){
                  //add our tooltip
                  meta.tdAttr='data-qtip="' + tooltipTemplate.apply(record.data) + '"';
                  
                  //do the default template column rendering
                  var data = Ext.apply({}, record.data, record.getAssociatedData());
                  return this.tpl.apply(data);
                },
                flex: 1
            }]
	    }]
	 });
});
