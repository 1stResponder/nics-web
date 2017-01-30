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
define(['ext', 'iweb/CoreModule', './ChatModel','nics/modules/UserProfileModule'], 
		function(Ext, Core, ChatModel,UserProfile){
	
	return Ext.define('modules.whiteboard.PresenceListener', {

		ACTIVE: "ACTIVE",
		IDLE: "IDLE",
		LEAVING: "LEAVING",
		
		constructor: function(store, user, incidentId, collabroomId) {
			this.store = store;
			this.user = user;
			
			this.url = this.getUrl(incidentId, collabroomId);
			this.topic = this.getTopic(collabroomId);
			this.callbackTopic = this.topic + ".callback";
			
			this.mediator = Core.Mediator.getInstance();
			
			//cache bound instances for removeListener to work later
			this.onPresenceMessage = this.onPresenceMessage.bind(this);
			this.onPresenceResponse = this.onPresenceResponse.bind(this);

			this.listen();
			
			this.task = Ext.TaskManager.newTask({
				run: this.reportPresence,
				scope: this,
				interval: 120000 //2 minutes 
			});
			this.postPresence(this.ACTIVE);
		},
		
		/**
		 * Callback fired when a store is removed from the StoreManager.
		 * This indicated our store is destroyed, since there is no destroy event.
		 */
		onRemoveStore: function (store) {
			if (store === this.store) {
				this.unlisten();
				this.postPresence(this.LEAVING);
				this.task.destroy();
			}
		},
		
		/**
		 * Attach our various event listeners
		 */
		listen: function() {
			Core.EventManager.addListener(this.topic, this.onPresenceMessage);
			Core.EventManager.addListener(this.callbackTopic, this.onPresenceResponse);
			
			this.store.on('add', this.onStoreAddUpdate, this);
			this.store.on('update', this.onStoreAddUpdate, this);
			
			Ext.data.StoreManager.on('remove', this.onRemoveStore, this);
		},
		
		/**
		 * Remove our various event listeners
		 */
		unlisten: function() {
			Core.EventManager.removeListener(this.topic, this.onPresenceMessage);
			Core.EventManager.removeListener(this.callbackTopic, this.onPresenceResponse);
			
			this.store.un('add', this.onStoreAddUpdate, this);
			this.store.un('update', this.onStoreAddUpdate, this);
			
			Ext.data.StoreManager.un('remove', this.onRemoveStore, this);
		},
		
		/**
		 * Notifies this listener that user activity has occurred. 
		 */
		registerActivity: function() {
			this.activity = true;
			
			//report return from idle immediately
			if (this.lastStatus === this.IDLE) {
				this.reportPresence();
			}
		},
		
		/**
		 * Callback fired by our task on a regular interval.
		 */
		reportPresence: function() {
			//was there activity since last report?
			this.lastStatus = this.activity ? this.ACTIVE : this.IDLE;
			this.activity = false;
			
			this.postPresence(this.lastStatus);
		},
		
		/**
		 * A convenience method to post a provided status to the API.
		 */
		postPresence: function(status) {
			
			this.mediator.sendPostMessage(this.url, this.callbackTopic, {
				username: this.user.username,
				nickname: this.user.nickname,
				organization: this.user.organization,
				status: status
			});
		},
		
		/**
		 * Callback fired on response to our post presence call.
		 */
		onPresenceResponse: function (e, message) {
			var results = message.results;
			
			var oldModels = this.store.getRange();
			var newModels = this.store.add(results);
			
			//this custom handling is for the relayed removal effect
			var missing = Ext.Array.difference(oldModels, newModels);
			missing.forEach(function(record){
				record.set('status', this.LEAVING);
			}, this);
			
			//restart the task delay
			this.task.restart();
		},
		
		/**
		 * Callback fired when a message arrives on the presence topic.
		 */
		onPresenceMessage: function (e, message) {
			this.store.add(message);
		},
		
		/**
		 * Callback fired when a record is added or updated on our store.
		 */
		onStoreAddUpdate: function(store, itemOrArray) {
			var records = [].concat(itemOrArray);
			
			var leaving = records.filter(function(record){
				return record.get('status') == this.LEAVING;
			}, this);
			
			if (leaving.length) {
				//schedule removal after a delay
				setTimeout(this.removeLeavingItems.bind(this, leaving), 20000);
			}
			
		},
		
		/**
		 * Removes all provided records with a status of LEAVING.
		 */
		removeLeavingItems: function(records) {
			records.forEach(function(record){
				//'refresh' our record in case its 'stale'
				record = this.store.getById(record.getId());
				if (record.get('status') == this.LEAVING) {
					this.store.remove(record);
				}
			}, this);
		},
		
		getUrl: function(incidentId, collabroomId) {
			/*return Ext.String.format("{0}/collabroom/{1}/{2}?username={3}", 
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					incidentId, collabroomId, UserProfile.getUsername());*/
			return Ext.String.format("{0}/collabroom/{1}/{2}",
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					incidentId, collabroomId);
		},
		
		getTopic: function(collabroomId) {
			return Ext.String.format("iweb.NICS.collabroom.{0}.presence", collabroomId);
		}
		
	});

});
