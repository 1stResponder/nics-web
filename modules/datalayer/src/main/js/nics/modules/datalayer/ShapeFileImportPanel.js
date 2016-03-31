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
 define(["iweb/CoreModule", './ShapeFileImportController'],
	function(Core, ShapeFileImportController) {
	 
	return Ext.define('modules.datalayer.ShapeFileImportPanel', {
		extend: 'Ext.panel.Panel',
		
		controller: 'datalayer.shapefileimportcontroller',
		
		config: {
			layout: {
				type: 'vbox',
				align: 'stretch'
			}
		},
		
		items:[{
			xtype: 'form',
			title: 'ESRI Shape File Import',
			reference: 'formPanel',
			buttonAlign : 'center',
			layout: {
				type: 'vbox',
				align: 'center'
			},
			defaults:{
				width: '100%',
				xtype: 'textfield',
				padding: '0 20'
			},
			items:[{
				xtype:'filefield',
				name: 'shpFile',
				fieldLabel: 'Choose a shape file to load as a data layer',
				buttonText: 'Browse',
				extension: 'shp',
				allowBlank: false
			},{
				xtype:'filefield',
				name: 'shxFile',
				fieldLabel: 'Choose a shx file',
				buttonText: 'Browse',
				extension: 'shx',
				allowBlank: false
			},{
				xtype:'filefield',
				name: 'dbfFile',
				fieldLabel: 'Choose a dbf file',
				buttonText: 'Browse',
				extension: 'dbf',
				allowBlank: false
			},{
				xtype:'filefield',
				name: 'prjFile',
				fieldLabel: 'Choose a prj file',
				buttonText: 'Browse',
				extension: 'prj',
				allowBlank: false
			},{
				xtype:'filefield',
				name: 'sldFile',
				fieldLabel: 'Choose a sld file',
				buttonText: 'Browse',
				extension: 'sld'
			},{
				xtype: 'textfield',
				name: 'displayName',
				fieldLabel: 'Display Name',
				allowBlank: false
			}],
			buttons: [{
				text: 'Upload',
				handler :  'submitForm',
				formBind: true
			}]
		}],
		
		getFormPanel: function() {
			return	this.lookupReference('formPanel');
		}
		
	});
});
