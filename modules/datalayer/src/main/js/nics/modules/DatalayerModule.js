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
define(["iweb/CoreModule",
        "./datalayer/Button", "./datalayer/Window",
        "./datalayer/DataWindow", "./datalayer/MapsController",
        "./datalayer/ExportView", "./datalayer/DatalayerPanelView", 
        "nics/modules/UserProfileModule", "./datalayer/TrackingWindow",
		"./datalayer/TrackingLocatorWindow"],
	
	function(Core, Button, Window, DataWindow, MapsController, ExportView,
			 DatalayerPanelView, UserProfile, TrackingWindow, TrackingLocatorWindow,
			 StyleRendererController) {
	
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

			var tw = new TrackingWindow({
				rootName: 'Tracking'
			});


			var trackingButton = new Button({
				text: 'Tracking',
				window: tw
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

			Core.EventManager.addListener("nics.data.legend.show", this.showLegend);
			Core.EventManager.addListener("nics.data.legend.update", this.updateLegend);
			Core.EventManager.addListener("nics.data.legend.ajax", this.getHtml);
	
			var datalayerPanelViewer = Ext.create('modules.datalayer.DatalayerPanelView');
			
			Core.View.addToSidePanel(datalayerPanelViewer);

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
		
		DatalayerModule.prototype.showLegend = function(event, datalayer){
						
			var id = datalayer.data.datalayerid.replace(/-/g,'');
			
			if(!Ext.getCmp("legend" + id)){
		
				var fileExt = datalayer.data.legend.substr(datalayer.data.legend.length - 5);
		
				this.legendId = "legend" + id;
		
				if(fileExt.indexOf('.') != -1){
		
					var legendCmp = Ext.create('Ext.Window',{
						title: datalayer.data.text + ' - Legend',
						items:[{
							xtype: 'image',
							src: datalayer.data.legend, 
							id: "legend" + id,
							listeners : {
					            load : {
					               element : 'el',
					               fn : function(el){
				               			Core.EventManager.fireEvent('nics.data.legend.update' ,[this.id, el.target.clientWidth, el.target.clientHeight]);
				               		}
					            }
				        	}
				        }]
					});
					
					legendCmp.show();
				}
				else{
				
					var requestUrl = window.location.protocol + '//' + window.location.host + '/nics/proxy?url=' + datalayer.data.legend;
					
					$.ajax({
						url: requestUrl,
						headers: {'Content-Type':'text/html'},
						legendId: "legend" + id,
						legendName: datalayer.data.text,
						success: function(data, status, response){
							Core.EventManager.fireEvent('nics.data.legend.ajax',[this.legendId,this.legendName,data]);
						},
						error: function(param1, status, error) {
							console.log('Failed to get legend for window');
						}
					});
				
				}
				
			}
			
		};
		
		DatalayerModule.prototype.updateLegend = function(event, info){
			
			var image = Ext.getCmp(info[0]);
			if(image){
				image.setSize(info[1],info[2]);
			}
			
		};
		
		DatalayerModule.prototype.getHtml = function(event, info){
		
			if(info){
	
				var regex = /<img.*?src=['"](.*?)['"]/;
				
				var htmlSrc = regex.exec(info[2]);
				var legendCmp;
	
				if(htmlSrc && htmlSrc[1]){

					legendCmp = Ext.create('Ext.Window',{
						title: info[1] + ' - Legend',
						items:[{
							xtype: 'image',
							src: htmlSrc[1], 
							id: info[0],
							listeners : {
					            load : {
					               element : 'el',
					               fn : function(el){
				               			Core.EventManager.fireEvent('nics.data.legend.update' ,[this.id, el.target.clientWidth, el.target.clientHeight]);
				               		}
					            }
				        	}
				        }]
					});
					
				}
				else{
					
					legendCmp = Ext.create('Ext.Window',{
						title: info[1] + ' - Legend',
						id: info[0],
						html: info[2],
						listeners : {
				            load : {
				               element : 'el',
				               fn : function(el){
			               			Core.EventManager.fireEvent('nics.data.legend.update' ,[this.id, el.target.clientWidth, el.target.clientHeight]);
			               		}
				            }
			        	}
						
					});
					
				}
	
				legendCmp.show();
	
			}
			else{
				Ext.MessageBox.alert("Legend", "Unable to load legend");
			}
	
		};
		
		return new DatalayerModule();
	}
);
	
