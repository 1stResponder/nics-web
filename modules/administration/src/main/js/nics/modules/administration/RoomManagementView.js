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
define(['./RoomManagementController', 'nics/modules/collabroom/SecureRoomView','nics/modules/UserProfileModule'],
		function(RoomManagementController, SecureRoomView, UserProfile) {
	
	return Ext.define('modules.administration.RoomManagementView', {
	 
	 	extend: 'Ext.Window',

	 	controller: 'roommanagementcontroller',
	 	
	 	closeAction: "hide",
	 
	 	initComponent: function(){
			this.callParent();
			
			var secureRoomView = new SecureRoomView();
			secureRoomView.setReference('managePermissions');
			
			this.add(secureRoomView);
			
			this.add({ 
				xtype: 'checkbox',
				boxLabel: 'Unsecure Room',
				name: 'secureRoom',
				reference: 'secureRoomCB',
				disabled: true,
				margins: '10 20 0 0'
			});
	 	},
	 	
	 	config: {
	 		width: 500,
	 		height: 600,
	 		layout: {
	            type: 'vbox',
	            align: 'stretch'
	        },
	        title: 'Room Management'
	 	},
	 	
	 	buttons: [ { 
        	  xtype: 'button', 
        	  text: 'Apply',
        	  reference: 'applyButton',
        	  handler: 'updateCollabRoom'
          },
          { 
        	  xtype: 'button', 
        	  text: 'Cancel',
        	  handler: 'closeManager'
        }],
	 	
	 	showManager: function(){
	 		this.isManager = true;
	 		this.lookupReference('secureRoomCB').enable();
	 	},
	 	
	 	hideManager: function(){
	 		this.isManager = false;
	 		this.lookupReference('secureRoomCB').disable();
	 	},
	 	
	 	uncheck: function(){
	 		this.lookupReference('secureRoomCB').setValue(false);
	 	}
	 });
});
