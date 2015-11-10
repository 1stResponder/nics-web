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
 define(['iweb/CoreModule', './IncidentController'], function(Core) {
	Ext.define('modules.incident.IncidentViewer', {

		extend: 'Ext.Button',
		
		controller: 'incidentcontroller',

		requires: [ 'Ext.Panel', 'Ext.Button', 'Ext.form.TextField', 'Ext.Container' ],

		initComponent: function(){
			this.createIncidentButton = this.addMenuItem(
				"Create New Incident", true);
				
			this.menu.add({
				xtype : 'menuseparator'
			});
			
			this.countryDropdown = Core.UIBuilder.buildComboBox(
					"country", "Country", 135, ['country'], {forceSelection: true, typeAhead: true});
			this.countryDropdown.on("change", this.onCountryChange, this);
			
			this.stateDropdown = Core.UIBuilder.buildComboBox(
				"state", "State", 135, ['country', 'state'], {valueField: 'state', forceSelection: true, typeAhead: true, emptyText: 'None'});
				
			this.nameInput = Ext.create('Ext.form.field.Text', { name: 'incidentName', fieldLabel: 'Name', width: 100, maxLength: 40, enforceMaxLength: true });
			this.prefixValue = Ext.create('Ext.form.field.Display',{ name: 'prefix', fieldLabel: 'Prefix'});
			
			this.parentDropdown = Core.UIBuilder.buildComboBox(
				"incidentname", "Parent Incident (Optional)", 100, 
				[{name: 'incidentname'},{name:'incidentid'}], {valueField: 'incidentid', forceSelection: true, typeAhead: true});
			this.parentDropdown.on("change", this.onParentChange, this);
			
			this.description = Ext.create('Ext.form.field.TextArea',
					{ name: 'incidentDescription', fieldLabel: 'Description', width: 100 , stripCharsRe: /[^a-zA-Z0-9,_\-\.\s]/,  maxLength: 500, enforceMaxLength: true});
	
			this.createButton = Ext.create('Ext.Button', { text: 'Create' });
			this.cancelButton = Ext.create('Ext.Button', { text: 'Cancel', handler: function(){ this.createWindow.hide(); }, scope: this});
			
			this.incidentTypeSet = Ext.create('Ext.form.FieldSet',{
				autoScroll: true,
	        	title: 'Incident Types',
	        	height: 200
			});
	
			this.incidentLabel =  Ext.create('Ext.form.Label',{
				id:'incident-label',
				html: '<div id="nicsIncidentLabel"><b>No Incident Selected</b></div>',
				incidentId: 0,
				incidentName: ''
			});
			
			this.incidentCloser = Ext.create('Ext.form.Label',{
				html:"<span style='cursor: pointer;color:blue;margin-left:5px'><u>[x]</u></span>",
				hidden: true,
				listeners: {
					render: function(label){
						var callback = function(){ Core.EventManager.fireEvent('nics.incident.close') };
						var element = label.getEl().dom.firstChild;
						if (element.addEventListener) {  // all browsers except IE before version 9
						  element.addEventListener("click", callback, false);
						}
					}
				}
			});
			
			this.createWindow = Ext.create('Ext.window.Window',{
				title: 'Create Incident',
				cls: 'incidents-window',
				bodyBorder : false,
				layout : 'form',
				minimizable : false,
				closable : true,
				maximizable : false,
				resizable : false,
				draggable : false,
				padding : 10,
				width: 400,
				closeAction: 'hide',
				buttonAlign: 'center',
				fieldDefaults: {
			        labelAlign: 'right',
			        labelWidth: 100
			    },
			    items: [
			    	{
						xtype: 'fieldset',
						title: '',
				        defaultType: 'textfield',
				        defaults: {
				            anchor: '-10',
				            stripCharsRe: /[^a-zA-Z0-9_\-\s]/
				        },
				        items:[
				        	this.countryDropdown,
				        	this.stateDropdown,
				        	this.prefixValue,
				        	this.parentDropdown,
				        	this.nameInput,
				        	this.description
				        ]
		    		},
			    	this.incidentTypeSet
			    ],
			    buttons: [
			    	this.createButton,
			    	this.cancelButton
			    ]
			});
			
		
			this.callParent();
		},
	
		config: {
			text : 'Incidents',
			cls: 'incidents-btn',
			
			menu : {
				xtype : 'menu',
				cls: 'incidents-menu',
				forceLayout : true,
				autoWidth: true
			},
			baseCls: 'nontb_style'
		},
		
		getIncidentLabel: function(){
			return this.incidentLabel;
		},
		
		getIncidentCloser: function(){
			return this.incidentCloser;
		},

		setIncidentLabel: function(incidentName, incidentId){
			if(incidentId && incidentName){
				this.incidentLabel.incidentId = incidentId;
				this.incidentLabel.incidentName = incidentName;
				this.incidentLabel.update("<div><b>Incident: " + Ext.String.htmlEncode(incidentName) + "</b></div>");
				this.incidentCloser.setVisible(true);
			}
		},

		resetIncidentLabel: function(){
			this.incidentLabel.incidentId = 0;
			this.incidentLabel.incidentName = '';
			this.incidentLabel.update("<b>No Incident Selected</b>");
			this.incidentCloser.setVisible(false);
		},

		resetCreateWindow: function(){
			this.setDescription("");
			this.setName("");
			this.resetIncidentTypes();
			this.resetParentIncident();
		},

		closeCreateWindow: function(){
			this.createWindow.hide();
		},

		setData: function(model, userProfile){
			//Add new data
			this.clearMenuItems();
			
			this.setCountries(model.getCountries());
			if (userProfile.getOrgCountry()) {
				this.setCountry(userProfile.getOrgCountry());
			}
			
			this.setStates(model.getStates());
			if (userProfile.getOrgState()) {
				this.setState(userProfile.getOrgState());
			}
			
			this.setPrefixValue(userProfile.getOrgPrefix());
			this.setIncidentTypes(model.getIncidentTypes());//Getting and setting ids atm
			
			/** Add Incidents **/
			var incidents = model.getIncidents();
			var parentIncidents = [];
			var menuItems = [];
			for(var i=0; i<incidents.length; i++){
				var p = [];
				p.push(incidents[i].incidentName);
				p.push(incidents[i].incidentId);
		
				parentIncidents.push(p);
				
				this.addMenuItem(incidents[i].incidentName,incidents[i].incidentId,
					null, null, null, -1, false, model.getIncidentCallBack());
			}
			this.setParentIncidents(parentIncidents);
		},

		addMenuItem: function(
			text, incidentid, lat, lon, incidentTypes, index, child, onclick){
			
			var config = {
				text: Ext.String.htmlEncode(text),
				folder : false,
				lat: 0,
				lon: 0,
				incidentTypes: [],
				incidentId: incidentid
			};
		
			if(child){
				config.html = "<div style='padding-left: 10px'>	&rarr;  " + text + "</div>";
			}
		
			var newItem = Ext.create('Ext.menu.Item',config);
			
			if(onclick){
				newItem.on("click", onclick);
			}
		
			if(index != null && index > -1){
				return this.menu.insert(index, newItem);
			}
			
			return this.menu.add(newItem);
		},

		onCountryChange: function( combo, newValue, oldValue, eOpts) {
			var stateStore = this.stateDropdown.getStore();
			stateStore.filter("country", newValue);
		},
		
		setCountries: function(countries){
			var store = this.countryDropdown.getStore();
			store.loadData(countries);
			this.countryDropdown.select(store.getAt(0));
		},

		setCountry: function(country){
			this.countryDropdown.setValue(country);
		},
		
		getCountry: function(){
			return this.countryDropdown.getValue();
		},
		
		setStates: function(states){
			var store = this.stateDropdown.getStore();
			store.loadData(states);
			this.stateDropdown.select(store.getAt(0));
		},

		setState: function(state){
			this.stateDropdown.setValue(state);
		},
		
		getState: function(){
			return this.stateDropdown.getValue();
		},

		setPrefixValue: function(prefix){
			this.prefixValue.setValue(prefix);
		},

		getPrefixValue: function(){
			return this.prefixValue.getValue();
		},

		setIncidentTypes: function(incidentTypes){
			var displayIncidentTypes = [];
			if(incidentTypes.length > 0){
				for(var i=0; i<incidentTypes.length; i++){
					displayIncidentTypes.push(
					    Ext.create('Ext.form.Checkbox',{
						boxLabel: incidentTypes[i].incidentTypeName,
						name: incidentTypes[i].incidentTypeId,
						hideLabel: true
					     })
					);
				}
		
				this.incidentTypeSet.add(displayIncidentTypes);
			}
		},

		getIncidentTypeIds: function(){
			var incidentTypeIds = [];
			for(var i=0; i<this.incidentTypeSet.items.length; i++){
				if(this.incidentTypeSet.items.get(i).checked){
					incidentTypeIds.push(
						this.incidentTypeSet.items.get(i).name);
				}
			}
			return incidentTypeIds;
		},

		resetIncidentTypes: function(){
			var incidentTypeIds = [];
			for(var i=0; i<this.incidentTypeSet.items.length; i++){
				this.incidentTypeSet.items.get(i).setValue(false);
			}
			return incidentTypeIds;
		},

		clearMenuItems: function(){
			//Start at 2 to avoid removing the Create Room Button and menu separator
			while(this.menu.items.length > 2){
				this.menu.remove(this.menu.items.get(this.menu.items.length-1));
			}
		},

		/**
		 * This is a workaround to allow the ParentDropdown to be empty,
		 * even when using forceSelection: true 
		 */
		onParentChange: function( combo, newValue, oldValue, eOpts) {
			if (newValue === null) {
				combo.reset();
			}
		},
		
		setParentIncidents: function(incidents){
			var store = this.parentDropdown.getStore();
			store.clearData();
			store.loadData(jQuery.merge([["None Selected", null]], incidents));
			this.parentDropdown.setValue(store.getAt(0).data.incidentname);
		},

		getParentIncident: function(){
			return this.parentDropdown.getValue();
		},

		resetParentIncident: function(){
			var store = this.parentDropdown.getStore();
			this.parentDropdown.setValue(store.getAt(0).data.incidentname);
		},

		getDescription: function(){
			return this.description.getValue();
		},

		getName: function(){
			return this.nameInput.getValue();
		},

		setDescription: function(description){
			this.description.setValue(description);
		},

		setName: function(name){
			this.nameInput.setValue(name); //setText?
		},

		getIncidentName: function(){
			return this.buildName([
				this.getCountry(),
				this.getState(),
				this.getPrefixValue(),
				this.getName()
			]);
		},
		
		buildName: function(parts) {
			var name = [];
			for (var i = 0; i < parts.length; i++) {
				if (parts[i]) {
					name.push( parts[i] );
				}
			}
			return name.join(" ");
		}
	});
});
