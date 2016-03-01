/*
 * Copyright (c) 2008-2015, Massachusetts Institute of Technology (MIT)
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
define(['ext', 'ol', "iweb/CoreModule", "nics/modules/UserProfileModule"], 
	function(Ext, ol, Core, UserProfile){
	
		return Ext.define('modules.datalayer.DatasourceImportController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.datalayer.datasourceimportcontroller',
			
			init: function() {
				this.dataSourceType = this.getView().dataSourceType;
				this.capabilitiesFormat = this.getView().capabilitiesFormat;
				this.workspaceId = this.getView().workspaceId;
				
				this.mediator = Core.Mediator.getInstance();
				
				this.updateGridTitle();
				this.bindEvents();
				
				this.loadDataSources();
			},
	 
			bindEvents: function(){
				
				//Bind UI Elements
				Core.EventManager.addListener("nics.data.loaddatasources." + this.dataSourceType, this.onLoadDataSources.bind(this));
				Core.EventManager.addListener("nics.data.adddatasource." + this.dataSourceType, this.onAddDatasource.bind(this));
				Core.EventManager.addListener("nics.data.adddatalayer." + this.dataSourceType, this.onAddDatalayer.bind(this));
			},
			
			updateGridTitle: function() {
				var panelTitle = this.getView().getTitle();
				
				var grid = this.getView().getGrid();
				var gridTitle = grid.getTitle();
				grid.setTitle(panelTitle + ' ' + gridTitle);
			},
			
			
			loadDataSources: function() {
				var url = Ext.String.format('{0}/datalayer/{1}/sources/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId(), this.dataSourceType);
				this.mediator.sendRequestMessage(url , 'nics.data.loaddatasources.' + this.dataSourceType);
			},
			
			onLoadDataSources: function(evt, data) {
				this.getView().getGrid().getStore().loadRawData(data.datasources);
			},
			
			onAddDataSourceClick: function() {
				var grid = this.getView().getGrid(),
					store = grid.getStore(),
					rowEditPlugin = grid.getPlugin('rowediting');
				
				var newRecords = store.getNewRecords();
				if (newRecords && newRecords.length) {
					rowEditPlugin.startEdit(newRecords[0], 0);
				} else {
					var records = store.insert(0, {});
					rowEditPlugin.startEdit(records[0], 0);
				}
			},
			
			onGridBeforeEdit: function(editor, context, eOpts) {
				var record = context.record;
				//only allow editing phantom records
				return record.phantom;
			},
			
			onGridCancelEdit: function(editor, context, eOpts) {
				var record = context.record;
				//remove phantom on cancel edit
				record.store.remove(record);
			},
			
			onGridEdit: function(editor, context, eOpts) {
				var record = context.record;
				this.getCapabilities(record,
					function(){
						this.storeDatasource(record);
					},
					function(){
						var rowEditPlugin = this.getView().getGrid().getPlugin('rowediting');
						rowEditPlugin.startEdit(record, 0);
					});
			},
			
			storeDatasource: function(record) {
				var values = {
					displayname: record.get('displayname'),
					internalurl: record.get('internalurl'),
					legend: record.get('legend')
				};
				
				var url = Ext.String.format('{0}/datalayer/{1}/sources/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId(), this.dataSourceType);
				this.mediator.sendPostMessage(url, 'nics.data.adddatasource.' + this.dataSourceType, values);
			},
			
			onAddDatasource: function(evt, response) {
				var newSources = response.datasources;
				if (newSources.length) {
					var grid = this.getView().getGrid();
					var newRecord = grid.getStore().getNewRecords()[0];
					newRecord.set(newSources[0]);
					newRecord.commit();
					
					this.getView().getGrid().getSelectionModel().deselect(newRecord);
				} else {
					Ext.Msg.show({
						title: 'Data Source',
						message: 'There was a problem saving the datasource',
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
			},
			
			getCapabilities: function(record, success, failure) {
			
				var url = "";
				
				if(this.dataSourceType == 'arcgisrest'){
					url = Ext.String.format('{0}?f=json', record.get('internalurl'));
				}
				else{
					url = Ext.String.format('{0}?service={1}&request=GetCapabilities',
						record.get('internalurl'), this.dataSourceType);
				}
				
				var dataSourceType = this.dataSourceType;
				
				Ext.Ajax.request({
					url: window.location.protocol + '//' + window.location.host + '/nics/proxy' ,
					method: 'GET',
					dataSourceType: dataSourceType,
					params : {
						url: url
					},
					
					success: function(response) {
						//can't use responseXML becaue the proxy doesn't return the correct content type
						var layers = null;
						if(dataSourceType != 'arcgisrest') {
							var xmlDoc = new DOMParser().parseFromString(response.responseText, 'application/xml');
							layers = this.capabilitiesFormat.read(xmlDoc);
						} else {
							layers = this.capabilitiesFormat.read(response.responseText);
						}
						
						if (!layers) {
							throw new Error("Failed to parse capabilities");
						}
						//ensure every layer has a title to display
						layers.forEach(function(layer){
							if (!layer.Title && layer.Name) {
								layer.Title = layer.Name;
							}
							if(dataSourceType == 'arcgisrest') {
								layer.Title = layer.name;
								layer.Name = layer.id;
							}
							
						});
						record.set('layers', layers, {silent:true});
						success && success.call(this);
					},
					failure: function(fp, o) {
						record.set('layers', [], {silent:true});
						Ext.Msg.show({
							title: 'Data Source',
							message: 'Failed to retrieve service capabilities',
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
						failure && failure.call(this);
					},
					scope: this
				});
			},
			
			onGridSelectionChange: function(store, selected, eOpts) {
				var record = selected.length && selected[0];
				if (record && !record.phantom) {
					this.focusOnRecord(record);
				} else {
					this.setFormDisabled(true);
				}
			},
			
			focusOnRecord: function(record) {
				var layers = record.get('layers');
				if (layers != null) {
					this.getView().getLayerCombo().getStore().loadData(layers);
					this.setFormDisabled(false);
					this.resetDatalayerForm();
				} else {
					this.getCapabilities(record, function(){
						if (!record.phantom) {
							this.focusOnRecord(record);
						}
					});
				}
			},
			
			onComboChange: function (combo, newValue, oldValue, eOpts) {
				//default the display name to the combo display value
				var input = this.getView().getLabelInput();
				input.setValue(combo.getRawValue());
			},
			
			onFormValidityChange: function(field, valid, eOpts) {
				var combo = this.getView().getLayerCombo(),
					input = this.getView().getLabelInput();
				
				var bothValid = combo.isValid() && input.isValid();
				this.getView().getImportButton().setDisabled(!bothValid);
			},
			
			onImportClick: function(){
				var grid = this.getView().getGrid(),
					combo = this.getView().getLayerCombo(),
					input = this.getView().getLabelInput(),
					legend = this.getView().getLegendInput();
				
				var record = grid.getSelectionModel().getSelection()[0];
				var datasourceid = record.getId();
				var userSessionId = UserProfile.getUserSessionId();
				
				var values = {
					displayname: input.getValue(),
					baselayer: false,
					usersessionid: userSessionId,
					datalayersource: {
						layername: combo.getValue(),
						usersessionid: userSessionId
					},
					legend: legend.getValue()
				};
				
				var url = Ext.String.format('{0}/datalayer/{1}/sources/{2}/layer', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId(), datasourceid);
				this.mediator.sendPostMessage(url, 'nics.data.adddatalayer.' + this.dataSourceType, values);
			},
			
			onAddDatalayer: function(evt, response) {
				var newLayers = response.datalayers;
				if (newLayers.length) {
					Ext.Msg.show({
						title: 'Data Layer',
						message: 'Your new data layer has been created',
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.INFO
					});
					this.resetDatalayerForm();
				} else {
					Ext.Msg.show({
						title: 'Data Layer',
						message: 'There was a problem saving the datasource',
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
			},
			
			resetDatalayerForm: function() {
				this.getView().getLabelInput().setValue('');
				this.getView().getLayerCombo().reset();
				this.getView().getImportButton().disable();
				this.getView().getLegendInput().reset();
			},
			
			/**
			 * Sets whether all out form elements should be disabled or not 
			 * 
			 * Necessary because fieldset.disable also mask all our inputs
			 */
			setFormDisabled: function(disabled) {
				this.getView().getLabelInput().setDisabled(disabled);
				this.getView().getLayerCombo().setDisabled(disabled);
				this.getView().getImportButton().setDisabled(disabled);
				this.getView().getLegendInput().setDisabled(disabled);
			}
			
		});
});
