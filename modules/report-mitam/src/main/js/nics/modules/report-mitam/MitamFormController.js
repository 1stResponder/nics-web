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
define(['iweb/CoreModule', 'ol', "nics/modules/UserProfileModule"],

	function(Core, ol, UserProfile){
	
		var format = new ol.format.WKT();
	
		Ext.define('modules.report-mitam.MitamFormController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.mitamformcontroller',
			
			init: function(){
				this.mediator = Core.Mediator.getInstance();
				
				this.destinations = [];
				this.customFields = [];
				this.locCount = 0;
				this.readOnly = false;
				
				var source = new ol.source.Vector();
				this.vectorLayer = new ol.layer.Vector({
                  source: source
                });

                Core.Ext.Map.addLayer(this.vectorLayer);
                this.vectorLayer.setVisible(true); 
				
				this.interaction = this.drawPolygon(source, Core.Ext.Map.getStyle);
		    	   
		    	this.interaction.on("drawend", this.onDrawEnd.bind(this));
		    	
				Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
				
				//Not removing the feature using the eraser atm
				//source.on('removefeature', this.onDeleteFeature.bind(this));
			},
			
			setReadOnly: function(readOnly){
				this.readOnly = readOnly;
			},
			
			onJoinIncident: function(e, incident) {
				this.incidentName = incident.name;
				this.incidentId = incident.id;
			},
			
			onClose: function(){
				Core.Ext.Map.removeLayer(this.vectorLayer);
			},
			
			addCustomField: function(){
				var data = this.getViewModel().getData();
				this.setCustomField(data.newLabel, data.newValue);
				
				//clear text fields
				this.getViewModel().set("newLabel", "");
				this.getViewModel().set("newValue", "");
			},
			
			setCustomField: function(label, value){
				var bindField = label.toLowerCase();
				this.customFields.push(label);
				
				//Make sure there are no duplicates
				var field = {
						xtype: 'textfield',
						fieldLabel: label,
						bind: Ext.String.format("{{0}}", bindField)
				};
				
				var textField = this.lookupReference('mitanFields').add(field);
				
				this.getViewModel().set(bindField, value);
			},
			
			addDestination: function(){
				var _this = this;
				Ext.Msg.prompt('Name', 'Please enter your destination: ', 
					function(btn, text){
					    if (btn == 'ok'){
					    	_this.lookupReference("destinations").getStore().loadData([[text]], true);
					    }
				});
			},
			
			deleteDestination: function(){
				var record = this.lookupReference("destinations").getSelectionModel().getSelection()[0];
				if(record && record.data.feature){
					//Set as removed so that when removed the feature isn't broadcasted to all clients
					record.data.feature.removed = true;
				    this.vectorLayer.getSource().removeFeature(record.data.feature);
				}
				this.lookupReference("destinations").getStore().remove(record);
			},
			
			zoomToDestination: function(){
				var record = this.lookupReference("destinations").getSelectionModel().getSelection()[0];
				if(record && record.data.feature){
					 var extent = record.data.feature.getGeometry().getExtent();
			    	 Core.Ext.Map.zoomToExtent(extent);
				}
			},
			
			locateArea: function(button, pressed){
		    	if(pressed){
		    		this.prevInteractions = Core.Ext.Map.interactions;
		    		Core.Ext.Map.setInteractions([this.interaction]);
			    }else{
			    	Core.Ext.Map.setInteractions(this.prevInteractions);
		    	}
		    }, 
		    
		    onInteractionChange: function(){
		    	var button = this.lookupReference('locateButton');
		    	if(button.pressed){
		    		button.toggle();
		    	}
		    	this.prevInteractions = Core.Ext.Map.interactions;
		    },
		    
		    onDrawEnd: function(drawEvent){
		    	//Set Id on feature so that it will not be persisted
		    	drawEvent.feature.setId('mitan-' + Core.Util.generateUUID());
		    	this.lookupReference('locateButton').toggle();
		    	this.lookupReference("destinations").getStore()
		    		.loadData([[this.getFeatureLabel(), drawEvent.feature]], true);
		    },
		    
		    drawPolygon: function(source, style){
	    		var draw = new ol.interaction.Draw({
	    		    source: source,
	    		    style: function(feature, resolution){
	    		    	//draw interaction draws a Polygon and LineString placeholder.
	    		    	//purposely don't render LineString during draw
	    		    	if(feature.getGeometry().getType() === "LineString"){
	    		    		return null;
	    		    	}
	    		    	return style(feature, resolution);
	    		    },
	    		    type: /** @type {ol.geom.GeometryType} */ ('Polygon')
	    		});

	    		return draw;
	    	},
	    	
	    	onSelectionChange: function(grid, selected, eOpts) {
	    		if(selected && selected[0]){
	    			if(selected[0].data.feature){
	    				this.lookupReference('zoomButton').enable();
	    			}else{
	    				this.lookupReference('zoomButton').disable();
	    			}
	    		}
	    	},
	    	
	    	loadMessageData: function(message){
				
				//Load Report
				this.view.viewModel.set(message.report);
				
				//Include a store object?
				if(message.tasks){ 
					this.view.viewModel.getStore('task').loadData(message.tasks);
				}
				
				//Load Destinations - Convert WKT to feature and plot on the map
				var destinations = [];
				for(var j=0; j<message.destinations.length; j++){
					var location = message.destinations[j];
					if(location.indexOf('(') > -1){
						try{
							location = new ol.Feature({
							  geometry: format.readGeometry(location)
							});
							location.setId('mitan-' + Core.Util.generateUUID());
							//Plot on the map
							this.vectorLayer.getSource().addFeature(location);
						}catch(e){
							location = message.destinations[j];
						}
					}
					if(location.getId){
						destinations.push([this.getFeatureLabel(), location]);
					}else{
						destinations.push([location]);
					}
				}
				if(destinations.length > 0){
					this.view.viewModel.getStore('destination').loadData(destinations);
				}
				
				//Load Custom Fields - Add custom field to the UI and data model
				for(var prop in message.customFields){
					this.setCustomField(prop, message.customFields[prop]);
				}
			},
	    	
	    	submitForm: function(){
	    		
	    		/*
	    		 * form:{
	    		 * 	formId: <id>,
	    		 *  incidentid: <incidentid>,
	    		 *  incidentname: <incidentname>,
	    		 *  formtypeid: 12,
	    		 *  usersessionid: <usersessionid>,
	    		 *  distributed: false,
	    		 *  message: {
	    		 *  	report: {}, //textfields,checkboxes,dropdowns
	    		 *  	customFields: {}, //textfieds that need to be added to the UI
	    		 *      destinations: [], //text location or actual features
	    		 *      tasks: [], //added to the task store
	    		 *  	datecreated: <datecreated>,
	    		 *  	dateupdated: <dateupdated>
	    		 *  }
	    		 * }
	    		 */
	    		
	    		var form = {};
	    		var message = {};

	    		//Required Data
	    		message.report = this.view.viewModel.get('report');
	    		
	    		//Optional Data
    			message.report = Ext.Object.merge(message.report, this.view.viewModel.get('optionalData'));
	    		
    			//Merge updated form data
	    		if(this.getViewModel().get('updateData')){
	    			message.report = Ext.Object.merge(message.report, this.view.viewModel.get('updateData'));
	    			
	    			//Set Id on updated form
	    			form.formId = this.view.formId;
	    			
	    			//Load Tasks
	    			var tasks = [];
		    		var store = this.view.viewModel.getStore('task');
		    		for(var i=0; i<store.count(); i++){
		    			var task = store.getAt(i);
		    			tasks.push([task.data.task, task.data.status]);
		    		}
		    		message.tasks = tasks;
		    		
		    		//Update dates
		    		message.datecreated = this.view.datecreated;
		    		message.dateupdated = Core.Util.getUTCTimestamp();
	    		}else{
	    			var time = Core.Util.getUTCTimestamp();
	    			message.datecreated = time;
	    			message.dateupdated = time;
	    		}
	    			
	    		message.customFields = {};
	    		//Populate message with custom fields
	    		for(var j=0; j<this.customFields.length; j++){
	    			var field = this.customFields[j];
	    			message.customFields[field] = this.view.viewModel.get(field.toLowerCase());
	    		}
	    		
	    		//Populate message with destinations
	    		message.destinations = [];
	    		var store = this.lookupReference("destinations").getStore();
	    		for(var i=0; i<store.count(); i++){
	    			if(store.getAt(i).data.feature){
	    				message.destinations.push(format.writeFeature(store.getAt(i).data.feature));
	    			}else{
	    				message.destinations.push(store.getAt(i).data.title);
	    			}
	    		}
	    		
	    		//Populate form properties
	    		form.incidentid = this.view.incidentId;
	    		form.incidentname = this.view.incidentName;
	    		form.formtypeid = this.view.formTypeId;
	    		form.usersessionid = UserProfile.getUserSessionId();
	    		form.distributed = false;
	    		form.message = JSON.stringify(message);
	    		
	    		var url = Ext.String.format('{0}/reports/{1}/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						this.getView().incidentId, 'MITAM');
				
				var topic = Ext.String.format("iweb.NICS.incident.{0}.report.{1}.#", this.getView().incidentId, 'MITAM');
				
				this.mediator.sendPostMessage(url, topic, form);
				
				this.view.findParentByType('window').close();
	    	},
	    	
	    	cancelForm: function(){
	    		this.view.findParentByType('window').close();
	    	},
	    	
	    	addTask: function(){
				var _this = this;
				Ext.Msg.prompt('Name', 'Please add a task: ', 
					function(btn, text){
					    if (btn == 'ok'){
					        _this.addNewRow(text);
					    }
				});
			},
			
			addNewRow: function(text){
				this.view.lookupReference('taskgrid').getStore().loadData([[text, 'Open']], true);
			},
			
			onBeforeTaskEdit: function(){
				return !this.readOnly;
			},
			
			getFeatureLabel: function(){
				this.locCount++;
				return Ext.String.format("Location {0}", this.locCount);
			}
			
		});
});