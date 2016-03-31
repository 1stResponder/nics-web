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
define(['iweb/CoreModule', 
 		"nics/modules/UserProfileModule"], 

	function(Core, UserProfile){
	
		Ext.define('modules.report.ReportController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.reportcontroller',
			
			coreConfig: null,
			
			reportTypes: null,
			
			init: function(){
				this.mediator = Core.Mediator.getInstance();
			    
			    this.bindEvents();
			},
	 
			bindEvents: function(){
				this.getView().on("afterrender", this.onViewRendered, this);
				
				//Subscribe to UI Events
				Core.EventManager.addListener("nics.report.add", this.onAddReport.bind(this));
				Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
				Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
				Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.populateModel.bind(this));
				Core.EventManager.addListener("iweb.config.loaded", this.onLoadConfig.bind(this));
				Core.EventManager.addListener("configRequest", this.onConfigRequest.bind(this));
				Core.EventManager.addListener("nics.report.loadTypes", this.onLoadTypes.bind(this));
				Core.EventManager.addListener("nics.report.getTypes", this.onGetTypes.bind(this));
			},

			populateModel: function(e, userProfile) {
				
				this.mediator.sendRequestMessage(Core.Config.getProperty(UserProfile.REST_ENDPOINT) +
						"/reports/types", "nics.report.loadTypes");
			},

			onLoadTypes: function(e, types) {
				if(types.types) {
					this.reportTypes = types.types;
					Core.EventManager.fireEvent("nics.report.sendTypes", types.types);
				}
			},
			
			getReportTypes: function() {
				return this.reporTypes;
			},
			
			onGetTypes: function(event, who) {
				Core.EventManager.fireEvent("nics.report.sendTypes", this.reportTypes);
			},
			
			onViewRendered: function(component, opt) {
				Core.EventManager.fireEvent("ReportViewRendered", "rendered");
			},
			
			onLoadConfig: function(e, config) {
				// ... store config object for when individual report modules request it
				this.coreConfig = config;
			},
			
			/**
			 * Upon request from a report module, send the coreConfig map to the requestor's specified
			 * topic
			 */
			onConfigRequest: function(e, requestTopic) {
				if(requestTopic) {
					Core.EventManager.fireEvent(requestTopic, this.coreConfig);
				}
			},
			
			onAddReport: function(e, report) {
								
				if(report && report.title && report.component) {
					
					// Check to see if the component has a set title, and if not, set it to the
					// one specified
					if(!report.component.title) {
						report.component.title = report.title;
					}
					
					// TODO: find out what the proper Ext way to have a reference to this report view is
					//report.component.reportView = this.getView();
					
					this.getView().add(report.component);
					
					// TODO: add report to summary list
					this.getView().setActiveTab(0);
					
				}
					
			},

			onJoinIncident: function(e, menuItem){
				// Enables individual tabs
				var dmg = this.getView().down();
				for(var i = 0; i < dmg.items.items.length; i++){
					dmg.items.items[i].enable();
				}
				this.getView().enable();
				//Add iframe for printing
				this.addPrintFrame();
			},

			onCloseIncident: function(e, incidentId) {
				// Disables individual tabs
				var dmg = this.getView().down();
				for(var i = 0; i < dmg.items.items.length; i++){
					dmg.items.items[i].disable();
				}
				//remove print frame
				this.destroyPrintFrame();
			},
			
			//Add hidden iframe used to print reports
			addPrintFrame: function() {
				var iFrameId = "printerFrame";
				var printFrame = Ext.get(iFrameId);
				if (printFrame == null) {
					printFrame = Ext.getBody().appendChild({
						id: iFrameId,
						tag: 'iframe',
						cls: 'x-hidden',  style: {
							display: "none"
						}
					});
				}
			},
			//destroy print iframe
			destroyPrintFrame: function() {
				var iFrameId = "printerFrame";
				var printFrame = Ext.get(iFrameId);
				if (printFrame != null) {
					// destroy the iframe
					Ext.fly(iFrameId).destroy();
				 
				}
			}

	});
});
