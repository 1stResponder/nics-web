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
	
	return Ext.define('modules.administration.OrganizationCapabilitiesController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.organizationcapabilitiescontroller',

		init: function(){
			this.mediator = Core.Mediator.getInstance();
			
			Core.EventManager.addListener('nics.admin.orgcaps.get', this.getOrgCaps.bind(this));
			Core.EventManager.addListener('nics.admin.orgcaps.onupdate', this.onUpdateOrgCaps.bind(this));
		},
		
		loadOrgCaps: function(orgId){
		
			this.currentOrg = orgId;
		
			var url = Ext.String.format('{0}/orgs/{1}/orgcaps/{2}', 
				Core.Config.getProperty(UserProfile.REST_ENDPOINT), 
				UserProfile.getWorkspaceId(), 
				this.currentOrg);
		
			this.mediator.sendRequestMessage(url,'nics.admin.orgcaps.get');
		
		},
		
		getOrgCaps: function(evt, response){
			
			this.getView().clearGrid();
					
			this.getView().getOrgCapGrid().getStore().loadRawData(response.orgCaps);
			
		},
		
		onUpdateOrgCaps: function(event, response){
			if(response.message == "OK"){	
				this.lookupReference('orgCapsGrid').getStore().commitChanges();
			}else{
				Ext.MessageBox.alert("Status", response);
			}
		},
		
		onCellClick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts){
			
			var topic = "nics.admin.orgcaps.onupdate";
			var webMobileUpdate = "";
			var updated = false;
		
	 		if(cellIndex == 1){
	 			webMobileUpdate = 'activeWeb=' + !record.get('activeWeb');
	 			record.set('activeWeb',!record.get('activeWeb'));
	 			updated = true;
	 		}	
	 		else if(cellIndex == 2){
	 			webMobileUpdate += 'activeMobile=' + !record.get('activeMobile');
	 			record.set('activeMobile',!record.get('activeMobile'));
	 			updated = true;
	 		}
	 		
	 		if(updated){
				
				var url = Ext.String.format("{0}/orgs/{1}/orgcaps/{2}?{3}" ,
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId(),
					record.get('orgCapId'),
					webMobileUpdate
				);
				
				this.mediator.sendPostMessage(url,topic);
				
			}
	 	}
		
	});
});
