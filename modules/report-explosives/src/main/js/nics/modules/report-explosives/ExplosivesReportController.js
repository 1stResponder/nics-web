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
define(['ol',
        'iweb/CoreModule',
 		'nics/modules/UserProfileModule',
 		'nics/modules/report/common/ReportTableController',
        './ExplosivesGraphView'],

	function(ol, Core, UserProfile, ExplosivesGraphView){
	
		return Ext.define('modules.report-explosives.ExplosivesReportController', {
			extend : 'modules.report.ReportTableController',
			
			alias: 'controller.explosivesreportcontroller',
			
			imageProperty: 'ur-fullPath',
			
			imagePath: 'ur-fullPath',
			
			reportView: { 
				userfull: "User Full Name",
				user: "User",
				status: "Status",
				"ur-reportinglocation": "Reporting Location",
				"ur-longitude": "Longitude",
				"ur-latitude": "Latitude",
				"ur-condition": "Condition",
				"ur-uxotype": "Type",
				"ur-shape": "Shape",
				"ur-size": "Size",
				"ur-impactonmission": "Impact Mission",
				"ur-recommendedpriority": "Recommended Priority",
				"ur-contactinfo": "Contact Info",
				"ur-protectivemeasures": "Protective Measures",
				"ur-resourcethreatened": "Resource Threatened",
				"ur-reportingunit": "Reporting Unit",
				"ur-cbrncontamination": "CBRN Contamination",
				"ur-color": { label: "Color", html: "<span style='background-color:{0};color:{0}'>{0}</span><br/>"}
			},
			
			init: function(){
				this.callParent();
				
				//Listen for onclick
				var select = Core.Ext.Map.getSelectInteraction();
				select.on("select", this.onMapViewSelect.bind(this));
			},
			
			onZoom: function(){
				var record = this.lookupReference(this.view.gridRef).getSelectionModel().getSelection()[0];
				if(record && record.data.feature){
					 var extent = record.data.feature.getGeometry().getExtent();
			    	 Core.Ext.Map.zoomToExtent(extent);
			    	 Core.Ext.Map.zoomTo(12);
				}
			},
			
			onCellEdit: function(editor, context){
				var message = JSON.parse(context.record.data.message);
				message.status = context.record.data.status;
				
				this.updateForm({
					formId: context.record.data.formId,
					message: JSON.stringify(message)
				});
			},

			showReportWindow: function() {
				var explosivesGraph = Ext.create('modules.report-explosives.ExplosivesGraphView');
				explosivesGraph.controller.setIncident(this.incidentId);
				var report = new Ext.Window({
					closable: true,
					closeAction: 'hide',
                    scrollable: true,
					title: 'Explosives Report',
					layout: 'fit',
					width: 600,
					height: 600,
					items: [
						explosivesGraph
					],
					buttonAlign: 'center',
					buttons: [{
			        	text: 'Cancel',
			        	handler: function(){
			        		this.findParentByType('window').close();
			        	} 
			          }
					]
				});
				report.show();
			},
			
			onRowDblClick: function(grid, record, tr, rowIndex, e, eOpts){
				if(record.data.message){
					this.showReport(JSON.parse(record.data.message));
				}
			},
			
			onRowClick: function(grid, record, tr, rowIndex, e, eOpts ){
				var store = this.lookupReference(this.view.imageRef).store;
        		store.filter('formId', record.data.formId);
			},
			
			getColor: function(status){
				if(status){
					if(status === "Open") {
						return '#e3ff00';
					} else if(status === "Canceled") {
						return '#b1b2ac';
					} else if(status === "Resolved") {
						return '#09ff00';
					}
				}
				return null;
			},
			
			getFormData: function(report){
				var message = JSON.parse(report.message);
				
				if(message["ur-longitude"] && message["ur-latitude"]){
					var feature = this.addFeature(message["ur-longitude"], message["ur-latitude"], 
							report.formId, this.getColor(message.status));
				}
				
				return {
					formId: report.formId,
					sender: message["userfull"],
				    submitted: Core.Util.formatDateToString(new Date(report.seqtime)),
					type: message["ur-uxotype"],
					priority: message["ur-recommendedpriority"],
				    message: report.message,
				    status: message.status ? message.status : "Open",
				    feature: feature
				};
			},
			

			onMapViewSelect: function(evt){
				var features = evt.selected;
				if(features && features.length == 1){
					var feature = features[0];
					var formId = feature.get('formId');
					if(features[0].get('type') === 'report' && formId){
						var store = this.lookupReference(this.view.gridRef).store;
						var rowIndex = store.find('formId', formId);
						if(rowIndex > -1){
							var record = store.getAt(rowIndex);
							if(record && record.data.message){
								this.showReport(JSON.parse(record.data.message));
							}
						}
					}
				}
			}
		});
});
