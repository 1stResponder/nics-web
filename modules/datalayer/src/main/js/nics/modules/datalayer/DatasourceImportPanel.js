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
 define(["iweb/CoreModule", './DatasourceImportController'],
	function(Core, DatasourceImportController) {
	 
	var model = Ext.define(null, {
		extend: 'Ext.data.Model',
		
		idProperty: 'datasourceid',
		fields:[
			'datasourceid', 'displayname', 'internalurl','secure',
			{
				name: 'layers',
				persist: false
			}]
	 });
	 
	return Ext.define('modules.datalayer.DatasourceInputPanel', {
		extend: 'Ext.panel.Panel',
		
		controller: 'datalayer.datasourceimportcontroller',
		
		config: {
			layout: {
				type: 'vbox',
				align: 'stretch'
			}
		},

		items:[{
			xtype: 'grid',
			title: 'Data Sources',
			reference: 'grid',
			
			flex: 2,
			
			store: {
				proxy: {
					type: 'memory'
				},
				model: model
			},
			
			columns: [{
				text: 'Title',
				dataIndex: 'displayname',
				flex: 1,
				editor: {
					xtype: 'textfield',
					allowBlank: false
				}
			}, {
				text: 'URL',
				dataIndex: 'internalurl',
				flex: 1,
				
				editor: {
					xtype: 'textfield',
					vtype: 'url',
					allowBlank: false
				}
			}],
			
			
			tbar: ["->",{
				text: 'Add Data Source',
				baseCls: 'nontb_style',
				handler: 'onAddDataSourceClick'
			}],
			
			plugins: [{
				ptype: 'rowediting',
				pluginId: 'rowediting',
				clicksToEdit: 1
			}],
			
			listeners: {
				'beforeedit': 'onGridBeforeEdit',
				'canceledit': 'onGridCancelEdit',
				'edit': 'onGridEdit',
				'selectionchange': 'onGridSelectionChange'
			}
		},{
			xtype: 'fieldset',
			reference: 'fieldset',
			title: 'Import from Data Source',
			margin: '5px',
			padding: '5px',
			
			layout: {
				type: 'vbox',
				align: 'middle'
			},
			
			items:[{
				xtype: 'combobox',
				fieldLabel: 'Layer to import',
				reference: 'layerCombo',
				forceSelection: true,
				queryMode: 'local',
				allowBlank: false,
				allowOnlyWhitespace: false,
				disabled: true,
				
				store: {
					proxy: {
						type: 'memory'
					},
					fields: ['Title', 'Name']
				},
				displayField: 'Title',
				valueField: 'Name',
				
				listeners: {
					'change': 'onComboChange',
					'validitychange': 'onFormValidityChange'
				}
			}, {
				xtype: 'textfield',
				fieldLabel: 'Display Name',
				reference: 'titleInput',
				
				allowBlank: false,
				allowOnlyWhitespace: false,
				disabled: true,
				
				listeners: {
					'validitychange': 'onFormValidityChange'
				}
			}, {
				xtype: 'textfield',
				fieldLabel: 'Legend',
				reference: 'legendInput',
				
				allowBlank: true,
				disabled: true
				
				
			}, {
				xtype: 'combo',
				fieldLabel: 'Refresh Rate',
				reference: 'refreshRateCombo',
				queryMode: 'local',
				store: new Ext.data.SimpleStore({
					fields: [
						'value',
						'text'
					],
					data: [[30, '0:30'],[60, '1:00'], [90, '1:30'], [180, '3:00'], [300, '5:00']]
				}),
				valueField: 'value',
				displayField: 'text',
				allowBlank: false,
				disabled: true
			}, {
				xtype: 'button',
				text: 'Import Data Layer',
				reference: 'importButton',
				handler: 'onImportClick',
				disabled: true
			}]
			
		}],
		
		getGrid: function() {
			return	this.lookupReference('grid');
		},
		
		getFieldSet: function() {
			return	this.lookupReference('fieldset');
		},
		
		getLayerCombo: function() {
			return	this.lookupReference('layerCombo');
		},
		
		getLabelInput: function() {
			return	this.lookupReference('titleInput');
		},
		
		getImportButton: function() {
			return	this.lookupReference('importButton');
		},
		
		getLegendInput: function() {
			return	this.lookupReference('legendInput');
		},

		getRefreshRateCombo: function() {
			return this.lookupReference('refreshRateCombo');
		}
	});
});
