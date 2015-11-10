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
define(['iweb/CoreModule', 'ol'], function(Core, ol){
	
	return Ext.define('modules.datalayer.builder', {

		constructor: function() {
			this.mediator = Core.Mediator.getInstance();
		},
		
		buildLayer: function(type, config){
			if(type == "wms"){
				return this.buildWMSLayer(config.url, config.layername);
			}else if(type == "wfs"){
				return this.buildWFSLayer(config.url, config.layername);
			}else if(type == "kml"){
				return this.buildKMLLayer(config.url, config.layername);
			}else if(type == "kmz"){
				return this.buildKMLLayer(config.url, config.layername);
			} else if(type == "bing"){
				return this.buildBingLayer(config.url, config.layername, config.attributes);
			} else if(type == "osm"){
				return this.buildOSMLayer(config.url, config.layername);
			} else if(type == "xyz"){
				return this.buildXYZLayer(config.url, config.layername, config.attributes);
			} else if(type == "arcgisrest"){
				return this.buildArcGisLayer(config.url, config.layername);
			}
		},
		
		buildWMSLayer: function (url, layername) {
			return new ol.layer.Tile({
			    source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
			      url: url,
			      params: {'LAYERS': layername , 'TILED': true},
			      serverType: 'geoserver'
			    }))
			  });
		},
		
		buildWFSLayer: function (url, layername) {
			var _mediator = this.mediator;
			var _eventManager = Core.EventManager;
			
			// format used to parse WFS GetFeature responses
			var wfsFormat = new ol.format.WFS();
			
			var vectorSource = new ol.source.Vector({
			  loader: function(extent, resolution, projection) {
				  var requestUrl = 
					  //Proxy WFS
					  window.location.protocol + '//' +
					  window.location.host + 
					  '/nics/proxy?url=' + 
					  
					   url + 
				      '?version=1.1.0&request=GetFeature&typename=' + layername + 
				      '&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
				  
				  var loadFeatures = function(data, status){
				  //var loadFeatures = function(evt, status){
					  this.addFeatures(wfsFormat.readFeatures(data))
				  };
				  
				  var handler = loadFeatures.bind(this);
				  
				  $.ajax({
				      url: requestUrl,
				      dataType: 'xml',
				      success: handler,
				      error: function(param1, status, error){}
				   });
				  
				 /*var topic = Core.Util.generateUUID();
				  
				 Core.EventManager.createCallbackHandler(topic, this, loadFeatures);
					
				 _mediator.sendRequestMessage(requestUrl, topic, true, "application/xml");*/
			    
			  },
			  strategy: ol.loadingstrategy.tile(new ol.tilegrid.XYZ({
			    maxZoom: 19
			  })),
			  projection: 'EPSG:3857'
			});
			
			/******Default Style****************/
			var stroke = new ol.style.Stroke({
	    	   color: '#3399CC',
	    	   width: 1.25
	    	 });
			
			var fill = new ol.style.Fill({
	        	   color: 'rgba(215, 40, 40, 0.9)'
	         });
			/***********************************/
			
			
			return new ol.layer.Vector({
		      source: vectorSource,
		      style:  new ol.style.Style({
	    	     image: new ol.style.Circle({
	    	         fill: fill,
	    	         stroke: stroke,
	    	         radius: 5
	    	       }),
    	           fill: fill,
	    	       stroke: stroke
	    	     })
		    });	
			
		},
		
		buildKMLLayer: function(url, layername){
			if(layername){
				url = url + layername;
			}
			
			var format = new ol.format.KML({
				extractStyles: true
			});
			
			var vectorSource = new ol.source.Vector({
			  url: "proxy?url=" + url,
			  format: format,
			  projection: 'EPSG:3857'
	        });
			
			return new ol.layer.Vector({
			  source: vectorSource
			});
		},
		
		buildBingLayer: function(url, layername, attributes) {
			var attrs = JSON.parse(attributes) || {};
			return new ol.layer.Tile({
				source: new ol.source.BingMaps({
					//TODO: make this configurable
					key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
					imagerySet: attrs.type,
					maxZoom: 19
				})
			});
		},
		
		buildOSMLayer: function(url, layername) {
			return new ol.layer.Tile({
				source: new ol.source.OSM()
			});
		},
		
		buildXYZLayer: function(url, layername, attributes) {
			var attrs = JSON.parse(attributes) || {};
			return new ol.layer.Tile({
				source: new ol.source.XYZ({
					url: url,
					maxZoom: attrs.maxZoom
				})
			});
		},
		
		buildArcGisLayer: function(url, layername) {
			return new ol.layer.Tile({
				source: new ol.source.TileArcGISRest({
					url: url
				})
			});
		}
	});
});
