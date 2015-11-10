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
define(["ext", "iweb/CoreModule", "nics/modules/UserProfileModule"], function(Ext, Core, UserProfile) {
	return Ext.define(null, {
		extend: 'Ext.app.ViewController',
		
		/**
		 * NOTE: This Controller has a different life-cycle then usual.
		 * Our controller is created immediately on startup and reused for all ShareWorkspaceWindows
		 * so that it can maintain state about the current collabroom.
		 * 
		 * As such, this class may get onActivateRoom callbacks before it has a view attached. 
		 */
		constructor: function(){
			this.callParent(arguments);
			
			this.mediator = Core.Mediator.getInstance();
			this.restEndpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);
			
			Core.EventManager.addListener("nics.collabroom.activate", this.onActivateRoom.bind(this));
			Core.EventManager.addListener("logout", this.onLogout.bind(this));
			window.addEventListener("beforeunload", this.onLogout.bind(this));
		},
		
		/**
		 * Called when we are initialized with a view
		 */
		init: function() {
			this.checkDisableButton(this.currentRoomId);
		},
		
		/**
		 * Disables the active/inactive buttons when in no room or our workspace
		 */
		checkDisableButton: function(roomId) {
			var isMyMap = (roomId == null || roomId === "myMap"); 
			this.lookupReference("segmentedButton").setDisabled(isMyMap);
		},
		
		/**
		 * Set the button states to inactive
		 */
		inactivateButton: function() {
			this.lookupReference("activeButton").toggle(false);
			this.lookupReference("inactiveButton").toggle(true);
		},
		
		/**
		 * Fired when the active room changes
		 * Note, could fire before our UI is initialized
		 */
		onActivateRoom: function(evt, roomId) {
			//we inactivate before we update the current room
			if (this.view != null && !this.view.isDestroyed) {
				this.inactivateButton();
				this.checkDisableButton(roomId);
			}
			
			this.currentRoomId = roomId;
		},
		
		/**
		 * Fired when the user logs out
		 */
		onLogout: function(evt) {
			//inactivate to be sure we have unshared
			if (this.view != null && !this.view.isDestroyed) {
				this.inactivateButton();
			}
		},
		
		/**
		 * Fired when the active/inactive toggle is switched
		 */
		onActiveToggle: function(button, pressed, eOpts) {
			if (pressed) {
				this.shareWorkspace();
			} else {
				this.unshareWorkspace();
			}
		},
		
		/**
		 * Fired on window close
		 */
		onWindowClose: function() {
			this.inactivateButton();
		},
		
		/**
		 * Call the API to share the workspace with the current room
		 */
		shareWorkspace: function() {
			var userId = UserProfile.getUserId();
			var url = Ext.String.format('{0}/features/user/{1}/share?collabRoomId={2}',
					this.restEndpoint, userId, this.currentRoomId);
			var topic = "nics.collabroom.feature.share." + userId;			
			
			this.mediator.sendPostMessage( url, topic, {});
		},

		/**
		 * Call the API to unshare the workspace with the current room
		 */
		unshareWorkspace: function() {
			var userId = UserProfile.getUserId();
			var url = Ext.String.format('{0}/features/user/{1}/unshare?collabRoomId={2}',
					this.restEndpoint, userId, this.currentRoomId);
			var topic = "nics.collabroom.feature.unshare." + userId;
			
			this.mediator.sendPostMessage( url, topic, {});
		}
	});

});