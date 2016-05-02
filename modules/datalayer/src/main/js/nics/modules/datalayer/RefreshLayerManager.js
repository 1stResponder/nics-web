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
define(["./TokenManager", "iweb/modules/MapModule"], 
	function(TokenManager, MapModule){
	
		var refreshManager = new function() {
			
			var timers = {};
			
			function _addLayer(refreshRate, datalayerid, layer, datasourceid){
				if(refreshRate > 0 && timers[refreshRate] == null){
					timers[refreshRate] = Ext.TaskManager.newTask({
						run: function(){
							for(var i=0; i<this.layers.length; i++){
								if(this.layers[i].datasourceid){
									var expires = TokenManager.getExpired(this.layers[i].datasourceid);
									var nextRefresh = (new Date()).getTime() + this.interval;
									if((expires - nextRefresh) < this.interval){
										TokenManager.getToken(this.layers[i].datasourceid,{
												fnc: MapModule.getMapController().reloadLayer,
												scope: MapModule.getMapController(),
												params: [this.layers[i].layer]
										});
									}
								}
								MapModule.getMapController().reloadLayer(this.layers[i].layer);
							}
						},
						layers : [],
						interval: refreshRate * 1000 //milliseconds 
					});
					timers[refreshRate].start();
				}else if(timers[refreshRate].layers.length == 0){
					//restart the timer
					timers[refreshRate].start();
				}
				
				timers[refreshRate].layers.push({ datalayerid: datalayerid, layer: layer, datasourceid: datasourceid });
			};
			
			function _removeLayer(refreshRate, datalayerid){
				if(refreshRate > 0){
					var timer = timers[refreshRate];
					for(var i=0; i<timer.layers.length; i++){
						if(timer.layers[i].datalayerid == datalayerid){
							timer.layers.splice(i,1);
							break;
						}
					}
					if(timer.layers.length == 0){
						timer.stop();
					}
				}
			};
			
			return {
				
				addLayer: function(refreshRate, datalayerid, layer, datasourceid){
					return _addLayer(refreshRate, datalayerid, layer, datasourceid);
				},
				
				removeLayer: function(refreshRate, datalayerid){
					_removeLayer(refreshRate, datalayerid);
				}
			}
		};
		
		return refreshManager;
});
