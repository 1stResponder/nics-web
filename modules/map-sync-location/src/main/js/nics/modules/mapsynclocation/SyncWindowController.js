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
define(['ext', 'iweb/CoreModule', 'iweb/modules/MapModule', 'nics/modules/UserProfileModule'],
	function(Ext, Core, Map, UserProfile){
	
		return Ext.define('modules.mapsynclocation.SyncWindowController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.mapsynclocation.syncwindowcontroller',
			
			roomStates: {},
			collabRoomId: null,
			
			init: function() {
				Core.EventManager.addListener("nics.collabroom.open", this.onOpenCollabRoom.bind(this));
				Core.EventManager.addListener("nics.collabroom.close", this.onCloseCollabRoom.bind(this));
				Core.EventManager.addListener("nics.collabroom.activate", this.onActivateCollabRoom.bind(this));
				
				this.onMapSync = this.onMapSync.bind(this);
				
				Core.View.getMainContentComponent().on("resize", this.onMapResize, this);
			},
			
			getCollabroomSyncTopic: function(collabRoomId) {
				return Ext.String.format("iweb.NICS.mapsync.{0}", collabRoomId);
			},
			
			listenToMapSync: function(collabRoomId) {
				var topic = this.getCollabroomSyncTopic(collabRoomId);
				Core.Mediator.getInstance().subscribe(topic);
				Core.EventManager.addListener(topic, this.onMapSync);
			},
			
			unlistenToMapSync: function(collabRoomId) {
				var topic = this.getCollabroomSyncTopic(collabRoomId);
				Core.Mediator.getInstance().unsubscribe(topic);
				Core.EventManager.removeListener(topic, this.onMapSync);
			},

			onOpenCollabRoom: function(e, menuItem) {
				var collabRoomId = menuItem.collabRoomId;
				this.roomStates[collabRoomId] = {};
				this.listenToMapSync(collabRoomId);
			},
			
			onCloseCollabRoom: function(e, menuItem) {
				var collabRoomId = menuItem.collabRoomId;
				if (collabRoomId in this.roomStates) {
					delete this.roomStates[collabRoomId];
				}
				this.unlistenToMapSync(collabRoomId);
				
				//if the closed room was the active room
				if (collabRoomId === this.collabRoomId) {
					this.collabRoomId = null;
				}
			},
			
			onActivateCollabRoom: function(e, collabRoomId, readOnly) {
				var wndw = this.getView();
				
				if (this.collabRoomId !== null) {
					//store the state for the active room
					this.roomStates[this.collabRoomId] = {
						disableSync: !this.lookupReference('syncChk').checked,
						mapExtent: this.getCurrentMapExtent()
					};
				}
				
				//read saved state for newly activated room
				this.collabRoomId = collabRoomId;
				var prevState = this.roomStates[collabRoomId] || {};
				
				this.updateCurrentMapExtent(prevState.mapExtent);
				
				if (collabRoomId === "myMap") {
					wndw.close();
				} else {
					this.lookupReference('syncChk').setChecked(!prevState.disableSync);
					this.lookupReference('syncBtn').setDisabled(readOnly);
					
					this.placeWindow(wndw);
				}
			},
			
			onMapResize: function() {
				var wndw = this.getView();
				if (!wndw.isHidden()) {
					this.placeWindow(wndw);
				}
			},
			
			placeWindow: function(wndw) {
				// Allign the window to the bottom left edge of the map
				// use positionable because floating.alignTo causes odd scrolling behavior
				wndw.showBy(Core.View.getMainContentComponent(), "bl-bl", [20, -20]);
			},
			
			onMapSync: function(e, msg){
				//if this isn't our own message
				if (msg.currentUserSessionId !== UserProfile.getCurrentUserSessionId()) {
						
						var state = this.roomStates[msg.collabRoomId] || {};
						if (state.disableSync !== true) {
							state.mapExtent = msg.extent;
							
							if (msg.collabRoomId === this.collabRoomId) {
								this.updateCurrentMapExtent(msg.extent);
							}
						}
				}
			},
			
			onSyncToggle: function(checkitem, checked, eOpts ) {
				var state = this.roomStates[this.collabRoomId];
				if (state) {
					state.disableSync = !checked;
				}
			},
			
			onSyncClick: function(){
				var topic = this.getCollabroomSyncTopic(this.collabRoomId);
				
				Core.Mediator.getInstance().publishMessage(topic, {
					'extent': this.getCurrentMapExtent(),
					'collabRoomId': this.collabRoomId,
					'currentUserSessionId': UserProfile.getCurrentUserSessionId()
				});
			},
			
			getCurrentMapExtent: function() {
				var olMap = Map.getMap(),
						olView = olMap.getView();
				return olView.calculateExtent(olMap.getSize());
			},
			
			updateCurrentMapExtent: function(extent) {
				if (extent) {
					var olMap = Map.getMap(),
							olView = olMap.getView();
					olView.fit(extent, olMap.getSize(), {
						'nearest': true
					});
				}
			}
		});
});
