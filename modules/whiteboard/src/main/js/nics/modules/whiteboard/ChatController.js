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
define(['ext', 'iweb/CoreModule', './ChatTopicListener', './ChatProxy', './ChatModel',
         'nics/modules/UserProfileModule'],
         function(Ext, Core, ChatTopicListener, ChatProxy, ChatModel, UserProfile){
	
	return Ext.define('modules.whiteboard.ChatController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.chatcontroller',

		init: function(){
			this.mediator = Core.Mediator.getInstance();

			Core.EventManager.addListener("nics.collabroom.open", this.onOpenCollabRoom.bind(this));
			Core.EventManager.addListener("nics.collabroom.close", this.onCloseCollabRoom.bind(this));
			Core.EventManager.addListener("nics.collabroom.activate", this.onActivateCollabRoom.bind(this));
		},

		onPanelLayout: function() {
			//calling mask before the panel is expanded causes bad placement
			if (!this.getActiveStore() && !this.view.masked) {
				this.mask();	
			}
		},
		
		onOpenCollabRoom: function (e, menuItem) {
			var name = menuItem.name;
			var collabRoomId = menuItem.collabRoomId;

			var storeId = this.getStoreId(collabRoomId);
			var store = Ext.data.StoreManager.lookup(storeId);
			if (!store) {
				var url = Ext.String.format('{0}/chatmsgs/{1}?sortByColumn=created&sortOrder=DESC',
						Core.Config.getProperty(UserProfile.REST_ENDPOINT), collabRoomId);
				
				store = Ext.create('Ext.data.Store', {
					model: 'modules.whiteboard.ChatModel',
					storeId: storeId,
					
					pageSize: 50,
					autoSync: true,
					clearOnPageLoad: false,
					
					proxy: {
						type: 'chat',
						url: url,
						
			            reader: {
			                rootProperty: 'chats',
			                messageProperty: 'message'
			            }
					},
					
					remoteSort: false,
			        sorters: [{
			            property: 'created',
			            direction: 'DESC'
			        }]
				});

				//attach our listener and load
				var topic = Ext.String.format('iweb.NICS.collabroom.{0}.chat', collabRoomId);
				new ChatTopicListener(topic, store);
				store.load();
			}

			this.setActiveStore(store);
			this.toggleDisableChat(false);
			this.unmask();
		},

		onCloseCollabRoom: function (e, menuItem) {
			var name = menuItem.name;
			var collabRoomId = menuItem.collabRoomId;
			
			//cleanup the store
			var storeId = this.getStoreId(collabRoomId);
			var store = Ext.data.StoreManager.lookup(storeId);
			if (store) {
				store.destroy();
				
				//if the closed room was the active one
				if (store === this.getActiveStore()) {
					this.setActiveStore(null);
					this.toggleDisableChat(true);
					this.mask();
				}
			}
			
		},

		onActivateCollabRoom: function(e, collabRoomId, readOnly) {

			var storeId = this.getStoreId(collabRoomId);
			var store = Ext.data.StoreManager.lookup(storeId);
			if (store) {
				this.setActiveStore(store);
				this.toggleDisableChat(readOnly);
				this.unmask();
			}else{
				this.setActiveStore(null);
				this.toggleDisableChat(true);
				this.mask();
			}
		},

		onChatBoxSpecialKey: function(field, e){
			if (e.getKey() == e.ENTER) {
				e.preventDefault();
				this.attemptNewChatMessage();
			}
		},
		
		onSendButtonClick: function() {
			this.attemptNewChatMessage();
		},
		
		attemptNewChatMessage: function() {
			var msgBox = this.lookupReference('chatBox');
			var msgText = msgBox.getValue().trim();
			if (msgText && msgText.length && msgBox.isValid()) {
				msgBox.setValue('');
				
				this.activeStore.add({
					message: msgText,
					userorgid: UserProfile.getUserOrgId(),
					seqnum: Date.now()
				});
			}
		},
		
		toggleDisableChat: function(disabled) {
			this.lookupReference('chatBox').setDisabled(disabled);
		},

		getActiveStore: function() {
			return this.activeStore;
		},
		
		setActiveStore: function(store) {
			this.lookupReference('chatLog').setStore(store);
			this.activeStore = store;
		},
		
		mask: function() {
			this.view.mask("Choose a Collaboration Room to use the Whiteboard", "chat-nonloading-mask");
		},
		
		unmask: function() {
			this.view.unmask();
		},
		
		getStoreId: function(collabRoomId) {
			return Ext.String.format('whiteboard-chat-{0}', collabRoomId);
		}

	});
});
