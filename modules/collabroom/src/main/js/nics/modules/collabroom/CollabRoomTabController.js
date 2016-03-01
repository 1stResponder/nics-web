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
define(["iweb/CoreModule", 'nics/modules/UserProfileModule'], 

	function(Core, UserProfile){
	
		return Ext.define('modules.incident.CollabRoomTabController', {
		
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.collabroomtabcontroller',
			
			init: function(){
				this.addTab(null, { collabRoomId: 'myMap', name: 'Workspace', featureType: 'user' });
				
				Core.EventManager.addListener("nics.collabroom.open", this.addTab.bind(this));
				Core.EventManager.addListener("nics.incident.close", this.removeAllTabs.bind(this));
				Core.EventManager.addListener("nics.incident.close.tab", this.removeTab.bind(this));
			},
		 
			addTab: function(evt, collabRoom){
				var view = this.getView();
				if(!view.hasTab(collabRoom.name)){
					view.setActiveTab(view.addTab(collabRoom));
				}else{
					Ext.MessageBox.alert("NICS", "You are already in the collaboration room " +
							collabRoom.name + ". To view this room, select the tab from above.");
				}
			},
			
			removeAllTabs: function(evt){
				var tabs = this.getView().items.items;//pretty sure we can do this better
				while(tabs.length > 1){
					//this.getView().remove(tabs[tabs.length-1]);
					tabs[tabs.length-1].close(); //Fire event
				}
			},
			
			removeTab: function(evt, collabRoomId){
				var tab = this.getView().getTab(collabRoomId);
				if(tab){
					this.getView().removeTab(tab);
					this.onTabClose(tab);
				}
			},
			
			onTabClose: function(tab){
				Core.EventManager.fireEvent("nics.collabroom.close", tab.collabRoom);
			},
			
			onTabActivate: function(tab){
				Core.EventManager.fireEvent("nics.collabroom.activate", tab.collabRoom.collabRoomId, UserProfile.isReadOnly());
			}
		});
});
