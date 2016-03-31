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
define(['ext'], function(Ext) {

	return Ext.define('modules.collabroom.CreateCollabroomWindow', {
	 
	 	extend: 'Ext.window.Window',
	 	
	 	requires: [ 'Ext.Panel', 'Ext.Button', 'Ext.form.TextField', 'Ext.Container', 'Ext.menu.Item' ],
	 	
	 	defaultListenerScope: true,
	 	referenceHolder: true,
	 	

		
		items: [{
			xtype: 'form',
			reference: 'form',
			
			border: false,
			
			bodyStyle: {
				backgroundColor: 'inherit'
			},
			
			items: [{
					xtype: 'component',
					margin: '5 10',
					html: [
						'Select a room to create:'
					]
				}, {
					xtype: 'container',
					margin: '5 20',
					
					reference: 'presetContainer',
					
					listeners: {
						click: 'onPresetClick',
						element: 'el',
						delegate: 'li.preset-value',
						scope: "self"
					},
					
					html:''
					
				}, {
					xtype: 'component',
					margin: '5 10',
					html: [
						'Or enter a custom room name:'
					]
				}, { 
					xtype: 'textfield',
					fieldLabel: 'Name',
					name: 'name',
					reference: 'nameInput',
					margin: '5 20',
					stripCharsRe: /[^a-zA-Z0-9_\-\s]/,
					maxLength: 64,
					enforceMaxLength: true,
					
					allowBlank: false,
					allowOnlyWhitespace: false
				},
				{ 
					xtype: 'checkbox',
					boxLabel: 'Secure Room',
					name: 'secureRoom',
					reference: 'secureRoomCB',
					margin: '5 20',
					hidden: true,
					listeners: {
						change: "onSecureRoomClick"
					}
				}]
		}
				
		],
	 	
	 	buttons: [
	 	          { 
	 	        	  xtype: 'button', 
	 	        	  text: 'Create', 
	 	        	  handler: 'onCreateButtonClick'
	 	          },
	 	          { 
	 	        	  xtype: 'button', 
	 	        	  text: 'Cancel',
	 	        	  handler: 'onCancelButtonClick'
	 	          }
	 	],
	 	
	 	config: {
	 		cls: 'rooms-window',
	 		bodyBorder : false,
			layout : 'fit',
			minimizable : false,
			closable : true,
			maximizable : false,
			resizable : false,
			draggable : false,
			padding : 10,
			width: 680,
			closeAction: 'destroy',
			buttonAlign: 'center',
			fieldDefaults: {
				labelAlign: 'right',
				labelWidth: 100
			}
		},
		
		initComponent: function() {
			this.callParent(arguments);
			
			var container = this.lookupReference('presetContainer');
			container.html = this.getPresetMarkup(this.roomPresets, this.existingRooms);
			
		},
		
		getPresetMarkup: function(roomsDef, existing) {
			var tpl = new Ext.XTemplate(
			 		'<ol class="presets">',
			 			'<tpl foreach=".">',
		 				'<li class="preset-group">{$}:',
			 				'<tpl for=".">',
				 			'<ol>',
				 				'<tpl if="this.isUsed($v)">',
				 					'<li class="preset-value disabled">{.}</li>',
				 				'<tpl else>',
				 					'<li class="preset-value">{.}</li>',
				 				'</tpl>',
			 				'</ol>',
			 				'</tpl>',
		 				'</li>',
		 				'</tpl>',
					'</ol>',
					{
			 			// XTemplate configuration:
			 			disableFormats: true,
			 			// member functions:
			 			isUsed: function(title){
			 				return existing.indexOf(title) != -1;
			 			}
					}
				).compile();
			
			return tpl.apply(roomsDef);
		},
		
		reset: function(){
			this.setName("");
		},
	
		getName: function(){
			return this.lookupReference('nameInput').getValue();
		},
	
		setName: function(name){
			return this.lookupReference('nameInput').setValue(name);
		},

		onPresetClick: function(evt) {
			var disabled = Ext.fly(evt.target).hasCls("disabled");
			
			var val = evt.target.textContent;
			if (!disabled && val) {
				this.setName(val);
				this.onCreateButtonClick();
			}
		},
		
		onCreateButtonClick: function() {
			var form = this.lookupReference('form');
			if (form.isValid()) {
				this.fireEvent('create', this, form.getValues());
			}
		},
		
		onCancelButtonClick: function() {
			this.fireEvent('cancel', this);
			this.close();
		},
		
		onSecureRoomClick: function(checkbox) {
			if(checkbox.checked){
				this.fireEvent('secure', this);
			}else{
				this.fireEvent('unsecure', this);
			}
		}
	 });
});
