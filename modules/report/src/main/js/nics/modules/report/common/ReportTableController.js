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
define([ 'ol', 'iweb/CoreModule', 'nics/modules/UserProfileModule',
		'./UserPickerView' ],

function(ol, Core, UserProfile, UserPicker) {
	
	Ext.define('modules.report.ReportTableController', {
		extend : 'Ext.app.ViewController',

		alias : 'controller.reporttablecontroller',

		reportView : {},

		fillColor : 'rgb(0,0,0)',

		strokeColor : 'rgb(0,0,0)',

		init : function(args) {
			this.mediator = Core.Mediator.getInstance();

			var source = new ol.source.Vector();
			this.vectorLayer = new ol.layer.Vector({
				source : source,
				style : Core.Ext.Map.getStyle
			});
			this.vectorLayer.setVisible(false);

			Core.Ext.Map.addLayer(this.vectorLayer);

			this.bindEvents();
		},

		bindEvents : function() {
			// Bind UI Elements
			Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
			Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
			Core.EventManager.addListener(this.loadEvt, this.onLoadReports.bind(this));
			
			Core.EventManager.fireEvent("nics.report.add", {
				title : this.reportTitle,
				component : this.getView()
			});
		},
		
		onJoinIncident : function(e, incident) {
			this.incidentName = incident.name;
			this.incidentId = incident.id;

			this.getView().enable();

			this.mediator.sendRequestMessage(Core.Config
					.getProperty(UserProfile.REST_ENDPOINT)
					+ "/reports/" + this.incidentId + '/' + this.reportType,
					this.loadEvt);

			this.newTopic = Ext.String.format(
					"iweb.NICS.incident.{0}.report.{1}.new", this.incidentId,
					this.reportType);
			this.mediator.subscribe(this.newTopic);
			this.newHandler = this.onLoadReports.bind(this)
			Core.EventManager.addListener(this.newTopic, this.newHandler);
		},

		onCloseIncident : function(e, incidentId) {
			this.mediator.unsubscribe(this.newTopic);

			Core.EventManager.removeListener(this.newTopic, this.newHandler);

			this.incidentId = null;
			this.incidentName = null;

			this.clearGridStore();
			this.clearImageStore();
			this.clearLayer();

			this.getView().disable();
		},

		showUserPicker : function(callback, scope, record) {
			var topic = "nics.report.user.picker";
			Core.EventManager.createCallbackHandler(topic, this,
					this.loadUserPicker, [ callback, scope, record ]);

			var url = Ext.String.format('{0}/users/{1}/enabled/{2}',
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId(), UserProfile.getOrgId());
			this.mediator.sendRequestMessage(url, topic);
		},

		loadUserPicker : function(callback, scope, record, evt, response) {
			var userPicker = new UserPicker({
				callback : callback,
				scope : scope,
				record : record
			});

			var users = [];
			for (var i = 0; i < response.data.length; i++) {
				users.push([ response.data[i].username ]);
			}

			userPicker.lookupReference('userDropdown').getStore().loadData(users);
			userPicker.show();
		},

		updateForm : function(form) {
			var url = Ext.String.format('{0}/reports/{1}/{2}', Core.Config
					.getProperty(UserProfile.REST_ENDPOINT), this.incidentId,
					this.reportType);

			if (!form.incidentid) {
				form.incidentid = this.incidentId;
			}
			if(!form.usersessionid){
				form.usersessionid = UserProfile.getUserSessionId();
			}

			this.mediator.sendPostMessage(url, this.newTopic, form);
		},

		addFeature : function(lon, lat, formId, color) {
			try {
				if (lat && lon) {
					var longitude = Number(lon);
					var latitude = Number(lat);

					var feature = new ol.Feature({
						geometry : new ol.geom.Point(ol.proj
								.transform([ longitude, latitude ],
										'EPSG:4326', 'EPSG:3857'))
					});

					feature.set('type', 'report');
					feature.set('fillColor', (color ? color : this.fillColor));
					feature.set('strokeColor', (color ? color : this.strokeColor));

					if (formId) {
						feature.set('formId', formId);
						// Replace old feature with new feature
						this.removeExistingFeature(formId);
					}

					this.vectorLayer.getSource().addFeature(feature);
					
					return feature;
				}
			} catch (e) {}
			
			return null;
		},

		removeExistingFeature : function(formId) {
			Ext.Array
					.each(this.vectorLayer.getSource().getFeatures(),
							function(feature) {
								if (feature.get('formId') == formId) {
									this.vectorLayer.getSource()
										.removeFeature(feature);
									return;
								}
							}, this);
		},

		onPlotButtonClick : function(button, pressed, eOpts) {
			this.vectorLayer.setVisible(pressed);
		},

		exportCSV : function() {
			var grid = this.lookupReference(this.view.gridRef);
			var gridStore = grid.store;

			var csv = "";
			var first = true;
			var _reportView = this.reportView;
			
			// Headers
			for (var prop in _reportView) {
				// Only show the data with values
				if (_reportView[prop]) {
					if(typeof _reportView[prop] === 'object'){
						csv += _reportView[prop].label + ',';
					}else{
						csv += _reportView[prop] + ',';
					}
				}
			}
			csv = csv.slice(0, -1);
			csv += "\r\n";
			
			gridStore.each(function(record) {
				var report = JSON.parse(record.data.message);
				// Data
				for (var prop in _reportView) {
						csv += report[prop] + ',';
				}
				csv = csv.slice(0, -1);
				csv += "\r\n";
			});
			window.open("data:text/csv;charset=utf-8," + escape(csv));
		},
		
		showReport : function(report) {
			var items = []

			for (var prop in this.reportView) {
				// Only show the data with values
				if (this.reportView[prop]) {
					if(typeof this.reportView[prop] === 'object'){
						items.push({
					        xtype: 'displayfield',
					        fieldLabel: this.reportView[prop].label,
					        value: Ext.String.format(this.reportView[prop].html, report[prop])
					    });
					}else{
						items.push({
					        xtype: 'displayfield',
					        fieldLabel: this.reportView[prop],
					        value: report[prop]
					    });
					}
				}
			}

			if (items.length > 0) {
				var formWindow = new Ext.Window({
					closable : true,
					closeAction : 'destroy',
					scrollable : true,
					width : 575,
					height : 600,
					title : 'Report',
				    bodyPadding: 10,
					items : [ {
						xtype : 'panel',
						layout : {
							type : 'vbox',
							align : 'stretch'
						},
						items : items
					} ],
					buttonAlign: 'center',
					buttons: [{
			        	text: 'Cancel',
			        	handler: function(){
			        		this.findParentByType('window').close();
			        	} 
			          }
					]
				});

				formWindow.show();
			}
		},

		clearGridStore : function() {
			var store = this.lookupReference(this.view.gridRef).store;
			if (store) {
				store.removeAll();
				store.clearFilter();
			}
		},

		clearImageStore : function() {
			var imagePanel = this.lookupReference(this.view.imageRef);
			var store = imagePanel.store;
			if (store) {
				store.removeAll();
			}
			imagePanel.refresh();
		},

		clearLayer : function() {
			var plotButton = this.lookupReference(this.view.plotBtnRef);
			if (plotButton) { plotButton.toggle(false); }
			
			this.vectorLayer.getSource().clear();
			
			this.vectorLayer.setVisible(false);
		},

		addImage: function(report){
			var message = JSON.parse(report.message);
			var imageStore = this.lookupReference(this.view.imageRef).store;
			
			//Add Image
			var image = message[this.imageProperty];
			if(!Ext.isEmpty(image)){
	            var arr = new Array(1);
	            var filenameChunks = image.split('/');
	            var filename = filenameChunks[filenameChunks.length - 1];
	            var filetypeChunks = filename.split('.');
	            var filetype = filetypeChunks[filetypeChunks.length - 1];
				
				imageStore.loadRawData([{
					formId: report.formId,
			        url: message[this.imagePath],
			        filename: filename,
			        filetype: filetype
				}], true);
			}
			imageStore.filter('formId', 0, true);
		},
		
		onLoadReports: function(e, response) {
			var newReports = [];
			var gridStore = this.lookupReference(this.view.gridRef).store;
			
			if(response){
				//Handle array of reports
				if(response.reports && response.reports.length > 0) {
					for(var i=0; i<response.reports.length; i++){
						var report = response.reports[i];
						newReports.push(this.getFormData(report));
						this.addImage(report);
					}
				}
				//Handle single report
				else if(response.formId){
					newReports.push(this.getFormData(response));
				}
				//Add to grid
				gridStore.loadRawData(newReports, true);
			}
		}
	});
});
