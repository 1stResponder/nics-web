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
	
	return Ext.define('modules.administration.OrganizationController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.organizationcontroller',
		
		orgListTopic: 'nics.admin.orgs',

		init: function(){
			Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.loadUserProfile.bind(this));
			Core.EventManager.addListener(this.orgListTopic, this.onLoadOrgs.bind(this));
			Core.EventManager.addListener("nics.admin.org.clear", this.clearSelection.bind(this));
			Core.EventManager.addListener("nics.admin.org.new", this.addNewOrgs.bind(this));
			Core.EventManager.addListener("nics.org.orgtype.new", this.addOrgType.bind(this));
			Core.EventManager.addListener("nics.org.orgtype.remove", this.removeOrgType.bind(this));
			
			this.mediator = Core.Mediator.getInstance();
		},
		
		loadUserProfile: function(evt){
			if(UserProfile.isSuperUser()){
				this.url = Ext.String.format('{0}/orgs/{1}/all', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT), 
						UserProfile.getWorkspaceId());
				
				this.lookupReference('orgFormPanel').lookupReference('newButton').setHidden(false);
				this.lookupReference('orgFormPanel').lookupReference('submitButton').setDisabled(false);
			}else{
				this.url = Ext.String.format('{0}/orgs/{1}/admin?userId={2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT), 
						UserProfile.getWorkspaceId(), UserProfile.getUserId());
			}
		},
		
		load: function(){
			this.mediator.sendRequestMessage(this.url, this.orgListTopic);
		},
		
		addNewOrgs: function(evt, response){
			if(response){
				this.lookupReference('orgGrid').store.loadRawData(response, true);
			}
		},
		
		onLoadOrgs: function(evt, response){
			if(response && response.organizations){
				this.lookupReference('orgGrid').store.loadRawData(response.organizations);
			}
		},
		
		addOrgType: function(evt, response){
			var grid = this.lookupReference('orgGrid');
			var record = grid.store.getAt(grid.store.find("orgId", response.orgId));
			if(record){
				record.data.orgTypes.push({ orgtypeid: response.orgTypeId });
			}
		},
		
		removeOrgType: function(evt, response){
			var grid = this.lookupReference('orgGrid');
			var record = grid.store.getAt(grid.store.find("orgId", response.orgId));
			var match = Ext.Array.findBy(record.data.orgTypes, 
					function(orgType){
						if(orgType.orgtypeid == response.orgTypeId){
							return true;
						}
			});
			record.data.orgTypes = Ext.Array.remove(record.data.orgTypes, match);
		},
		
		onSelectionChange: function(grid, selected, eOpts) {
			if(selected[0]){
				var panel = this.lookupReference('orgFormPanel');
				var orgForm = panel.lookupReference('orgForm');
				orgForm.getViewModel().set(selected[0].data);
				panel.controller.updateView();
				
				this.lookupReference('userView').getController().loadUsers(null, selected[0].data.orgId);
			}
		},
		
		clearSelection: function(){
			this.lookupReference('orgGrid').getSelectionModel().deselectAll();
		}
	});
});
