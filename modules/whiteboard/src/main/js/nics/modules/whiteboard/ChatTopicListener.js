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
define(['ext', 'iweb/CoreModule', './ChatModel'], function(Ext, Core, ChatModel){
	
	return Ext.define('modules.whiteboard.ChatTopicListener', {

		constructor: function(topic, store) {
			this.topic = topic;
			this.store = store;
			
			this.reader = new Ext.data.reader.Json({ model: ChatModel });
			
			this.mediator = Core.Mediator.getInstance();
			
			this.onChatMessage = this.onChatMessage.bind(this);
			Core.EventManager.addListener(this.topic, this.onChatMessage);
			
			Ext.data.StoreManager.on('remove', this.onRemoveStore, this);
			
			//Handle reconnect
			Core.EventManager.addListener("iweb.connection.reconnected", 
					this.onReconnect.bind(this));
		},
		
		onReconnect: function (e, time){
			var eventName = "chat.reconnect." + Core.Util.generateUUID();
			Core.EventManager.createCallbackHandler(eventName, this, function(evt, data){
				if(data.chats){
					for(var i=0; i<data.chats.length; i++){
						Core.EventManager.fireEvent(this.topic, data.chats[i]);
					}
				}
			});
			
			if(this.store.getProxy()){
				this.mediator.sendRequestMessage(Ext.String.format(
						'{0}&dateColumn=created&fromDate={1}', 
						this.store.getProxy().getUrl(), time), eventName);
			}
		},
		
		onRemoveStore: function (store) {
			if (store === this.store) {
				//cleanup listeners
				Core.EventManager.removeListener(this.topic, this.onChatMessage);
				
				Ext.data.StoreManager.un('remove', this.onRemoveStore, this);
			}
		},
		
		onChatMessage: function (e, message) {
			var resultSet = this.reader.read(message);
			var chats = resultSet.records;
			this.safelyAddMessages(chats);
		},
		
		/**
		 * If we are syncing, wait till we are done to add,
		 * this helps avoid duplicates
		 */
		safelyAddMessages: function(chats) {
			if (this.store.isSyncing){
				this.store.on('endupdate', this.safelyAddMessages, this, {args: [chats], single:true});
			} else {
				this.addMessages(chats);
			}
		},
		
		addMessages: function(chats) {
			chats.forEach(function(chat){
				var id = chat.getId();

				var previous = this.store.getById(id);
				if(!previous){
					this.store.add(chat);
				}	
			}, this);
		}
		
	});

});
