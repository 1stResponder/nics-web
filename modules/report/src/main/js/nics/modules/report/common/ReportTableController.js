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
define([ 'ol', 'iweb/CoreModule', 'iweb/modules/MapModule',
			'nics/modules/UserProfileModule', './UserPickerView' ],

function(ol, Core, MapModule, UserProfile, UserPicker) {
	
	Ext.define('modules.report.ReportTableController', {
		extend : 'Ext.app.ViewController',

		alias : 'controller.reporttablecontroller',

		reportView : {},

		fillColor : 'rgb(0,0,0)',

		strokeColor : 'rgb(0,0,0)',

		orgCaps: [],

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
			Core.EventManager.addListener("nics.user.profile.loaded", this.updateOrgCapsListener.bind(this));
			
			Core.EventManager.fireEvent("nics.report.add", {
				title : this.reportTitle,
				component : this.getView()
			});

			Core.EventManager.addListener("map-selection-change", this.onMapSelectionChange.bind(this));

			this.getGrid().on("selectionchange", this.onGridSelectionChange.bind(this));

			MapModule.getMapStyle().addStyleFunction(this.styleReportFeature.bind(this));
			
			this.bindOrgCapUpdate = this.orgCapUpdate.bind(this);
		},
		
		updateOrgCapsListener: function(evt, data){
			
			if(this.currentOrg){
				this.mediator.unsubscribe("iweb.nics.orgcaps." + this.currentOrg + "." + this.reportType);
				Core.EventManager.removeListener("iweb.nics.orgcaps." + this.currentOrg + "." + this.reportType, this.bindOrgCapUpdate);
			}
			
			this.currentOrg = UserProfile.getOrgId();
			
			var orgCapInArray = false;
			
			for(var i = 0; i < this.orgCaps.length; i++){
				if(this.orgCaps[i].currentOrg == this.currentOrg && this.orgCaps[i].reportType == this.reportType){
					orgCapInArray = true;
				}
			}
			
			if(!orgCapInArray){
				Core.EventManager.addListener("iweb.nics.orgcaps." + this.currentOrg + "." + this.reportType, this.bindOrgCapUpdate);
				this.orgCaps.push({ 'orgId': this.currentOrg , 'reportType': this.reportType });
			}
			
			this.mediator.subscribe("iweb.nics.orgcaps." + this.currentOrg + "." + this.reportType);

		},
		
		orgCapUpdate: function(evt, orgcap){

			if(orgcap.activeWeb){
				this.getView().enable();
				this.getView().up('tabpanel').down('tab[text=' + this.reportTitle +']').enable();
			}
			else{
				this.getView().disable();
				this.getView().up('tabpanel').down('tab[text=' + this.reportTitle +']').disable();
			}
		
			UserProfile.setOrgCap(orgcap.cap.name,orgcap.activeWeb);
		
		},
		
		onJoinIncident : function(e, incident) {
			this.incidentName = incident.name;
			this.incidentId = incident.id;

			if(UserProfile.isOrgCapEnabled(this.reportType)){
				this.getView().enable();
				this.getView().up('tabpanel').down('tab[text=' + this.reportTitle +']').enable();
			}
			else{
				this.getView().disable();
				this.getView().up('tabpanel').down('tab[text=' + this.reportTitle +']').disable();
			}
	
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
						feature.setId(formId);
						// Replace old feature with new feature
						this.removeExistingFeature(formId);
					}

					this.vectorLayer.getSource().addFeature(feature);
					
					return feature;
				}
			} catch (e) {}
			
			return null;
		},

		styleReportFeature: function(feature, resolution, selected) {
			if (feature.get('type') != 'report') {
				return;
			}
			var styles = [ new ol.style.Style({
				image : new ol.style.Circle({
					radius : 8,
					fill : new ol.style.Fill({
						color : feature.get('fillColor')
					}),
					stroke : new ol.style.Stroke({
						color : feature.get('strokeColor')
					})
				})
			})];

			if (selected) {
				styles.unshift(new ol.style.Style({
					image: new ol.style.Circle({
						radius: 16,
						fill: new ol.style.Fill({
							color: 'rgba(0, 255, 255, 0.4)'
						}),
						stroke: new ol.style.Stroke({
							color: 'rgb(0, 255, 255)'
						})
					})
				}));
			}

			return styles;
		},

		removeExistingFeature : function(formId) {
			var layerSrc = this.vectorLayer.getSource();
			var feature = layerSrc.getFeatureById(formId);
			if (feature) {
				layerSrc.removeFeature(feature);
				
				//unselect the element being removed
				var selectedCollection = Core.Ext.Map.getSelection();
				selectedCollection.remove(feature);
			}
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
			var items = [];

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

		onMapSelectionChange: function(e, features) {
			//prevent reentrance
			if (this.syncingSelection) {
				return;
			}
			this.syncingSelection = true;
			
			var grid = this.getGrid(),
					store = grid.getStore();

			var records = features.map(function(feature){
				return store.getById( feature.getId() );
			}).filter(function(n){ return n !== null; });

			var selectionModel = grid.getSelectionModel();
			if (records.length) {
				//select our records, clearing previous selection
				selectionModel.select(records, /* keepExisting */ false);
			} else {
				selectionModel.deselectAll();
			}
			
			this.syncingSelection = false;
		},

		onGridSelectionChange: function(grid, selection, eOpts) {
			//don't select when layer is hidden
			if (!this.vectorLayer.getVisible()) {
				return;
			}
			
			//prevent reentrance
			if (this.syncingSelection) {
				return;
			}
			this.syncingSelection = true;

			var layerSrc = this.vectorLayer.getSource();

			//find each record's matching feature
			var features = selection.map(function(model){
				return layerSrc.getFeatureById( model.getId() );
			}).filter(function(n){ return n !== null; });

			//add them all to selected collection
			var selectedCollection = Core.Ext.Map.getSelection();
			selectedCollection.clear();
			if (features.length) {
				selectedCollection.extend(features);
				this.centerOnFeatures(features);
			}
			
			this.syncingSelection = false;
		},

		centerOnFeatures : function(features) {
			//build an extent from our features
			var featuresExtent = ol.extent.createEmpty();
			features.forEach(function(feature){
				ol.extent.extend(featuresExtent, feature.getGeometry().getExtent());
			});
			var featuresCenter = ol.extent.getCenter(featuresExtent);
			
			var map = MapModule.getMap(),
					view = map.getView();
			view.setCenter(featuresCenter);
		},

		zoomOnFeatures : function(features) {
			//build an extent from our features
			var featuresExtent = ol.extent.createEmpty();
			features.forEach(function(feature){
				ol.extent.extend(featuresExtent, feature.getGeometry().getExtent());
			});

			var map = MapModule.getMap(),
					view = map.getView();
			view.fit(featuresExtent, map.getSize(), {
				maxZoom: 12 //don't zoom in too far
			});
		},

		getGrid : function () {
			return this.lookupReference(this.view.gridRef);
		},

		clearGridStore : function() {
			var store = this.getGrid().store;
			if (store) {
				store.removeAll();
				store.clearFilter();
			}
		},

		clearImageStore : function() {
			var imagePanel = this.lookupReference(this.view.imageRef);
			if(imagePanel){
				var store = imagePanel.store;
				if (store) {
					store.removeAll();
				}
				imagePanel.refresh();
			}
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
					this.addImage(response);
					
				}
				//Add to grid
				gridStore.loadRawData(newReports, true);
			}
		}
	});
});
