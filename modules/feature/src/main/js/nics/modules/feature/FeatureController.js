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
define(['ext', 'iweb/CoreModule', './FeatureTopicListener','nics/modules/UserProfileModule'],
         function(Ext, Core, FeatureTopicListener, UserProfile){
	
	//Constants file...
	var USER_TYPE = "user";
	var COLLABROOM_TYPE = "collabroom";
	
	return Ext.define('modules.feature.FeatureController', {
		
		init: function(){
			
			this.topicListeners = {};
			
			this.mediator = Core.Mediator.getInstance();

			Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.onLoadUserProfile.bind(this));

			Core.EventManager.addListener("nics.collabroom.close", this.onCloseCollabRoom.bind(this));
			Core.EventManager.addListener("nics.collabroom.activate", this.onActivateCollabRoom.bind(this));
		},

		onLoadUserProfile: function(e, userProfile){
			//create myMap listener on initial UserProfile load
			if (!this.myMapListener) {
				this.myMapListener = new FeatureTopicListener(
						USER_TYPE, UserProfile.getUserId(), UserProfile.getUsername());
			
				//Create listener for My Map
				this.setActiveTopicListener(this.myMapListener, false);
			}
			
			//update the current room read-only setting
			if (this.activeTopicListener && this.activeRoom &&
					this.activeTopicListener.featureType !== USER_TYPE) {
				var readOnly = UserProfile.isReadOnly() || this.activeRoom.readOnly;
				this.setActiveTopicListener(this.activeTopicListener, readOnly);
			}
		},
		
		createTopicListener: function (id, featureType) {
			var layerId = this.getLayerId(id);
			var topicListener = new FeatureTopicListener(featureType, id, 
					UserProfile.getUsername(), UserProfile.getUserId());
			
			this.topicListeners[layerId] = topicListener;
			
			return topicListener;
		},

		onCloseCollabRoom: function (e, menuItem) {
			var name = menuItem.name;
			var collabRoomId = menuItem.collabRoomId;
			
			//cleanup topic listener
			var layerId = this.getLayerId(collabRoomId);
			if (this.topicListeners[layerId]) {
				this.topicListeners[layerId].close();
				
				//if the closed room was the active one
				if (this.topicListeners[layerId] === this.activeTopicListener) {
					this.setActiveTopicListener(null);
					this.activeRoom = null;
				}
				
				delete this.topicListeners[layerId];
			}
		},

		onActivateCollabRoom: function(e, collabRoomId, readOnly, collabRoomName, collabRoom) {
			var topicListener;
			if(collabRoomId == 'myMap'){
				topicListener = this.myMapListener;
				readOnly = false; //All users can update their map
			}else{
				var layerId = this.getLayerId(collabRoomId);
				topicListener = this.topicListeners[layerId];
			}
			
			if (!topicListener) {
				topicListener = this.createTopicListener(collabRoomId, COLLABROOM_TYPE);
			}

			this.setActiveTopicListener(topicListener, readOnly);
			this.activeRoom = collabRoom;
		},

		setActiveTopicListener: function(topicListener, readOnly) {
			if(this.activeTopicListener){
				this.activeTopicListener.disable();
			}
			
			this.activeTopicListener = topicListener;
			
			if(this.activeTopicListener){
				this.activeTopicListener.enable(readOnly);
			}
		},
		
		//Utility functions
		getLayerId: function(collabRoomId) {
			return Ext.String.format('drawing-layer-{0}', collabRoomId);
		}
	});
});
