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
 define(["iweb/CoreModule", './ExportController'], function(Core) {
	Ext.define('modules.datalayer.js.ExportView', {

		extend: 'Ext.Window',
		
		controller: 'exportcontroller',
		
		referenceHolder: true,

		requires: [ 'Ext.Panel', 'Ext.Button', 'Ext.form.TextField', 'Ext.Container', 'Ext.tree.Panel'],
		
		initComponent: function(){
			this.callParent();
			
			var typeCombo =  Core.UIBuilder.buildComboBox(
					'exportType', 'Export View', 135, ['exportType'], { reference: 'exportType' });
			
			typeCombo.getStore().loadData([["All"],["Point"],["Line"],["Polygon"]]);
			typeCombo.setValue(typeCombo.getStore().getAt(0).get('exportType'));
			
			var formatCombo = Core.UIBuilder.buildComboBox(
					'formatType', 'Export Format', 135, ['formatType', 'formatId'], { reference: 'exportFormat' });
			
			formatCombo.getStore().loadData([["Static KML", "static"],["Shape File", "shape"],["WMS Get Capabilities", "wms"],["WFS Get Capabilities", "wfs"]]);
			formatCombo.setValue(formatCombo.getStore().getAt(0).get('formatType'));
			
			formatCombo.addListener('select', function( combo, record, eOpts ){
				if(record.data.formatType.indexOf("Capabilities") > -1){
					typeCombo.setDisabled(true);
				}else{
					typeCombo.setDisabled(false);
				}
			});
				
			var panel = Ext.create("Ext.Panel", {
				layout: {
		            type: 'vbox',
		            align: 'stretch'
		        },
				autoHeight: true,
				autoWidth: true,
				title: "Please choose a view and an export format",
				items: [ 
					formatCombo,
					typeCombo
				]
			});
			
			this.add(panel);
		},
		
		getType: function(){
			var dropdown = this.lookupReference('exportType');
			var value = dropdown.getValue();
			var record = dropdown.findRecordByValue(value);
			return record.data.exportType;
		},
		
		getFormat: function(){
			var dropdown = this.lookupReference('exportFormat');
			var value = dropdown.getValue();
			var record = dropdown.findRecordByValue(value);
			return record.data.formatId;
		},
	
		config: {
			title: 'NICS',
			closable: true,
			width: 350,
			autoHeight: true,
			minButtonWidth: 0,
			closeAction: 'hide',
			buttons: [
	            {
	                text: 'OK',
	                listeners: {
						click: 'exportRoom'
					},
	            	scale: 'medium'
	        	}
	        ],
			buttonAlign: 'center'
		}
	});
});
