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
define(['ext', 'iweb/CoreModule', './PresenceModel', './PresenceListener', 'nics/modules/UserProfileModule'],
         function(Ext, Core, PresenceModel, PresenceListener, UserProfile){
	
	return Ext.define('modules.whiteboard.PresenceController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.presencecontroller',

		init: function(){
			this.emptyStore = this.view.getStore();
			
			this.mediator = Core.Mediator.getInstance();

			Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.onLoadUserProfile.bind(this));
			Core.EventManager.addListener("nics.archived.collabroom.load", this.onLoadUserProfile.bind(this));
			Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
			
			Core.EventManager.addListener("nics.collabroom.open", this.onOpenCollabRoom.bind(this));
			Core.EventManager.addListener("nics.collabroom.close", this.onCloseCollabRoom.bind(this));
			Core.EventManager.addListener("nics.collabroom.activate", this.onActivateCollabRoom.bind(this));
			
			//buffer our mouse/key listener so it doesn't needless fired constantly
			this.onActivity = Ext.Function.createBuffered(this.onActivity, 200, this);
            Ext.EventManager.addListener(document, 'mousemove', this.onActivity);
            Ext.EventManager.addListener(document, 'keypress', this.onActivity);

		},
		
		onLoadUserProfile: function(e) {
			this.user = this.user || {};
			this.user.userId = UserProfile.getUserId();
			this.user.username = UserProfile.getUsername();
			this.user.nickname = UserProfile.getFirstName() + " " + UserProfile.getLastName();
			this.user.organization = UserProfile.getOrgName();
		},
		
		onJoinIncident: function(e, incident) {
			this.incidentId = incident.id;
		},
		
		onOpenCollabRoom: function(e, menuItem) {
			var name = menuItem.text;
			var collabroomId = menuItem.collabRoomId;
			
			var storeId = this.getStoreId(collabroomId);
			var store = Ext.data.StoreManager.lookup(storeId);
			if (!store) {
				store =  new Ext.data.Store({
					storeId: storeId,
					model: PresenceModel,
					sorters: ['nickname']
				});
				store.plistener = new PresenceListener(store,
						this.user, this.incidentId, collabroomId);
			}
			
			this.view.reconfigure(store);
		},
		
		onCloseCollabRoom: function(e, menuItem) {
			var name = menuItem.text;
			var collabRoomId = menuItem.collabRoomId;
			
			var storeId = this.getStoreId(collabRoomId);
			var store = Ext.data.StoreManager.lookup(storeId);
			if (store) {
				if (store === this.view.getStore()) {
					this.view.reconfigure(this.emptyStore);
				}
				
				store.plistener = null;
				store.destroy();
			}
		},
		
		onActivateCollabRoom: function(e, collabRoomId) {
			var storeId = this.getStoreId(collabRoomId);
			var store = Ext.data.StoreManager.lookup(storeId);
			if (store) {
				this.view.reconfigure(store);
			} else {
				this.view.reconfigure(this.emptyStore);
			}
		},
		
		onActivity: function() {
			var store = this.view.store;
			if (store && store.plistener) {
				store.plistener.registerActivity();
			}
		},
		
		getStoreId: function(collabRoomId) {
			return Ext.String.format('whiteboard-presence-{0}', collabRoomId);
		}
	});
});
