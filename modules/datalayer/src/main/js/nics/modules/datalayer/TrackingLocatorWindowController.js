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
define(['ext', "iweb/CoreModule", "iweb/modules/MapModule",],
    function(Ext, Core, MapModule){
        Ext.define('modules.datalayer.TrackingLocatorWindowController', {
            extend : 'Ext.app.ViewController',

            alias: 'controller.datalayer.trackinglocatorwindowcontroller',

            lastSelected: null,

            /**
             * {layername, [features]}
             */
            activeTrackingLayers: {},


            init: function(){
                this.callParent();
                this.mediator = Core.Mediator.getInstance();

                // listen for layer enabled and disabled events
                Core.EventManager.addListener("nics.datalayer.tracking.click", this.onLayerShow.bind(this));
                Core.EventManager.addListener("nics.datalayer.tracking.unclick", this.onLayerHide.bind(this));
            },

            /**
             * Add features to PLI store.
             * @param features
             */
            processFeatures: function(features)
            {
                var f;
                var arr = [];
                for (f in features)
                {
                    if (features[f])
                    {
                        var props = features[f].getProperties();
                        arr.push([props.name, 'Group', 'Subgroup', props.geom]);
                    }
                }

                this.getView().pliStore.loadData(arr, true);
            },

            /**
             * Removes features from PLI store
             * @param features
             */
            processFeatureRemoval: function(features)
            {
                var f;
                var arr = [];
                for (f in features)
                {
                    var props = features[f].getProperties();
                    var index = this.getView().pliStore.find('vehicle', props.name);
                    if (index != -1)
                    {
                    	var rec = this.getView().pliStore.getAt(index);
                        arr.push(rec);
                    }
                }

                this.getView().pliStore.remove(arr);
            },
            
            onLayerShow: function(evt, data)
            {
                if (data && data.text && data.layer && data.layerType)
                {
                    if (data.layerType == 'wfs')
                    {
                    	this.getView().settingsStore.loadData([{name: data.text, layer: data.layer}], true);
                        
                    	//Can not automatically select the layer because the features are not loaded
                    	/*var rec = this.getView().settingsStore.find('name', data.text);
                        var gridPanel = this.getView().getSettingsGridPanel();
                        if (gridPanel)
                        {
                            var selModel = gridPanel.getSelectionModel();
                            if (selModel && rec)
                            {
                                //selModel.select(rec);
                            }
                        }*/
                    } else
                    {
                        console.log("Layer type not WFS");
                    }
                } else
                {
                    console.error("Invalid data object, missing attributes")
                }
            },

            onLayerHide: function(evt, data)
            {
            	// remove features from stores
                var index = this.getView().settingsStore.find('name', data.text)
                if (index != -1)
                {
                	// remove records
                	var rec = this.getView().settingsStore.getAt(index);
                    this.processFeatureRemoval(rec.data.layer.getSource().getFeatures());
                	this.getView().settingsStore.remove(rec);
                }
            },

            onSettingsSelect: function(grid, selected, eOpts)
            {
                // show features
                if (selected.data.layer)
                {
                   this.processFeatures(selected.data.layer.getSource().getFeatures());
                }
            },

            onSettingsDeselect: function(grid, selected, eOpts)
            {
                //remove features
                if (selected.data.layer)
                {
                   this.processFeatureRemoval(selected.data.layer.getSource().getFeatures());
                }

            },

            onPliSelectionChange: function(grid, selected, eOpts)
            {
                //Center map on feature
            	if(selected[0]){
                    this.lastSelected = selected[0];
            		var extent = selected[0].data.geom.getExtent();
            		if(extent.length > 0 && isFinite(extent[0])) {
						MapModule.mapController.zoomToExtent(extent);
					}
            	}
            },

            onClearListClick: function()
            {
                if (this.getView().pliStore)
                {
                    this.getView().pliStore.clearFilter(false)
                };
            },

            filterByPliFilter: function(property, value, rec, id)
            {
                if (rec && rec.data)
                {
                    if (rec.data[property])
                    {
                        if (rec.data[property] == value)
                        {
                            return true;
                        }
                    } else if (rec.data.vehicle == value)
                    {
                        console.log("matched with vehicle anyway, attempted prop: "+ property);
                        return true;
                    }
                }

                return false;
            },

            onFilterClick: function()
            {
                var _this = this;
                var filterFn = function(rec, id){
                    console.log("Filtering rec: " + rec);
                    if (this.lastSelected && this.lastSelected.data)
                    {
                        if (rec && rec.vehicle)
                        {
                            if (rec.vehicle == this.lastSelected.data.vehicle)
                            {
                                console.log("Matched vehicle");
                                return true;
                            }
                        }
                    }
                    return false;
                };

                this.getView().pliStore.filterBy(filterFn);
            }
        });
    });


