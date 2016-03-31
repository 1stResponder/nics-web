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
define(['iweb/CoreModule','./OrganizationView', './AdminController'],
		function(Core, OrganizationView) {

	return Ext.define('modules.administration.AdminView', {
	 
	 	extend: 'Ext.window.Window',
	 	
	 	referenceHolder: true,
	 	
	 	controller: 'admincontroller',
	 	
	 	closeAction: 'hide',
	 	
	 	autoScroll: true,
	 	
	 	layout: 'fit',
	 	
	 	referenceHolder: true,
	 	
	 	reference: 'adminButtonRef',
	 	
	 	itemId: 'adminButtonItemId',
	 	
	 	listeners: {
	 		close: 'onClose'
	 	},
	 	
	 	initComponent: function(){
	 		var main = Core.View.getMainContentComponent();
			var height = 300;
			var width = 300;
			
			if(main){
				height = main.getHeight() * .75;
				width = main.getWidth() *.5;
			}
			
			this.setHeight(height);
			this.setWidth(width);
	 		
			this.callParent();
			
			this.lookupReference('adminTabPanel').add(new OrganizationView({ gridHeight: height *.33 }));
	 	},
	 	
	 	load: function(){
	 		this.lookupReference('orgView').getController().load();
	 	},
	 	
	 	items: [
	 	        {
	 	        	xtype: 'tabpanel',
	 	        	reference: 'adminTabPanel',
	 	        	layout: 'fit'
	 	        }
	 	]
	 });
});