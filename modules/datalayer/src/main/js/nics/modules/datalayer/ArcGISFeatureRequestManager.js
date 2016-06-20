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
define(["ol",'ext', 'iweb/CoreModule','iweb/modules/MapModule'], 
	function(ol, Ext, Core, MapModule){
		
		var layers = []; 
		
		var init = false;
		
		function _init(){
			init = true;
			Core.EventManager.addListener("iweb.map.view.select", onMapViewSelect.bind(this));
		}
		
		function _addLayer(layer){
			layers.push(layer);
		}
		
		function _removeLayer(layer){
			Ext.Array.remove(layers, layer);
		}
		
		function onMapViewSelect(eventName, evt, container) {
			if(layers.length > 0){
				Ext.Array.forEach(layers, function(layer){
					if(layer.getVisible()){
						var urls = layer.getSource().getUrls();
						if(urls && urls.length){
							var url = urls[0] + '/identify?',
							map = MapModule.getMap(),
							lonlat = evt.mapBrowserEvent.coordinate,
							mapSize = map.getSize(),
							extent = map.getView().calculateExtent(mapSize);
						
							var LAYERS = layer.getSource().getParams().LAYERS;
							var show = LAYERS.indexOf("show:");
							if(show != -1){
								LAYERS = LAYERS.substring(show + 5, LAYERS.length);
							}

						 Ext.Ajax.request({
								url: 'proxy?url=' + url,
								params: {
									geometry: [lonlat[0], lonlat[1]].join(','),
									geometryType: 'esriGeometryPoint',
									layers: LAYERS,
									tolerance: 5,
									mapExtent: extent.join(','),
									imageDisplay: [mapSize[0], mapSize[1], 96].join(','),
									returnGeometry: true,
									returnZ: false,
									returnM: false,
									f: 'json',
									sr: 3857
								},
								method: 'GET',
								success: onRequestSuccess.bind(this, evt, container)
							});
						}
					}
				});
			}
		}
		
		function onRequestSuccess(evt, container, response) {
			if (response && response.responseText) {
				var jsonResp = Ext.decode(response.responseText);
				if (jsonResp && jsonResp.results && jsonResp.results.length) {
					var result = jsonResp.results[0];
					container.removeAll();
					render(container, result.attributes);
					container.show();
					container.setLocalXY(evt.mapBrowserEvent.pixel);
				}
			}
		}
		
		function render(container, attributes) {
			for(var property in attributes){
				var value = attributes[property] || "";
				var type = typeof value;
				if(type != "object"){
					//Replace null string with empty value
					if(value == "null"){
							value = "";
					}
						
					container.add(new Ext.form.field.Display({
						fieldLabel: property,
						value: value
					}));
				}
			}
		}
		
		return {
			
			addLayer: function(layer){
				return _addLayer(layer);
			},
			
			removeLayer: function(layer){
				_removeLayer(layer);
			},
			
			init: function(){
				if(!init){
					_init();
				}
			}
		};
});
