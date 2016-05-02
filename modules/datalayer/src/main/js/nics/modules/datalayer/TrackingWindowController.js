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
define(['ext', 'iweb/CoreModule', './WindowController', './TrackingLocatorWindow', './AVLTrackingRenderer'],

    function(Ext, Core, WindowController, TrackingLocatorWindow, AVLTrackingRenderer){

        return Ext.define('modules.datalayer.TrackingWindowController', {
            extend : 'modules.datalayer.WindowController',

            alias: 'controller.datalayer.trackingwindowcontroller',

            init: function()
            {
                this.callParent();
                this.locatorWindow = new TrackingLocatorWindow();
                this.avlRenderer = new AVLTrackingRenderer();
            },

            onLocatePliClick: function() {
                if (!this.locatorWindow) {
                    this.locatorWindow = new TrackingLocatorWindow();
                }
                this.locatorWindow.show();
            },

            onPliLabelsClick: function() {
                // TODO add labels next to features
            },
            
            onDatalayerCheck: function( node, checked, eOpts ){
				//turn data layer on/off
				if(checked){
					if(!node.data.layer){
						node.data.layer = this.datalayerBuilder.buildLayer(
								node.data.layerType, node.data);
						if(node.data.layer){
							this.addNewLayer(node);
							
							node.data.layer.setStyle(this.avlRenderer.getStyle);
							Core.EventManager.fireEvent("nics.datalayer.tracking.click", node.data);
						}
					}else{
						this.showLayer(node);
						Core.EventManager.fireEvent("nics.datalayer.tracking.click", node.data);
					}
				}else{
					if(node.data.layer){
						this.hideLayer(node);
						Core.EventManager.fireEvent("nics.datalayer.tracking.unclick", node.data);
					}//throw exception - no layer found on the node
				}
			}
        });
    });
