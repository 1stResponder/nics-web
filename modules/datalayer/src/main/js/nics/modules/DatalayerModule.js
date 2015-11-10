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
define(["iweb/CoreModule",
        "./datalayer/Button", "./datalayer/Window",
        "./datalayer/DataWindow", "./datalayer/MapsController",
        "./datalayer/ExportView", "nics/modules/UserProfileModule"], 
	
	function(Core, Button, Window, DataWindow, MapsController, ExportView, UserProfile) {
	
		var DatalayerModule = function(){};
		
		DatalayerModule.prototype.load = function(){
			var mapsButton = new Button({
				text: 'Maps',
				window: new Window({
					rootName: 'Maps',
					controller: 'datalayer.mapscontroller'
				})
			});

			var importDataButton = new DataWindow({
					rootName: 'Data'
				});

			Core.EventManager.addListener(UserProfile.PROFILE_LOADED, importDataButton.hideImportButton);

			var dataButton = new Button({
				text: 'Data',
				window: importDataButton
			});
			
			var weatherButton = new Button({
				text: 'Weather',
				window: new Window({
					rootName: 'Weather'
				})
			});

			var trackingButton = new Button({
				text: 'Tracking',
				window: new Window({
					rootName: 'Tracking'
				})
			});
			
			//Add View to Core
			Core.View.addButtonPanel(
					[ "-", mapsButton, dataButton, weatherButton, trackingButton ]
			);
			
			var setGeoserverCookies = function(event){
				Core.Mediator.getInstance().setCookies(Core.Config.getProperty(UserProfile.GEOSERVER_ENDPOINT), ["openam", "iplanet"]);
				Core.EventManager.removeListener("iweb.config.loaded", setGeoserverCookies);
			};
			Core.EventManager.addListener("iweb.config.loaded", setGeoserverCookies);
		};
		
		DatalayerModule.prototype.addExport = function(){
			//Add Export Room
			var view = Ext.create('modules.datalayer.js.ExportView',{});
			//Add Item to Tools Menu
			Core.Ext.ToolsMenu.add({
					text: 'Export Room',
					handler: function(){
						if(view.getController().collabRoomId && view.getController().incidentId){
							view.show();
						}else{
							Ext.MessageBox.alert("Export Current Room", "You are not currently in a collaboration room.");
						}
					}
				}
			);
		};
		
		return new DatalayerModule();
	}
);
	
