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
define(['ext', 'ol', "iweb/CoreModule", "nics/modules/UserProfileModule", "./TokenManager"], 
	function(Ext, ol, Core, UserProfile, TokenManager){
	
		return Ext.define('modules.datalayer.DatasourceImportController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.datalayer.datasourceimportcontroller',

			orgListTopic: 'nics.fileimport.orgs',
			
			init: function() {
				this.dataSourceType = this.getView().dataSourceType;
				this.capabilitiesFormat = this.getView().capabilitiesFormat;
				this.workspaceId = this.getView().workspaceId;
				this.tokenHandlerTopic =  "nics.datasource.token." + this.dataSourceType;
				
				this.mediator = Core.Mediator.getInstance();
				
				this.updateGridTitle();
				this.bindEvents();
				
				this.loadDataSources();
			},
	 
			bindEvents: function(){
				
				//Bind UI Elements
				Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.onLoadUserProfile.bind(this));
				Core.EventManager.addListener(this.orgListTopic, this.onLoadOrgs.bind(this));
				Core.EventManager.addListener("nics.data.loaddatasources." + this.dataSourceType, this.onLoadDataSources.bind(this));
				Core.EventManager.addListener("nics.data.adddatasource." + this.dataSourceType, this.onAddDatasource.bind(this));
				Core.EventManager.addListener("nics.data.adddatalayer." + this.dataSourceType, this.onAddDatalayer.bind(this));
				Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
				Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
				Core.EventManager.addListener("nics.collabroom.load", this.onLoadCollabRooms.bind(this))
				Core.EventManager.addListener(this.tokenHandlerTopic, this.tokenHandler.bind(this));
			},

			onLoadUserProfile: function(e) {
				var url = Ext.String.format('{0}/orgs/{1}?userId={2}',
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId(), UserProfile.getUserId());

				this.mediator.sendRequestMessage(url, this.orgListTopic);
			},

			onLoadOrgs: function(evt, response) {
				if (response && response.organizations) {
					var orgCombo = this.getView().getOrgCombo();
					orgCombo.store.loadData(response.organizations);
					orgCombo.store.autoSync = false;
					orgCombo.store.insert(0, {orgId: 'none', name: '&nbsp;'});
				}
			},

			onJoinIncident: function(evt, incident) {
				// Send a request for the list of collab rooms for this incident
				this.mediator.sendRequestMessage(
					this.getLoadCollabRoomUrl(incident.id, UserProfile.getUserId()), "nics.collabroom.load");
			},

			onCloseIncident: function(evt, incidentId) {
				// Clear and disable the collab room selector,
				// since the user is no longer in the incident
				this.getView().getCollabroomCombo().clearValue();
			},

			onLoadCollabRooms: function(evt, response) {
				if (response) {
					var rooms = response.results;
					var roomCombo = this.getView().getCollabroomCombo();
					// Populate the collab room selector
					roomCombo.store.loadData(rooms);
					roomCombo.store.autoSync = false;
				}
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
				
				Ext.Msg.show({
				    title:'Secure',
				    message: 'Would you like to secure the datasource?',
				    buttons: Ext.Msg.YESNO,
				    icon: Ext.Msg.QUESTION,
				    fn: function(btn) {
				        if (btn === 'yes') {
				            this.requestAuthentication(record);
				        } else if (btn === 'no') {
				        	this.getCapabilities(record,
								function(){
									this.storeDatasource(record);
								},
								function(){
									var rowEditPlugin = this.getView().getGrid().getPlugin('rowediting');
									rowEditPlugin.startEdit(record, 0);
								});
				        }
				    },
				    scope: this
				});
			},
			
			requestAuthentication: function(record){
				
				var _this = this;
				
				Ext.create('Ext.window.Window', {
				    height: 200,
				    width: 300,
				    layout: 'fit',
				    modal: true,
				    buttonAlign: 'center',
				    referenceHolder: true,
				    items: [
				        {
				            xtype: 'form',
				            frame: false,
				            reference: 'authForm',
						    record: record,
				            border: 0,
				            layout: {
				                type: 'hbox',
				                align: 'middle'
				            },
				            fieldDefaults: {
				                msgTarget: 'side',
				                labelWidth: 55
				            },
				            items: [
				                {
				                    xtype: 'container',
				                    flex: 1,
				                    padding: 10,
				                    layout: {
				                        type: 'vbox'
				                    },
				                    items: [
				                        {
				                            xtype: 'textfield',
				                            name: 'username',
				                            fieldLabel: 'Username',
				                            allowBlank: false
				                        },{
				                            xtype: 'textfield',
				                            name: 'password',
				                            fieldLabel: 'Password',
				                            inputType: 'password',
				                            allowBlank: false
				                        }
				                    ]
				                }
				            ]
				        }
				    ],
				    buttons: [{
				            text: 'Save',
				            handler: function () {
				               var component = this.up('window').items.get(0);
				               var internalurl = component.record.data.internalurl;
				               var username = component.getForm().findField("username").getValue();
				               var password = component.getForm().findField("password").getValue();
				              
				               var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);
							   var url = Ext.String.format("{0}/datalayer/{1}/token?internalurl={2}&" +
							   		"username={3}&password={4}",
									endpoint,
									UserProfile.getWorkspaceId(),
									internalurl, username, password);
								
								var topic = Core.Util.generateUUID();
								Core.EventManager.createCallbackHandler(topic, _this, _this.handleTokenResponse, 
										[component.record, username, password]);
								Core.Mediator.getInstance().sendRequestMessage(url, topic);
								
								//Close the window
								this.up('window').close();
				            }
				        }
				    ]
				}).show();
				
			},
			
			handleTokenResponse: function(record, username, password, evt, response){
				if(response.token){
					record.set("secure", true);
					TokenManager.addToken(record.get("datasourceid"), response);
					this.getCapabilities(record,
						function(){
							this.storeDatasource(record, username, password);
						},
						function(){
							var rowEditPlugin = this.getView().getGrid().getPlugin('rowediting');
							rowEditPlugin.startEdit(record, 0);
						});
				}else{
					Ext.MessageBox.alert("Authentication Error", "The username and password were not valid.");
					var rowEditPlugin = this.getView().getGrid().getPlugin('rowediting');
					rowEditPlugin.startEdit(record, 0);
				}
			},
			
			storeDatasource: function(record, username, password) {
				var values = {
					displayname: record.get('displayname'),
					internalurl: record.get('internalurl'),
					legend: record.get('legend')
				};
				
				if(username && password){
					values.username = username;
					values.password = password;
				}
				
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
			
			tokenHandler: function(evt, params){
				this.getCapabilities(params[0], params[1], params[2]);
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
				
				if(record.get('secure')){
					var token = TokenManager.getToken(record.get('datasourceid'),{
						topic: this.tokenHandlerTopic,
						params: [record, success, failure]
					});
					
					//The function will be called again if 
					//a token is successfully retrieved
					if(token == null){
						return;
					}else{
						url = url + "&token=" + token;
					}
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
						var caps;
						if(dataSourceType != 'arcgisrest') {
							var xmlDoc = new DOMParser().parseFromString(response.responseText, 'application/xml');
							caps = this.capabilitiesFormat.read(xmlDoc);
						} else {
							caps = this.capabilitiesFormat.read(response.responseText);
						}
						
						if (!caps || !caps.layers) {
							throw new Error("Failed to parse capabilities");
						}
						
						var layers = caps.layers,
								version = caps.version;
						
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
						record.set('version', version, {silent:true});
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
					legend = this.getView().getLegendInput(),
					refreshRate = this.getView().getRefreshRateCombo(),
					orgCombo = this.getView().getOrgCombo(),
					collabroomCombo = this.getView().getCollabroomCombo();
				
				var record = grid.getSelectionModel().getSelection()[0];
				var datasourceid = record.getId();
				var userSessionId = UserProfile.getUserSessionId();
				
				var values = {
					displayname: input.getValue(),
					baselayer: false,
					usersessionid: userSessionId,
					datalayersource: {
						layername: combo.getValue(),
						usersessionid: userSessionId,
						refreshrate: refreshRate.getValue()
					},
					legend: legend.getValue()
				};
				
				if(orgCombo.getValue()){
					values.datalayerOrgs = [{
						orgid: orgCombo.getValue()
					}];
				}
				
				if(collabroomCombo.getValue()){
					values.datalayerCollabrooms = [{
							collabroomid: collabroomCombo.getValue()
					}];
				}
				
				var version = record.get('version');
				if (version) {
					values.datalayersource.attributes = JSON.stringify({
						'version': version
					});
				}
				
				var url = Ext.String.format('{0}/datalayer/{1}/sources/{2}/layer',
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getWorkspaceId(), datasourceid);
				url = url +  Ext.String.format('?username={0}', UserProfile.getUsername());

				this.mediator.sendPostMessage(url, 'nics.data.adddatalayer.' + this.dataSourceType, values);
			},
			
			onAddDatalayer: function(evt, response) {
				var newLayers = response.datalayers;
				if (response.message == 'ok') {
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
				this.getView().getRefreshRateCombo().reset();
				this.getView().getOrgCombo().reset();
				this.getView().getCollabroomCombo().reset();
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
				this.getView().getRefreshRateCombo().setDisabled(disabled);
				this.getView().getOrgCombo().setDisabled(disabled);
				this.getView().getCollabroomCombo().setDisabled(disabled);
			},

			getLoadCollabRoomUrl: function(incidentId, userid) {
				return Ext.String.format("{0}/collabroom/{1}?userId={2}",
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					incidentId, userid);
			}
			
		});
});
