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
define(['ext', 'iweb/CoreModule', './CollabRoomController'], function(Ext, Core) {

	var  buttonStyle = 'nontb_style';
	
	return Ext.define('modules.collabroom.CollabRoomViewer', {
	 
	 	extend: 'Ext.Button',
	 	
	 	requires: [ 'Ext.Panel', 'Ext.Button', 'Ext.form.TextField', 'Ext.Container', 'Ext.menu.Item' ],
	 	
	 	controller: 'collabroomcontroller',
		
		initComponent: function(){
	 		this.callParent();
	 	},
	 	
	 	config: {
	 		text : 'Rooms',
			baseCls: buttonStyle,
			cls: 'rooms-btn',
			menu: {
				xtype : 'menu',
				cls: 'rooms-menu',
				forceLayout : true,
				autoWidth: true,
				
				referenceHolder: true,
				
				items:[
					{
						text: 'Create New Room',
						reference: 'createRoomBtn',
						handler: 'onCreateBtnClick',
						disabled: true
					 },
					 { xtype : 'menuseparator' }
				]
			}
	 	},
	 	
	 	addMenuItem: function(collabRoom){
	 		if(collabRoom && collabRoom.name){
	 			var collabRoomName = collabRoom.name.substring(
						collabRoom.name.indexOf('-') + 1, collabRoom.name.length);
	 			
	 			return this.menu.add(Ext.create('Ext.menu.Item',{
					text: Ext.String.htmlEncode(collabRoomName),
					collabRoom: collabRoom,
					featureType: 'collabroom'
				}));
	 		}
		},
	
		clearMenuItems: function(){
			//Start at 2 to avoid removing the Create Room Button and menu separator
			while(this.menu.items.length > 2){
				this.menu.remove(this.menu.items.get(this.menu.items.length-1));
			}
		}
	 });
});
