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
/*
* (c) Copyright, 2008-2016 Massachusetts Institute of Technology.
*
*     This material may be reproduced by or for the
*     U.S. Government pursuant to the copyright license
*     under the clause at DFARS 252.227-7013 (June, 1995).
*/
define(["iweb/CoreModule", './ImageImportController', 'iweb/core/FormVTypes'],
	function(Core, ImageImportController, FormVTypes) {
	
	return Ext.define('modules.datalayer.ImageImportPanel', {
		extend: 'Ext.panel.Panel',
		
		controller: 'datalayer.imageimportcontroller',
		
		config: {
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
		},
		items:[{
			xtype: 'form',
			title: 'Image Import',
			reference: 'formPanel',
			buttonAlign : 'center',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},

			items:[{
				xtype: 'textfield',
				fieldLabel: 'Create Display Name in NICS',
				name: 'displayname',
				reference: 'displayname',
				vtype:'simplealphanum',
				allowBlank: false,
				allowOnlyWhitespace: false,
				padding: '0 20',
				listeners: {
					change: 'onNameChange'
				}
			},{
				xtype:'filefield',
				fieldLabel: 'Choose images to upload',
				buttonOnly: true,
				name: 'fileName',
				reference: 'fileName',
				allowBlank: false,
				buttonText: 'Browse',
				padding: '0 20',
				listeners: {
					afterrender: 'onFileRender',
					change: 'onFileChange'
				}
			}],
			buttons: [{
				text: 'Upload',
				reference: 'uploadbutton',
				handler :  'onUpload',
				disabled: true
			}, {
				text: 'Cancel',
				handler :  'onCancel'
			}]
		},{
			xtype: 'dataview',
			reference: 'dataview',
			
			flex: 1,
			
			cls: 'image-upload-view',
			scrollable: 'vertical',
			
			store: {
				fields: ['filename', 'src', 'progress'],
				data: []
			},
			
			emptyText: "<div class='emptyText'>No images selected.<br>Click 'Browse' above </div>",
			deferEmptyText: false,
			
			itemSelector: 'div.thumb-wrap',
			tpl: [
				'<tpl for=".">',
					'<div class="thumb-wrap">',
						'<div class="thumb"><img src="{src}"></div>',
						'<span class="label">{filename}</span>',
						'<progress value="{progress}" max="100">{progress}%</progress>',
					'</div>',
				'</tpl>',
				'<div class="x-clear"></div>'
			]
		}]
	});
});
