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

define(['iweb/CoreModule', 'ol', './TokenManager'], function(Core, ol, TokenManager){
	
	return Ext.define('modules.datalayer.builder', {
		
		constructor: function() {
			this.mediator = Core.Mediator.getInstance();
		},
		
		buildLayer: function(type, config){
			if(type == "wms"){
				return this.buildWMSLayer(config.url, config.layername, config);
			}else if(type == "wfs"){
				return this.buildWFSLayer(config.url, config.layername, config);
			}else if(type == "kml"){
				return this.buildKMLLayer(config.url, config.layername, config);
			}else if(type == "kmz"){
				return this.buildKMLLayer(config.url, config.layername, config);
			}else if(type == "bing"){
				return this.buildBingLayer(config.url, config.layername, config);
			}else if(type == "osm"){
				return this.buildOSMLayer(config.url, config.layername, config);
			}else if(type == "xyz"){
				return this.buildXYZLayer(config.url, config.layername, config);
			}else if(type == "arcgisrest"){
				return this.buildArcGisLayer(config.url, config.layername, config);
			}else if(type == "geojson"){
				return this.buildGeoJsonLayer(config.url, config.layername, config);
			}else if(type == "gpx"){
				return this.buildGpxLayer(config.url, config.layername, config);
			}
		},
		
		buildWMSLayer: function (url, layername, config) {
			var attrs = (config.attributes) ? JSON.parse(config.attributes) : {};
			return new ol.layer.Tile({
				opacity: config.opacity || 1,
				source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
					url: url,
					params: {
							'LAYERS': layername ,
							'TILED': true,
							'VERSION': attrs.version || '1.3.0'
					}
				}))
			});
		},
		
		buildWFSLayer: function (url, layername, config, style) {
			var _mediator = this.mediator;
			var _eventManager = Core.EventManager;
			
			// format used to parse WFS GetFeature responses
			var wfsFormat = new ol.format.WFS();
			
			var vectorSource = new ol.source.Vector({
			  loader: function(extent, resolution, projection) {
				  var requestUrl = Ext.String.format(
						  "{0}//{1}/nics/proxy?url={2}?version=1.1.0&request=GetFeature&typename={3}" +
						  "&srsname=EPSG:3857&bbox={4}{5}",
					  window.location.protocol,
					  window.location.host, 
					  url, layername, extent.join(','), ',EPSG:3857');
				  
					if(config.secure){
						var token = TokenManager.getToken(config.datasourceid);
						
						if(token){
							requestUrl = requestUrl + "&token=" + token;
						}else{
							return; //Don't attempt to get features w/o a token
						}
					}
				  
					var loadFeatures = function(data, status){
						//remove all previous features in this extent, to avoid flash on refresh
						this.getFeaturesInExtent(extent).forEach(function(feature){
							if(feature.getGeometry().intersectsExtent(extent)) {
								this.removeFeature(feature);
							}
						}, this);
						
						//add the new features
						this.addFeatures(wfsFormat.readFeatures(data));
					};
					
					var handler = loadFeatures.bind(this);
				  
					$.ajax({
				      url: requestUrl,
				      dataType: 'xml',
				      success: handler,
				      error: function(param1, status, error){}
				   });
				},
			  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
			    maxZoom: 19
			  })),
			  projection: 'EPSG:3857'
			});
			
			// tells the mapController we can handle a defered reload
			// meaning we will handle removing features when new ones come in
			vectorSource.set("deferReload", true);
			
			//create default style
			var stroke = new ol.style.Stroke({
	    	   color: '#3399CC',
	    	   width: 1.25
	    	 });
			
			var fill = new ol.style.Fill({
				color: 'rgba(215, 40, 40, 0.9)'
	        });
			
			var style = new ol.style.Style({
    	     image: new ol.style.Circle({
    	         fill: fill,
    	         stroke: stroke,
    	         radius: 5
    	       }),
	           fill: fill,
    	       stroke: stroke
    	     });
			
			return new ol.layer.Vector({
				opacity: config.opacity || 1,
				source: vectorSource,
				style: style 
		    });	
		},
		
		buildKMLLayer: function(url, layername, config){
			if(layername){
				url = url + layername;
			}
			
			var format = new ol.format.KML({
				extractStyles: true,
				showPointNames: false
			});
			
			var vectorSource = new ol.source.Vector({
			  url: "proxy?url=" + url,
			  format: format,
			  projection: 'EPSG:3857',
			  
			  loader: function(extent, resolution, projection) {
				    var loadFeatures = function(source, status){
							//remove all features when we get results, to avoid flash on refresh
							this.getFeatures().forEach(this.removeFeature, this);
							
				    	if (source) {
				    		
				    		var networkLinks = this.getFormat().readNetworkLinks(source);
				    		
				    		var _this = this;
				    		for(var i=0; i<networkLinks.length; i++){
				    			 $.ajax({
								      url: "proxy?url=" + networkLinks[i].href,
								      dataType: 'text',
								      success: function(source, status){
								    	  if(source){
								    		  	// Replace BalloonStyle tags
												var start = source.indexOf('<BalloonStyle>');
												
												while (start != -1){
													var end = source.indexOf('</BalloonStyle>') + 15;
													var insertIndex = source.indexOf('</Style>', end) + 8;
													
													if (insertIndex != -1)
													{
														var balloonStyle = source.substring(start, end);
													
														var description = balloonStyle.replace('<BalloonStyle><text>', '<description>')
														.replace('</text></BalloonStyle>', '</description>');
														
														source = source.slice(0, insertIndex) + description + source.slice(insertIndex);
														source = source.replace(balloonStyle, "");
													}
													var nextStart = source.indexOf("<BalloonStyle>");
													if (nextStart < start) {
														start = -1;
													} else {
														start = nextStart;
													}
												}
												  
												_this.addFeatures(_this.getFormat().readFeatures(
															 ol.xml.parse(source),
												        	 {featureProjection: 'EPSG:3857'}));
								    	  }
								      },
								      error: function(param1, status, error){},
								      scope: this
								   });
				    		}
			            	
				    		this.addFeatures(this.getFormat().readFeatures(
				    				 ol.xml.parse(source),
				                	 {featureProjection: 'EPSG:3857'}));
			            }
				    };
					
					var handler = loadFeatures.bind(this);
				  
					$.ajax({
				      url: this.getUrl(),
				      dataType: 'text',
				      success: handler,
				      error: function(param1, status, error){}
				   });
				}
	        });
			
			// tells the mapController we can handle a defered reload
			// meaning we will handle removing features when new ones come in
			vectorSource.set("deferReload", true);
			
			return new ol.layer.Vector({
			  opacity: config.opacity || 1,
			  source: vectorSource
			});
		},
		
		buildBingLayer: function(url, layername, config) {
			var attrs = (config.attributes) ? JSON.parse(config.attributes) : {};
			return new ol.layer.Tile({
				opacity: config.opacity || 1,
				source: new ol.source.BingMaps({
					key: Core.Config.getProperty("maps.bing.apikey"),
					imagerySet: attrs.type,
					maxZoom: 19
				})
			});
		},
		
		buildOSMLayer: function(url, layername, config) {
			return new ol.layer.Tile({
				opacity: config.opacity || 1,
				source: new ol.source.OSM()
			});
		},
		
		buildXYZLayer: function(url, layername, config) {
			var attrs = (config.attributes) ? JSON.parse(config.attributes) : {};
			return new ol.layer.Tile({
				opacity: config.opacity || 1,
				source: new ol.source.XYZ({
					url: url,
					maxZoom: attrs.maxZoom || 18
				})
			});
		},
		
		buildGeoJsonLayer: function(url, layername, config){
			if(layername){
				url = url + layername;
			}
			
			var vectorSource = new ol.source.Vector({
			  url: url,
			  format: new ol.format.GeoJSON()
	        });
			
			return new ol.layer.Vector({
			  opacity: config.opacity || 1,
			  source: vectorSource
			});
			
		},
		
		buildGpxLayer: function(url, layername, config){
			if(layername){
				url = url + layername;
			}
			
			var vectorSource = new ol.source.Vector({
			  url: "proxy?url=" + url,
			  format: new ol.format.GPX(),
			  projection: 'EPSG:3857'
	        });
			
			return new ol.layer.Vector({
			  opacity: config.opacity || 1,
			  source: vectorSource
			});
			
		},
		
		buildArcGisLayer: function(url, layername, config) {
			
			return new ol.layer.Tile({
				opacity: config.opacity || 1,
				source: new ol.source.TileArcGISRest({
					url: url,
					params: {'LAYERS': 'show:' + layername }
				})
			});
		}
	});
});
