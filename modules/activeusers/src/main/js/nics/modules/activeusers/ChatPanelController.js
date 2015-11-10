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
define(['ext', 'iweb/CoreModule'], function(Ext, Core) {

	return Ext.define('modules.activeusers.ChatPanelController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.chatpanelcontroller',
		
		chatMessageTpl: new Ext.Template([
		  		                        '<div>',
		  		          		  		  '<span class="pvtchatmsg-label">',
		  		          		  		    '{nickname} ({timestamp:date("n/j g:i:s A")}):',
		  		          		  		  '</span>',
		  		          		  		  ' {message:htmlEncode}',
		  		          		  		'</div>'
		  		          		  	]).compile(),
		  		          		  	
		statusMessageTpl: new Ext.Template([
		  		                        '<div>',
		  		          		  	      '<span class="pvtchatmsg-system-label" data-qtip="{timestamp:date("n/j g:i:s A")}">',
		  		          		  	        '{message:htmlEncode}',
		  		          		  	      '</span>',
		  		          		  	    '</div>'
		  		          		   ]).compile(),
		
	 	init: function(){
	 		this.callParent(arguments);

	 		this.roomId = this.view.roomId;
	 		this.channel = this.view.channel;
	 		this.user = this.view.user;
	 		
			this.mediator = Core.Mediator.getInstance();
			this.mediator.subscribe(this.channel);
			
			//save bind for remove later
			this.onChatTopicMessage = this.onChatTopicMessage.bind(this);
			Core.EventManager.addListener(this.channel, this.onChatTopicMessage);
			
			this.occupants = Ext.Array.unique(this.view.occupants);
			this.updateOccupantList();
			
			this.addNotificationTool();
	 	},
	 	
	 	destroy: function() {
	 		this.callParent(arguments);
	 		
			this.mediator.unsubscribe(this.channel);
			Core.EventManager.removeListener(this.channel, this.onChatTopicMessage);
			
			this.dropTarget.destroy();
	 	},
	 	
	 	onRender: function() {
	 		var dropEl = this.lookupReference('chatLog').el;
	 		
            this.dropTarget = new Ext.dd.DropTarget(dropEl, {
                ddGroup: 'privateChatDDGroup',
                notifyEnter: this.onNotifyDragEnter.bind(this),
                notifyDrop: this.onNotifyDragDrop.bind(this),
                notifyOver: function(ddSource, evt, data) {
                	//always return the current status, we
                	//decide dragStatus on 'enter'
                	return ddSource.proxy.dropStatus;
                }
            });
	 	},
	 	
	 	onNotifyDragEnter: function(ddSource, evt, data) {
	 		var newUsers = this.getNewUsers(data.records);
	 		if (newUsers.length) {
	 			var dropEl = this.lookupReference('chatLog').el;
	        	dropEl.stopAnimation();
	        	dropEl.highlight();
	        	return this.dropTarget.dropAllowed;
	 		}
	 		return this.dropTarget.dropNotAllowed;
	 	},
	 	
	 	onNotifyDragDrop: function(ddSource, evt, data) {
            var newUsers = this.getNewUsers(data.records);
            if (newUsers.length) {
	            Core.EventManager.fireEvent('inviteAdditionalUsers', {
	            	roomId: this.roomId,
	            	to: newUsers,
	            	occupants: this.occupants
	            });
	            
	            var names = newUsers.map(function(occupant){
		            return occupant.nickname;
		        });
		 		
	            var message = Ext.String.format("Invitation sent to {0}",
	            		names.join(', '));
	            this.addStatusMessage(message, Date.now());
	            return true;
            }
            return false;
	 	},
	 	
	 	onChatTopicMessage: function(e, msg) {
	 		switch (msg.type) {
	 			case "message":
	 				this.onOccupantMessage(msg);
	 				break;
	 			case "join":
	 				this.onOccupantJoin(msg);
	 				break;
	 			case "leave":
	 				this.onOccupantLeave(msg);
	 				break;
	 		}
	 	},
	 	
	 	onOccupantMessage: function(msg) {
			this.addUserMessage(msg.from, msg.text, msg.timestamp);
			
			this.attemptNotify(msg);
	 	},
	 	
	 	onOccupantJoin: function(msg) {
	 		this.addOccupant(msg.from);
	 		this.updateOccupantList();
 			
 			var status = Ext.String.format('{0} joined the chat', msg.from.nickname);
 			this.addStatusMessage(status, msg.timestamp);
 			
 			this.view.unmask();
	 	},
	 	
	 	onOccupantLeave: function(msg) {
			this.removeOccupant(msg.from);
				
			//if the last user leaves, don't change the occupants
			//to keep context
			if (this.occupants.length > 1) {
				this.updateOccupantList();
			}
 			
 			var status = Ext.String.format('{0} left the chat', msg.from.nickname);
 			this.addStatusMessage(status, msg.timestamp);
 			
 			this.view.unmask();
	 	},
	 	
		onChatBoxSpecialKey: function(field, e){
			if (e.getKey() == e.ENTER) {
				e.preventDefault();
				this.onSendButtonClick();
			}
		},
	 	
	 	onSendButtonClick: function() {
			var msgBox = this.lookupReference('chatBox');
			var msgText = msgBox.getValue().trim();
			if (msgText && msgText.length && msgBox.isValid()) {
				msgBox.setValue('');
				
		 		this.mediator.publishMessage(this.view.channel, {
		 			topic: this.view.channel,
		 			type: 'message',
		 			
		 			from: this.view.user,
		 			text: msgText,
		 			timestamp: Date.now()
		 		});
			}
	 	},
	 	
	 	onChatPanelClose: function() {
	 		this.mediator.publishMessage(this.view.channel, {
	 			topic: this.view.channel,
	 			type: 'leave',
	 			
	 			from: this.view.user,
	 			timestamp: Date.now()
	 		});
	 	},
	 	
	 	promptAcceptInvitation: function (user) {
	 		var msg = Ext.String.format(
	 				'{0} is inviting you to a private chat. Accept?',
	 				user.nickname);
	 		
	 		var msgBox = new Ext.window.Window({
	 			title: 'Private Chat Invitation',
	 			
	 		    draggable: false,
	 		    closable: false,
	 		    modal: true,
	 			
	 			items: [{
	 				xtype: 'box',
	 				html: msg
	 			}],
	 			
	 			buttons:[{
	 				text: 'Yes',
	 				minWidth: 75,
	 				handler: this.acceptInvitation,
	 				scope: this
	 			},
	 			{
	 				text: 'No',
	 				minWidth: 75,
	 				handler: this.rejectInvitation,
	 				scope: this
	 			}]
	 		});
	 		
	 		this.view.add(msgBox);
	 		msgBox.show();
	 	},
	 	
	 	acceptInvitation: function (button, e) {
	 		button.up('window').destroy();
	 		
	 		this.mediator.publishMessage(this.view.channel, {
	 			topic: this.view.channel,
	 			type: 'join',
	 			
	 			from: this.view.user,
	 			timestamp: Date.now()
	 		});
	 	},
	 	
	 	rejectInvitation: function (button, e) {
	 		button.up('window').destroy();
	 		
	 		//our close listener will handle event firing
	 		this.view.close();
	 	},
	 	
	 	
	 	waitAcceptInvitation: function () {
	 		this.view.mask("Waiting for participants to accept invitiation");
	 	},
	 	
	 	addUserMessage: function (user, msg, timestamp) {
	 		var logEl = this.lookupReference('chatLog').el;
	 		this.chatMessageTpl.append(logEl, {
	 			nickname: user.nickname,
	 			message: msg,
	 			timestamp: new Date(timestamp)
	 		});
	 		this.scrollToEnd();
	 	},

	 	addStatusMessage: function (msg, timestamp) {
	 		var logEl = this.lookupReference('chatLog').el;
	 		this.statusMessageTpl.append(logEl, {
	 			message: msg,
	 			timestamp: new Date(timestamp)
	 		});
	 		this.scrollToEnd();
	 	},
	 	
	 	addOccupant: function (occupant) {
	 		//attempt a remove to prevent duplicates
	 		this.removeOccupant(occupant);
	 		this.occupants.push(occupant);
	 	},
	 	
	 	removeOccupant: function (occupant) {
	 		var item = Ext.Array.findBy(this.occupants, function(item, index) {
	 			return item.userId === occupant.userId;
	 		});
	 		Ext.Array.remove(this.occupants, item);
	 	},
	 	
	 	hasOccupant: function(userId) {
	 		return null !== Ext.Array.findBy(this.occupants, function(item, index) {
	 			return item.userId === userId;
	 		});
	 	},
	 	
	 	getNewUsers: function(userModels) {
            return userModels.reduce(function(prev, value, idx, array){
            	var userId = value.get('userId');
            	if (!this.hasOccupant(userId)) {
                	prev.push({
                		userId: userId,
                		nickname: value.get('fullname')
                	});
            	}
            	return prev;
            }.bind(this), []);
	 	},
	 	
	 	updateOccupantList: function() {
	 		var names = this.occupants.map(function(occupant){
	 			return occupant.nickname;
	 		});
	 		var occupants = names.join(',<br>');
	 		
	 		
	 		var title = occupants;
	 		if (this.occupants.length > 1) {
	 			title = this.occupants.length + ' Occupants';
	 		}
	 		this.view.setTitle(title);
	 		
	 		
	 		//over-reaching a bit here. better way?
	 		if (this.view.tab) {
	 			var tooltip = "Occupants:<br>" + occupants;
	 			this.view.tab.setTooltip(tooltip);
	 		}
	 	},
	 	
		scrollToEnd: function() {
			var logEl = this.lookupReference('chatLog').el.dom;
			logEl.scrollTop = logEl.scrollHeight;
		},
	 	
	 	addNotificationTool: function() {
	 		//if this browser supports Notifications API
	 		if (window.Notification) {
	 			this.lookupReference('notifyButton').show();
	 		}
	 	},
	 	
	 	onNotificationToggle: function(btn, pressed) {
	 		if (pressed) {
	 			Notification.requestPermission(
	 					this.onNotificationPermission.bind(this));
	 		} else {
	 			this.notify = false;
	 		}
	 	},
	 	
	 	onNotificationPermission: function(status) {
	 		var allowed = (status === "granted");
	 		this.notify = allowed;
	 		
	 		this.lookupReference('notifyButton').toggle(allowed);
	 	},
	 	
	 	attemptNotify: function(msg) {
	 		if (this.notify && msg.from.userId !== this.user.userId ) {
	 			var description = Ext.String.format(
	 					"{0} says: {1}", msg.from.nickname, msg.text);
	 			
	 			var note = new Notification("NICS Private Chat Message", {
	 				tag: this.channel,
	 				body: description,
	 				icon: 'images/activeusers/private-chat.png'
	 			});
	 			
	 			note.onclick = this.onNotificationClick.bind(this);
	 			
	 			//ensure the notification is closed
	 			note.onshow = function () { 
	 				  setTimeout(note.close.bind(note), 5000); 
	 			};
	 		}
	 	},
	 	
	 	onNotificationClick: function() {
	 		var container = this.view.up('container');
	 		container.setActiveItem(this.view);
	 		
	 		//if our container supports collapse and is collapsed
	 		if (container.collapsed) {
	 			container.expand();
	 		}
	 	}
	 	
	 });
});
