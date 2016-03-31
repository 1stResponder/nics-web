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
define(['ext', 'iweb/CoreModule', 'nics/modules/UserProfileModule'], 
		
		function(Ext, Core, UserProfile){
	
	return Ext.define('modules.activeusers.PrivateChatController', {

		constructor: function(chatPanelBuilder){
			this.builder = chatPanelBuilder;
			this.mediator = Core.Mediator.getInstance();

			Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.onLoadUserProfile.bind(this));
			Core.EventManager.addListener('startPrivateChat', this.onStartPrivateChat.bind(this));
			Core.EventManager.addListener('inviteAdditionalUsers', this.onInviteAdditionalUsers.bind(this));
		},
		
		onLoadUserProfile: function(e) {
			this.user = {
				userId: UserProfile.getUserId(),
				nickname: UserProfile.getFirstName() + " " + UserProfile.getLastName()
			};
			
			
			//listen for direct messages, requesting a private chat
			var directMessageChannel = this.getDirectMessageChannel(this.user.userId);
			this.mediator.subscribe(directMessageChannel);
			Core.EventManager.addListener(directMessageChannel, this.onDirectMessage.bind(this));
		},
		
		onDirectMessage: function(e, message) {
			if (message.type == "chat-invitation") {
				var from = message.from;
				var occupants = message.occupants;
				var roomId = message.roomId;
				var channel = this.getPrivateChatChannel(roomId);
				
				//create a new chat window, it will handle confirming the invite
				var panel = this.builder.buildAndPlace({
					roomId: roomId,
					channel: channel,
					user: this.user,
					occupants: occupants
				});
				panel.controller.promptAcceptInvitation(from);
			}
		},
		
		onStartPrivateChat: function(e, message) {
			var chatRoomId = Core.Util.generateUUID();
			
			var channel = this.getPrivateChatChannel(chatRoomId);
			var to = message.to;
			var from = this.user;
			var occupants = [from].concat(to);
			
			//build the UI
			var panel = this.builder.buildAndPlace({
				roomId: chatRoomId,
				channel: channel,
				user: from,
				occupants: occupants
			});
			panel.controller.waitAcceptInvitation();
			
			this.sendInvitations(chatRoomId, to, from, occupants);
		},
		
		onInviteAdditionalUsers: function(e, message) {
			var chatRoomId = message.roomId;
			var to = message.to;
			var occupants = message.occupants;
			var from = this.user;
			
			this.sendInvitations(chatRoomId, to, from, occupants);
		},
		
		sendInvitations: function(chatRoomId, to, from, occupants) {
			
			to.forEach(function(user){
				var userChannel = this.getDirectMessageChannel(user.userId);
				
				//TODO: can we move topic out of the payload?
				this.mediator.publishMessage(userChannel, {
					topic: userChannel,
					type: 'chat-invitation',
					roomId: chatRoomId,
					from: from,
					occupants: occupants
				});
			}, this);
		},
		
		getPrivateChatChannel: function(uuid) {
			return Ext.String.format("iweb.NICS.private.{0}", uuid);
		},
		
		getDirectMessageChannel: function(userId) {
			return Ext.String.format("iweb.NICS.direct.{0}", userId);
		}
	});
});
