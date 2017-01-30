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
define(['iweb/CoreModule', './OrganizationCapabilitiesController', './OrganizationCapabilitiesModel'],
		function(Core, OrgCapController, OrgCapModel) {
	
	return Ext.define('modules.administration.OrganizationCapabilitiesView', {
		extend: 'Ext.Panel',

	 	controller: 'organizationcapabilitiescontroller',
	 	
	 	reference: 'orgCapsView',
	 	
	 	title: 'Organization Capabilities',
	    
	    collapsible: true,
	    
	    autoWidth: true,
	    
	    initComponent: function(){
			this.callParent();
			
		},
		
		items:[{
			xtype: 'grid',
			title: 'Capabilities',
			reference: 'orgCapsGrid', 
			height: 400,
			store: {
				model: 'modules.administration.OrganizationCapabilitiesModel'
			},
			columns:[{
					text: 'Description',
		            dataIndex: 'description',
		            flex: 1
				},
				{
					text: 'Active Web',
					dataIndex: 'activeWeb',
		            flex: 1,
					renderer: function (value, meta, record) {
						if(record.get("activeWeb") === true){
							return '<img height=20 width=20 src="images/collabroom/bullet_green.png"/>';
						}
						return '<img height=20 width=20 src="images/collabroom/bullet_red.png"/>';
					}
				},
				{
					text: 'Active Mobile',
					dataIndex: 'activeMobile',
		            flex: 1,
		            renderer: function (value, meta, record) {
						if(record.get("activeMobile") === true){
							return '<img height=20 width=20 src="images/collabroom/bullet_green.png"/>';
						}
						return '<img height=20 width=20 src="images/collabroom/bullet_red.png"/>';
					}
				}
			],
			listeners: {
	        	cellclick: 'onCellClick'
	        }
		
		}],
		
		getOrgCapGrid: function(){
			return this.lookupReference('orgCapsGrid');
		},
		
		clearGrid: function(){
			var grid = this.getOrgCapGrid();
			
			if(grid.getStore().getCount() > 0){
				grid.getStore().removeAll();
			}
		}
		
	    
	});
});